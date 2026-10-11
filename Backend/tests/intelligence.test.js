/**
 * Phase 3 Intelligence Subsystem Integration Tests
 * Run with: node tests/intelligence.test.js
 */

const BASE_URL = process.env.TEST_API_URL || "http://localhost:5000/api";

const runTests = async () => {
  console.log("=== PHASE 3 INTELLIGENCE INTEGRATION TESTS ===");
  let passed = 0;
  let total = 0;

  const assert = (condition, msg) => {
    total++;
    if (!condition) {
      console.error(`FAIL: ${msg}`);
      throw new Error(`Assertion failed: ${msg}`);
    }
    console.log(`PASS: ${msg}`);
    passed++;
  };

  // 1. SSRF Protection: Loopback IP
  console.log("\n[TEST 1] SSRF Guard: Loopback IP (127.0.0.1)");
  const loopbackRes = await fetch(`${BASE_URL}/intelligence/analyze-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "http://127.0.0.1:8080/internal-admin" }),
  }).then((r) => r.json());

  assert(loopbackRes.isBlockedBySecurity === true, "Loopback IP is blocked by security");
  assert(loopbackRes.verifiedFacts?.isPrivateNetworkAddress === true, "Flagged as private network address");
  assert(loopbackRes.aiInterpretation?.riskLevel === "HIGH", "High risk alert assigned to SSRF attempt");

  // 2. SSRF Protection: Cloud Instance Metadata IP (169.254.169.254)
  console.log("\n[TEST 2] SSRF Guard: AWS/GCP Metadata Endpoint (169.254.169.254)");
  const metadataRes = await fetch(`${BASE_URL}/intelligence/analyze-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "http://169.254.169.254/latest/meta-data/" }),
  }).then((r) => r.json());

  assert(metadataRes.isBlockedBySecurity === true, "Cloud metadata IP is blocked");
  assert(metadataRes.reputation === "MALICIOUS", "Malicious reputation assigned to metadata probing");

  // 3. URL Intelligence: Verified Facts vs AI Interpretation
  console.log("\n[TEST 3] URL Intelligence: Fact vs AI Distinction");
  const urlRes = await fetch(`${BASE_URL}/intelligence/analyze-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://sbi-kyc-update.xyz/verify-account" }),
  }).then((r) => r.json());

  assert(urlRes.success === true, "URL analysis succeeds");
  assert(urlRes.verifiedFacts?.tld === ".xyz", "Verified facts extracted TLD (.xyz)");
  assert(urlRes.verifiedFacts?.isHighRiskTld === true, "High risk TLD flagged in verified facts");
  assert(Array.isArray(urlRes.verifiedFacts?.detectedBrandKeywords), "Brand keywords detected");
  assert(urlRes.reputation === "SUSPICIOUS" || urlRes.reputation === "UNKNOWN", "Reputation is evaluated without false safe assumptions");
  assert(Number.isInteger(urlRes.aiInterpretation?.riskScore), "AI risk score is an integer");
  assert(Array.isArray(urlRes.aiInterpretation?.indicators), "AI indicators provided");

  // 4. Email Header Intelligence: Domain Mismatch & Auth Results
  console.log("\n[TEST 4] Email Intelligence: Header Mismatch & SPF/DKIM Analysis");
  await new Promise((r) => setTimeout(r, 1200));
  const emailRes = await fetch(`${BASE_URL}/intelligence/analyze-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      emailContent: "Your netbanking profile has been locked due to suspicious activity. Click here to confirm identity.",
      emailHeaders: `From: Security Team <security@bank.co.in>
Reply-To: phisher@scam-mail.top
Return-Path: <bounce@badserver.org>
Authentication-Results: spf=fail dkim=fail`,
    }),
  }).then((r) => r.json());

  assert(emailRes.success === true, "Email analysis succeeds");
  assert(emailRes.verifiedHeaderFacts?.hasReplyToMismatch === true, "Reply-To mismatch detected");
  assert(emailRes.verifiedHeaderFacts?.spfStatus === "FAIL", "SPF failure detected");
  assert(emailRes.verifiedHeaderFacts?.dkimStatus === "FAIL", "DKIM failure detected");
  assert(emailRes.aiInterpretation?.riskLevel === "HIGH", "High risk assigned to spoofed email");
  assert(Array.isArray(emailRes.aiInterpretation?.redFlags), "Red flags returned for email");

  // 5. Message Evidence Threat Scanner
  console.log("\n[TEST 5] Message Evidence Threat Scanner");
  await new Promise((r) => setTimeout(r, 1500));
  const msgRes = await fetch(`${BASE_URL}/intelligence/analyze-evidence`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "Dear customer your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer on 9876543210 immediately.",
      context: "manual",
    }),
  }).then((r) => r.json());

  if (!msgRes.success) {
    console.error("Test 5 Response error:", msgRes);
  }
  assert(msgRes.success === true, "Message analysis succeeds");
  assert(msgRes.data?.riskScore >= 70, "High risk score assigned to electricity disconnection scam");
  assert(Array.isArray(msgRes.data?.indicators) && msgRes.data.indicators.length > 0, "Specific threat indicators returned");
  assert(Array.isArray(msgRes.data?.safeNextSteps) && msgRes.data.safeNextSteps.length > 0, "Safe next steps provided");

  // 6. Scam Pattern Intelligence & Graph Correlation
  console.log("\n[TEST 6] Scam Pattern Graph Correlation");
  const patternRes = await fetch(`${BASE_URL}/intelligence/patterns?limit=25`).then((r) => r.json());

  assert(patternRes.success === true, "Pattern graph generation succeeds");
  assert(Array.isArray(patternRes.nodes), "Nodes array returned");
  assert(Array.isArray(patternRes.edges), "Edges array returned");
  if (patternRes.edges.length > 0) {
    const sampleEdge = patternRes.edges[0];
    assert(sampleEdge.relationship === "POSSIBLE", "Relationships are strictly labeled as POSSIBLE");
  }
  assert(typeof patternRes.disclaimer === "string", "Ethical non-accusatory disclaimer included");

  console.log(`\n=== ALL ${passed}/${total} PHASE 3 INTELLIGENCE TESTS PASSED ===\n`);
};

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
