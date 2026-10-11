require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing from .env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeScamMessage = async (message) => {
  if (!message || !message.trim()) {
    throw new Error("Message is required for AI analysis");
  }

  let text;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `
Analyze the following message for scam or fraud:

"${message}"

Return ONLY valid JSON in this exact format:

{
  "scamType": "PHISHING",
  "riskScore": 92,
  "riskLevel": "HIGH",
  "explanation": "Short explanation"
}

Allowed scamType values ONLY:
PHISHING, JOB_SCAM, UPI_FRAUD, LOAN_SCAM, INVESTMENT_SCAM, KYC_SCAM, LOTTERY_SCAM, IMPERSONATION, DELIVERY_SCAM, ROMANCE_SCAM, TECH_SUPPORT_SCAM, OTHER.

Rules:
- scamType MUST be exactly one of the allowed values.
- riskScore MUST be an integer between 0 and 100.
- riskLevel MUST be exactly LOW, MEDIUM, or HIGH.
- explanation MUST be short, clear, and easy to understand.
- Return JSON only.
`,
    });
    text = response.text;
  } catch (err) {
    console.warn("AI service spike, using fallback heuristic classifier:", err.message);
    const lower = message.toLowerCase();
    let scamType = "OTHER";
    let riskScore = 50;

    if (lower.includes("kyc") || lower.includes("pan") || lower.includes("aadhaar") || lower.includes("blocked")) {
      scamType = "KYC_SCAM";
      riskScore = 88;
    } else if (lower.includes("upi") || lower.includes("paytm") || lower.includes("gpay") || lower.includes("phonepe")) {
      scamType = "UPI_FRAUD";
      riskScore = 90;
    } else if (lower.includes("electricity") || lower.includes("power") || lower.includes("disconnect")) {
      scamType = "PHISHING";
      riskScore = 86;
    } else if (lower.includes("job") || lower.includes("salary") || lower.includes("part time")) {
      scamType = "JOB_SCAM";
      riskScore = 82;
    } else if (lower.includes("lottery") || lower.includes("won") || lower.includes("prize")) {
      scamType = "LOTTERY_SCAM";
      riskScore = 94;
    } else if (lower.includes("invest") || lower.includes("crypto") || lower.includes("trading")) {
      scamType = "INVESTMENT_SCAM";
      riskScore = 89;
    }

    return {
      scamType,
      riskScore,
      riskLevel: riskScore >= 75 ? "HIGH" : riskScore >= 50 ? "MEDIUM" : "LOW",
      explanation: `Heuristic security scan detected indicators characteristic of ${scamType.replace("_", " ")}.`,
    };
  }

  if (!text) {
    throw new Error("AI returned an empty response");
  }

  const cleanedText = text
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let result;

  try {
    result = JSON.parse(cleanedText);
  } catch (error) {
    throw new Error("AI returned invalid JSON");
  }


  // Validate AI output
  const allowedScamTypes = [
    "PHISHING",
    "JOB_SCAM",
    "UPI_FRAUD",
    "LOAN_SCAM",
    "INVESTMENT_SCAM",
    "KYC_SCAM",
    "LOTTERY_SCAM",
    "IMPERSONATION",
    "DELIVERY_SCAM",
    "ROMANCE_SCAM",
    "TECH_SUPPORT_SCAM",
    "OTHER",
  ];

  const allowedRiskLevels = [
    "LOW",
    "MEDIUM",
    "HIGH",
  ];

  if (!allowedScamTypes.includes(result.scamType)) {
    throw new Error("AI returned an invalid scam type");
  }

  if (
    !Number.isInteger(result.riskScore) ||
    result.riskScore < 0 ||
    result.riskScore > 100
  ) {
    throw new Error("AI returned an invalid risk score");
  }

  if (!allowedRiskLevels.includes(result.riskLevel)) {
    throw new Error("AI returned an invalid risk level");
  }

  if (
    !result.explanation ||
    typeof result.explanation !== "string"
  ) {
    throw new Error("AI returned an invalid explanation");
  }

  return {
    scamType: result.scamType,
    riskScore: result.riskScore,
    riskLevel: result.riskLevel,
    explanation: result.explanation,
  };
};

module.exports = {
  analyzeScamMessage,
};