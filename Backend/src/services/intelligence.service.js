require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const ScamReport = require("../models/ScamReport");
const { validateHostForSSRF, isPrivateIP } = require("../utils/ssrf.util");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing from .env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Known high-risk or commonly abused TLDs for fast heuristic flagging
const HIGH_RISK_TLDS = new Set([
  "xyz", "top", "club", "buzz", "work", "click", "vip", "icu", "tk", "ml", "ga", "cf", "gq",
  "cam", "monster", "rest", "fit", "surf", "casa", "country", "live", "link"
]);

// High-risk brand keywords frequently spoofed in fraudulent subdomains/URLs
const SPOOFED_BRAND_KEYWORDS = [
  "sbi", "hdfc", "icici", "axis", "pnb", "bob", "paytm", "phonepe", "gpay", "googlepay",
  "amazon", "flipkart", "indiapost", "bluedart", "fedex", "netflix", "kyc", "aadhaar",
  "pan", "income-tax", "lottery", "kbc", "reward", "cashback", "refund", "verify", "secure"
];

// =====================================================
// 1. EXTRACT TEXT FROM SCREENSHOT (OCR VIA GEMINI MULTIMODAL)
// =====================================================

const extractTextFromScreenshot = async ({ imageBase64, mimeType = "image/png" }) => {
  if (!imageBase64 || typeof imageBase64 !== "string") {
    const error = new Error("Valid base64 image data is required");
    error.statusCode = 400;
    throw error;
  }

  const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  const cleanMime = mimeType.toLowerCase();
  if (!allowedMimeTypes.includes(cleanMime)) {
    const error = new Error(`Unsupported file type: ${mimeType}. Allowed formats: PNG, JPEG, WebP.`);
    error.statusCode = 400;
    throw error;
  }

  // Clean base64 string if data URI header is included
  const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "").trim();

  // Validate size (max 5 MB binary is approx 6.8 MB base64 string)
  const estimatedSizeBytes = Math.round((base64Data.length * 3) / 4);
  if (estimatedSizeBytes > 5 * 1024 * 1024) {
    const error = new Error("File exceeds maximum size limit of 5 MB");
    error.statusCode = 400;
    throw error;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        {
          inlineData: {
            mimeType: cleanMime === "image/jpg" ? "image/jpeg" : cleanMime,
            data: base64Data,
          },
        },
        `You are an accurate OCR transcription assistant for ScamRadar threat intelligence.
Extract ALL legible text verbatim from this screenshot (e.g. SMS messages, WhatsApp chats, email headers, error popups, URLs, amounts, phone numbers).
Maintain line breaks and message order.
Do not add commentary, assumptions, or analysis.
If no legible text is visible in the image, output ONLY: NO_LEGIBLE_TEXT`,
      ],
    });

    const rawText = response.text ? response.text.trim() : "";

    if (!rawText || rawText === "NO_LEGIBLE_TEXT") {
      return {
        success: true,
        extractedText: "",
        hasText: false,
        message: "No legible text found in this screenshot. Please crop closer to the message or paste the text directly.",
      };
    }

    return {
      success: true,
      extractedText: rawText,
      hasText: true,
      message: "Text successfully extracted. You can review and edit before threat assessment.",
    };
  } catch (err) {
    console.error("Gemini OCR extraction failed:", err);
    throw new Error(`OCR processing failed: ${err.message}`);
  }
};

// =====================================================
// 2. SCAN & ANALYZE EXTRACTED MESSAGE / SCREENSHOT TEXT
// =====================================================

const analyzeScamEvidence = async ({ text, context = "manual" }) => {
  if (!text || !text.trim()) {
    const error = new Error("Text content is required for analysis");
    error.statusCode = 400;
    throw error;
  }

  const prompt = `Analyze this suspicious text or message for digital fraud and scam indicators:

"${text.trim().slice(0, 4000)}"

Return ONLY valid JSON in this exact structure:
{
  "scamType": "PHISHING",
  "riskScore": 95,
  "riskLevel": "HIGH",
  "explanation": "Detailed explanation of the psychological manipulation, spoofing, or fraudulent mechanisms used.",
  "indicators": [
    "Artificial urgency claiming immediate account suspension",
    "Unverified link pointing to suspicious domain",
    "Requests sensitive OTP or remote access"
  ],
  "safeNextSteps": [
    "Do not click any included links or download attachments",
    "Do not reply or negotiate with the sender",
    "Contact your bank fraud helpline directly to confirm account status"
  ]
}

Allowed scamType values ONLY:
PHISHING, JOB_SCAM, UPI_FRAUD, LOAN_SCAM, INVESTMENT_SCAM, KYC_SCAM, LOTTERY_SCAM, IMPERSONATION, DELIVERY_SCAM, ROMANCE_SCAM, TECH_SUPPORT_SCAM, OTHER.

Rules:
- riskScore MUST be an integer between 0 and 100.
- riskLevel MUST be LOW, MEDIUM, or HIGH.
- indicators must be a list of 2-5 concise red flags.
- safeNextSteps must be 3-5 immediate defensive steps.
- Return raw JSON only, without markdown fences.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  const rawText = response.text || "";
  const cleanedText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleanedText);
  } catch (err) {
    throw new Error("AI returned invalid JSON response for threat analysis");
  }

  const allowedTypes = [
    "PHISHING", "JOB_SCAM", "UPI_FRAUD", "LOAN_SCAM", "INVESTMENT_SCAM", "KYC_SCAM",
    "LOTTERY_SCAM", "IMPERSONATION", "DELIVERY_SCAM", "ROMANCE_SCAM", "TECH_SUPPORT_SCAM", "OTHER"
  ];

  return {
    scamType: allowedTypes.includes(parsed.scamType) ? parsed.scamType : "OTHER",
    riskScore: Number.isInteger(parsed.riskScore) ? Math.min(100, Math.max(0, parsed.riskScore)) : 50,
    riskLevel: ["LOW", "MEDIUM", "HIGH"].includes(parsed.riskLevel) ? parsed.riskLevel : "UNKNOWN",
    explanation: parsed.explanation || "No explanation provided.",
    indicators: Array.isArray(parsed.indicators) ? parsed.indicators : [],
    safeNextSteps: Array.isArray(parsed.safeNextSteps) ? parsed.safeNextSteps : [],
    analyzedAt: new Date().toISOString(),
    context,
  };
};

// =====================================================
// 3. URL INTELLIGENCE & NORMALIZATION (WITH SSRF GUARD)
// =====================================================

const analyzeUrlIntelligence = async (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") {
    const error = new Error("URL string is required");
    error.statusCode = 400;
    throw error;
  }

  // Pre-normalize URL
  let urlInput = rawUrl.trim();
  if (!/^https?:\/\//i.test(urlInput)) {
    urlInput = `http://${urlInput}`;
  }

  let parsed;
  try {
    parsed = new URL(urlInput);
  } catch (err) {
    const error = new Error("Invalid URL format");
    error.statusCode = 400;
    throw error;
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();
  const port = parsed.port || (protocol === "https:" ? "443" : "80");
  const pathname = parsed.pathname;
  const search = parsed.search;

  // SSRF Protection check on target hostname
  const ssrfCheck = await validateHostForSSRF(hostname);
  if (!ssrfCheck.isSafe) {
    return {
      success: true,
      isBlockedBySecurity: true,
      securityAlert: `SSRF Violation Blocked: ${ssrfCheck.reason}`,
      verifiedFacts: {
        rawInput: rawUrl,
        normalizedUrl: parsed.toString(),
        hostname,
        protocol,
        isPrivateNetworkAddress: true,
        ssrfStatus: "BLOCKED",
      },
      reputation: "MALICIOUS",
      aiInterpretation: {
        riskScore: 100,
        riskLevel: "HIGH",
        threatSummary: "Target resolves to a private, loopback, or cloud metadata network address. Likely SSRF attack attempt.",
        indicators: ["Attempts to target internal server infrastructure", "Restricted IP range detected"],
      },
    };
  }

  // Domain & TLD extraction
  const hostParts = hostname.split(".");
  const tld = hostParts.length > 1 ? hostParts[hostParts.length - 1] : "";
  const subdomains = hostParts.slice(0, Math.max(0, hostParts.length - 2));
  const mainDomain = hostParts.slice(-2).join(".");

  const isIpHost = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(":");
  const isPunycode = hostname.startsWith("xn--") || hostParts.some((p) => p.startsWith("xn--"));
  const hasHttps = protocol === "https:";
  const isHighRiskTld = HIGH_RISK_TLDS.has(tld);

  // Brand spoofing keyword detection in subdomains or path
  const detectedBrandKeywords = SPOOFED_BRAND_KEYWORDS.filter((kw) =>
    hostname.includes(kw) || pathname.toLowerCase().includes(kw)
  );

  // Cross-reference with existing ScamReport database
  const matchingReports = await ScamReport.find({
    identifierType: "URL",
    identifier: { $regex: hostname, $options: "i" },
  }).limit(5).select("_id identifier scamType riskScore riskLevel createdAt");

  const dbReportCount = matchingReports.length;

  // Verified Facts Object (strictly deterministic data)
  const verifiedFacts = {
    normalizedUrl: parsed.toString(),
    hostname,
    domain: mainDomain,
    tld: `.${tld}`,
    isHighRiskTld,
    subdomains,
    protocol,
    hasHttps,
    port,
    isIpHost,
    isPunycode,
    pathLength: pathname.length,
    queryParamCount: parsed.searchParams ? Array.from(parsed.searchParams.keys()).length : 0,
    detectedBrandKeywords,
    resolvedIps: ssrfCheck.resolvedIps || [],
    isNxDomain: !!ssrfCheck.isNxDomain,
    dbReportCount,
    matchingReports: matchingReports.map((r) => ({
      reportId: r._id.toString(),
      scamType: r.scamType,
      riskLevel: r.riskLevel,
      createdAt: r.createdAt,
    })),
  };

  // Reputation Signal: Treat unavailable third-party reputation strictly as UNKNOWN, never SAFE
  let reputation = "UNKNOWN";
  if (dbReportCount > 0) {
    reputation = "SUSPICIOUS";
  } else if (isHighRiskTld || isIpHost || isPunycode || detectedBrandKeywords.length > 1) {
    reputation = "SUSPICIOUS";
  } else {
    reputation = "UNKNOWN"; // Unavailable external reputation
  }

  // AI-Generated Interpretation
  const aiPrompt = `Perform cybersecurity threat intelligence on this URL:
URL: "${parsed.toString()}"
Hostname: "${hostname}"
TLD: ".${tld}" (High-risk TLD: ${isHighRiskTld})
IP-as-host: ${isIpHost}
Punycode/IDN: ${isPunycode}
HTTPS: ${hasHttps}
Detected Brand Keywords: ${detectedBrandKeywords.join(", ") || "none"}
Prior Database Incident Reports: ${dbReportCount}

Return ONLY valid JSON in this exact structure:
{
  "riskScore": 85,
  "riskLevel": "HIGH",
  "threatSummary": "Clear concise summary of potential intent (e.g. lookalike credential harvester).",
  "suspectedTargetBrand": "Name of brand spoofed or None",
  "indicators": [
    "Uses high-risk TLD commonly associated with throwaway phishing domains",
    "Subdomain mimics banking login endpoint"
  ],
  "recommendedAction": "Do not enter credentials. Report to registrar abuse desk."
}

Rules:
- riskScore: 0 to 100 integer.
- riskLevel: LOW, MEDIUM, or HIGH.
- If domain is clearly a legitimate major entity (e.g. wikipedia.org, github.com), score appropriately low.
- Return raw JSON only without markdown fences.`;

  let aiInterpretation = {
    riskScore: 50,
    riskLevel: "MEDIUM",
    threatSummary: "Heuristic evaluation based on domain structure and prior registry reports.",
    suspectedTargetBrand: detectedBrandKeywords[0] || "Unknown",
    indicators: detectedBrandKeywords.length > 0 ? [`Contains brand keywords: ${detectedBrandKeywords.join(", ")}`] : [],
    recommendedAction: "Exercise caution. Verify domain spelling before submitting credentials.",
  };

  try {
    const aiResp = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: aiPrompt,
    });
    const cleaned = (aiResp.text || "")
      .replace(/^```json\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    const parsedAi = JSON.parse(cleaned);
    aiInterpretation = {
      riskScore: Number.isInteger(parsedAi.riskScore) ? parsedAi.riskScore : aiInterpretation.riskScore,
      riskLevel: ["LOW", "MEDIUM", "HIGH"].includes(parsedAi.riskLevel) ? parsedAi.riskLevel : "UNKNOWN",
      threatSummary: parsedAi.threatSummary || aiInterpretation.threatSummary,
      suspectedTargetBrand: parsedAi.suspectedTargetBrand || "None",
      indicators: Array.isArray(parsedAi.indicators) ? parsedAi.indicators : [],
      recommendedAction: parsedAi.recommendedAction || aiInterpretation.recommendedAction,
    };
  } catch (err) {
    console.warn("AI URL analysis error:", err.message);
  }

  return {
    success: true,
    url: parsed.toString(),
    verifiedFacts,
    reputation,
    aiInterpretation,
  };
};

// =====================================================
// 4. EMAIL CONTENT & HEADER INTELLIGENCE
// =====================================================

const parseEmailHeaders = (headersText) => {
  if (!headersText || typeof headersText !== "string") return null;

  const lines = headersText.split(/\r?\n/);
  const headerMap = {};
  let currentKey = null;

  for (const line of lines) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) {
      currentKey = match[1].toLowerCase();
      headerMap[currentKey] = match[2].trim();
    } else if (currentKey && /^\s+/.test(line)) {
      // Continuation line (RFC 822 unfolding)
      headerMap[currentKey] += ` ${line.trim()}`;
    }
  }

  const fromRaw = headerMap["from"] || "";
  const replyToRaw = headerMap["reply-to"] || "";
  const returnPathRaw = headerMap["return-path"] || "";
  const subject = headerMap["subject"] || "";
  const date = headerMap["date"] || "";
  const authResults = headerMap["authentication-results"] || "";
  const receivedSpf = headerMap["received-spf"] || "";
  const dkimSig = headerMap["dkim-signature"] || "";

  // Extract email address helper
  const extractEmail = (str) => {
    const m = str.match(/<([^>]+)>/) || str.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    return m ? m[1].toLowerCase().trim() : "";
  };

  const extractDomain = (email) => {
    const parts = email.split("@");
    return parts.length === 2 ? parts[1].toLowerCase() : "";
  };

  const fromEmail = extractEmail(fromRaw);
  const replyToEmail = extractEmail(replyToRaw);
  const returnPathEmail = extractEmail(returnPathRaw);

  const fromDomain = extractDomain(fromEmail);
  const replyToDomain = extractDomain(replyToEmail);
  const returnPathDomain = extractDomain(returnPathEmail);

  // Detect domain mismatches
  const hasReplyToMismatch = !!(replyToDomain && fromDomain && replyToDomain !== fromDomain);
  const hasReturnPathMismatch = !!(returnPathDomain && fromDomain && returnPathDomain !== fromDomain);

  // Authentication Signals
  const isSpfPass = /spf=pass/i.test(authResults) || /pass/i.test(receivedSpf);
  const isSpfFail = /spf=fail/i.test(authResults) || /fail/i.test(receivedSpf);
  const isDkimPass = /dkim=pass/i.test(authResults) || /header\.d=[^;]+.*pass/i.test(authResults);
  const isDkimFail = /dkim=fail/i.test(authResults);
  const isDmarcPass = /dmarc=pass/i.test(authResults);
  const isDmarcFail = /dmarc=fail/i.test(authResults);

  let spfStatus = "UNKNOWN";
  if (isSpfPass) spfStatus = "PASS";
  else if (isSpfFail) spfStatus = "FAIL";

  let dkimStatus = "UNKNOWN";
  if (isDkimPass) dkimStatus = "PASS";
  else if (isDkimFail) dkimStatus = "FAIL";

  let dmarcStatus = "UNKNOWN";
  if (isDmarcPass) dmarcStatus = "PASS";
  else if (isDmarcFail) dmarcStatus = "FAIL";

  return {
    rawFrom: fromRaw,
    fromEmail,
    fromDomain,
    rawReplyTo: replyToRaw,
    replyToEmail,
    replyToDomain,
    returnPathEmail,
    returnPathDomain,
    subject,
    date,
    hasReplyToMismatch,
    hasReturnPathMismatch,
    spfStatus,
    dkimStatus,
    dmarcStatus,
    hasDkimSignature: !!dkimSig,
    hasAuthenticationResults: !!authResults,
  };
};

const analyzeEmailIntelligence = async ({ emailContent, emailHeaders = "" }) => {
  if (!emailContent || !emailContent.trim()) {
    const error = new Error("Email body content is required for analysis");
    error.statusCode = 400;
    throw error;
  }

  // Parse optional email headers if provided
  const verifiedHeaderFacts = emailHeaders.trim() ? parseEmailHeaders(emailHeaders) : null;

  // AI Content Analysis
  const prompt = `Analyze this email communication for phishing, social engineering, impersonation, or extortion:

EMAIL CONTENT:
"${emailContent.trim().slice(0, 4000)}"

${verifiedHeaderFacts ? `VERIFIED HEADER FACTS:
From: ${verifiedHeaderFacts.fromEmail || "Unspecified"} (Domain: ${verifiedHeaderFacts.fromDomain})
Reply-To: ${verifiedHeaderFacts.replyToEmail || "None"}
From vs Reply-To Mismatch: ${verifiedHeaderFacts.hasReplyToMismatch ? "YES (DETECTED)" : "NO"}
From vs Return-Path Mismatch: ${verifiedHeaderFacts.hasReturnPathMismatch ? "YES (DETECTED)" : "NO"}
SPF Status: ${verifiedHeaderFacts.spfStatus}
DKIM Status: ${verifiedHeaderFacts.dkimStatus}
DMARC Status: ${verifiedHeaderFacts.dmarcStatus}
` : "HEADERS: Not provided by user."}

Return ONLY valid JSON in this exact structure:
{
  "scamType": "PHISHING",
  "riskScore": 92,
  "riskLevel": "HIGH",
  "explanation": "Clear explanation of how the email attempts deception.",
  "impersonatedEntity": "Recognized brand or None",
  "redFlags": [
    "Urgent language demanding account password change",
    "Reply-To domain does not match claimed organization"
  ],
  "safeRecommendations": [
    "Do not click verification link",
    "Mark email as phishing in your mail provider"
  ]
}

Allowed scamType values:
PHISHING, JOB_SCAM, UPI_FRAUD, LOAN_SCAM, INVESTMENT_SCAM, KYC_SCAM, LOTTERY_SCAM, IMPERSONATION, DELIVERY_SCAM, ROMANCE_SCAM, TECH_SUPPORT_SCAM, OTHER.

Rules:
- riskScore: 0-100 integer.
- riskLevel: LOW, MEDIUM, or HIGH.
- Return raw JSON only.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  const cleaned = (response.text || "")
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let aiInterpretation;
  try {
    aiInterpretation = JSON.parse(cleaned);
  } catch (err) {
    throw new Error("AI returned invalid JSON response for email analysis");
  }

  return {
    success: true,
    verifiedHeaderFacts,
    aiInterpretation: {
      scamType: aiInterpretation.scamType || "PHISHING",
      riskScore: Number.isInteger(aiInterpretation.riskScore) ? aiInterpretation.riskScore : 50,
      riskLevel: ["LOW", "MEDIUM", "HIGH"].includes(aiInterpretation.riskLevel) ? aiInterpretation.riskLevel : "UNKNOWN",
      explanation: aiInterpretation.explanation || "No explanation provided.",
      impersonatedEntity: aiInterpretation.impersonatedEntity || "None",
      redFlags: Array.isArray(aiInterpretation.redFlags) ? aiInterpretation.redFlags : [],
      safeRecommendations: Array.isArray(aiInterpretation.safeRecommendations) ? aiInterpretation.safeRecommendations : [],
    },
  };
};

// =====================================================
// 5. SCAM PATTERN INTELLIGENCE & GRAPH CORRELATION
// =====================================================

const getScamPatternGraph = async ({ scamType, city, riskLevel, limit = 35 } = {}) => {
  const query = {};
  if (scamType) query.scamType = scamType;
  if (city) query["location.city"] = new RegExp(city, "i");
  if (riskLevel) query.riskLevel = riskLevel;

  const maxNodes = Math.min(60, Math.max(10, parseInt(limit, 10) || 35));

  // Retrieve reports matching criteria
  const reports = await ScamReport.find(query)
    .sort({ createdAt: -1 })
    .limit(maxNodes)
    .select("_id identifier identifierType scamType riskScore riskLevel location message createdAt");

  const nodes = [];
  const edges = [];
  const nodeMap = new Map();

  const addNode = (node) => {
    if (!nodeMap.has(node.id)) {
      nodeMap.set(node.id, true);
      nodes.push(node);
    }
  };

  // Helper to mask PII
  const maskValue = (val, type) => {
    if (!val) return "Unknown";
    if (type === "PHONE") {
      const clean = val.replace(/\s+/g, "");
      return clean.length >= 7 ? `${clean.slice(0, 3)}****${clean.slice(-3)}` : "***";
    }
    if (type === "UPI") {
      const parts = val.split("@");
      return parts.length === 2 ? `${parts[0].slice(0, 3)}***@${parts[1]}` : "***@upi";
    }
    if (type === "EMAIL") {
      const parts = val.split("@");
      return parts.length === 2 ? `${parts[0].slice(0, 2)}***@${parts[1]}` : "***@email";
    }
    return val.length > 12 ? `${val.slice(0, 10)}...` : val;
  };

  // Index maps to identify shared relationships
  const identifierGroups = new Map();
  const cityGroups = new Map();
  const scamTypeGroups = new Map();

  reports.forEach((rep) => {
    const repId = rep._id.toString();
    const maskedId = maskValue(rep.identifier, rep.identifierType);

    // 1. Report Node
    addNode({
      id: `rep_${repId}`,
      label: `Incident #${repId.slice(-6)}`,
      type: "REPORT",
      scamType: rep.scamType,
      riskScore: rep.riskScore || 0,
      riskLevel: rep.riskLevel || "UNKNOWN",
      maskedIdentifier: maskedId,
      city: rep.location?.city || "Unspecified",
      state: rep.location?.state || "",
      createdAt: rep.createdAt,
    });

    // 2. Identifier Node
    const identNodeId = `ident_${rep.identifier.toLowerCase().trim()}`;
    addNode({
      id: identNodeId,
      label: maskedId,
      type: "IDENTIFIER",
      identifierType: rep.identifierType,
    });

    // Edge: Report -> Identifier
    edges.push({
      id: `e_${repId}_${identNodeId}`,
      source: `rep_${repId}`,
      target: identNodeId,
      relationship: "POSSIBLE",
      type: "ASSOCIATED_IDENTIFIER",
      confidence: 1.0,
      label: "POSSIBLE: Associated Identifier",
    });

    // Grouping for shared connection detection
    const cleanIdent = rep.identifier.toLowerCase().trim();
    if (!identifierGroups.has(cleanIdent)) identifierGroups.set(cleanIdent, []);
    identifierGroups.get(cleanIdent).push(`rep_${repId}`);

    if (rep.location?.city) {
      const c = rep.location.city.toLowerCase().trim();
      if (!cityGroups.has(c)) cityGroups.set(c, []);
      cityGroups.get(c).push({ repNode: `rep_${repId}`, cityName: rep.location.city });
    }

    if (!scamTypeGroups.has(rep.scamType)) scamTypeGroups.set(rep.scamType, []);
    scamTypeGroups.get(rep.scamType).push(`rep_${repId}`);
  });

  // Connect Reports sharing exact identifier
  identifierGroups.forEach((repList, ident) => {
    if (repList.length > 1) {
      for (let i = 0; i < repList.length - 1; i++) {
        for (let j = i + 1; j < repList.length; j++) {
          edges.push({
            id: `e_shared_${repList[i]}_${repList[j]}`,
            source: repList[i],
            target: repList[j],
            relationship: "POSSIBLE",
            type: "EXACT_IDENTIFIER_CORRELATION",
            confidence: 0.95,
            label: "POSSIBLE: Shared Identifier Corroboration",
          });
        }
      }
    }
  });

  // Geographic clusters
  cityGroups.forEach((items, cityKey) => {
    if (items.length > 1) {
      const locNodeId = `loc_${cityKey}`;
      addNode({
        id: locNodeId,
        label: items[0].cityName,
        type: "LOCATION",
        count: items.length,
      });

      items.forEach((item) => {
        edges.push({
          id: `e_${item.repNode}_${locNodeId}`,
          source: item.repNode,
          target: locNodeId,
          relationship: "POSSIBLE",
          type: "GEOGRAPHIC_CLUSTER",
          confidence: 0.65,
          label: "POSSIBLE: Geographic Proximity",
        });
      });
    }
  });

  // Tactical Modus Operandi Clusters
  scamTypeGroups.forEach((repList, typeName) => {
    if (repList.length >= 3) {
      const vectorNodeId = `vector_${typeName}`;
      addNode({
        id: vectorNodeId,
        label: `${typeName.replace(/_/g, " ")} Pattern`,
        type: "THREAT_VECTOR",
        count: repList.length,
      });

      repList.slice(0, 5).forEach((repNode) => {
        edges.push({
          id: `e_${repNode}_${vectorNodeId}`,
          source: repNode,
          target: vectorNodeId,
          relationship: "POSSIBLE",
          type: "TACTICAL_SIMILARITY",
          confidence: 0.70,
          label: "POSSIBLE: Similar Modus Operandi",
        });
      });
    }
  });

  return {
    success: true,
    totalNodes: nodes.length,
    totalEdges: edges.length,
    nodes,
    edges,
    disclaimer: "All inferred relationships and linkages are labeled as POSSIBLE based on heuristic pattern correlation. ScamRadar does not declare legal guilt or make judicial accusations.",
  };
};

module.exports = {
  extractTextFromScreenshot,
  analyzeScamEvidence,
  analyzeUrlIntelligence,
  analyzeEmailIntelligence,
  getScamPatternGraph,
};
