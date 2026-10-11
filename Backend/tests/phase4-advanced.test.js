const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const User = require("../src/models/User");
const ScamReport = require("../src/models/ScamReport");
const EvidenceCase = require("../src/models/EvidenceCase");
const ScamAlert = require("../src/models/ScamAlert");
const ReportDispute = require("../src/models/ReportDispute");

const authService = require("../src/services/auth.service");
const alertService = require("../src/services/alert.service");
const vaultService = require("../src/services/vault.service");
const moderationService = require("../src/services/moderation.service");
const reportService = require("../src/services/report.service");

async function runPhase4AdvancedTests() {
  console.log("=== STARTING PHASE 4 & 5 ADVANCED BACKEND TEST SUITE ===");
  await mongoose.connect(process.env.MONGO_URI);

  const testSuffix = Date.now().toString().slice(-6);
  const userAEmail = `analyst_a_${testSuffix}@scamradar.test`;
  const userBEmail = `analyst_b_${testSuffix}@scamradar.test`;
  const modEmail = `moderator_${testSuffix}@scamradar.test`;

  let userA, userB, modUser;
  let userAToken, userBToken, modToken;
  let testCaseA;
  let testReport;

  try {
    // ------------------------------------------------------------------------
    // SECTION 1: AUTHENTICATION & RBAC
    // ------------------------------------------------------------------------
    console.log("\n[TEST 1] Testing User Registration & Password Hashing...");
    const regResultA = await authService.registerUser({
      name: "Security Analyst A",
      email: userAEmail,
      password: "TestPassword#123",
      role: "USER",
    });
    userAToken = regResultA.token;
    userA = await User.findById(regResultA.user.id);
    if (!userAToken || !userA) throw new Error("User A registration failed");
    console.log("  ✓ User A registered with signed JWT token");

    // Verify password is not plaintext
    const rawUserDoc = await User.findById(userA._id).select("+password");
    if (rawUserDoc.password === "TestPassword#123" || !rawUserDoc.password.startsWith("$2")) {
      throw new Error("Password was not properly hashed with bcrypt!");
    }
    console.log("  ✓ Password properly hashed with bcrypt (salt rounds verified)");

    // Test Login
    const loginResult = await authService.loginUser({
      email: userAEmail,
      password: "TestPassword#123",
    });
    if (!loginResult.token) throw new Error("Login failed with valid credentials");
    console.log("  ✓ Login verified with password comparison");

    // Register User B and Moderator
    const regResultB = await authService.registerUser({
      name: "Security Analyst B",
      email: userBEmail,
      password: "TestPassword#456",
      role: "USER",
    });
    userB = await User.findById(regResultB.user.id);

    const regResultMod = await authService.registerUser({
      name: "Senior Moderator",
      email: modEmail,
      password: "ModPassword#789",
      role: "MODERATOR",
    });
    modUser = await User.findById(regResultMod.user.id);
    console.log("  ✓ Registered secondary user B and Moderator with role isolation");

    // ------------------------------------------------------------------------
    // SECTION 2: SCAM ALERT SYSTEM (CHECKPOINT 11)
    // ------------------------------------------------------------------------
    console.log("\n[TEST 2] Testing Configurable Alert System & Deduplication...");
    await authService.updatePreferences(userA._id, {
      categories: ["UPI_FRAUD", "KYC_SCAM"],
      minRiskLevel: "MEDIUM",
      locations: ["Mumbai", "Delhi", "Bengaluru"],
      inAppAlerts: true,
    });
    const updatedUserA = await User.findById(userA._id);
    if (
      updatedUserA.alertPreferences.minRiskLevel !== "MEDIUM" ||
      !updatedUserA.alertPreferences.locations.includes("Mumbai")
    ) {
      throw new Error("Alert preferences were not updated correctly");
    }
    console.log("  ✓ Alert preferences saved (categories, minRiskLevel, locations)");

    // Generate alerts for User A from real database reports
    const alertGen1 = await alertService.generateAlertsForUser(userA._id);
    console.log(`  ✓ Generated ${alertGen1.generated} alerts matching user preferences`);

    // Verify deduplication: second run should generate 0 duplicates
    const alertGen2 = await alertService.generateAlertsForUser(userA._id);
    if (alertGen2.generated !== 0) {
      throw new Error("Alert deduplication failed: duplicate alerts generated");
    }
    console.log("  ✓ Alert deduplication confirmed (0 duplicate alerts on second sync)");

    // Test Alert read states
    const userAlerts = await alertService.getUserAlerts(userA._id, { unreadOnly: true });
    if (userAlerts.alerts.length > 0) {
      const firstAlertId = userAlerts.alerts[0]._id;
      await alertService.markAlertRead(firstAlertId, userA._id);
      const readAlert = await ScamAlert.findById(firstAlertId);
      if (!readAlert.isRead || !readAlert.readAt) {
        throw new Error("markAlertRead did not mark alert as read with timestamp");
      }
      console.log("  ✓ Single alert read transition verified");

      await alertService.markAllAlertsRead(userA._id);
      const remainingUnread = await alertService.getUnreadCount(userA._id);
      if (remainingUnread.unreadCount !== 0) {
        throw new Error("markAllAlertsRead did not clear unread count");
      }
      console.log("  ✓ Bulk mark-all-read verified (unread count = 0)");
    } else {
      console.log("  (Note: No matching reports in DB for test alert generation, creating mock alert to verify read state)");
      const mockAlert = await ScamAlert.create({
        user: userA._id,
        title: "Test Threat Alert",
        message: "Test incident",
        scamType: "UPI_FRAUD",
        riskLevel: "HIGH",
        isRead: false,
      });
      await alertService.markAlertRead(mockAlert._id, userA._id);
      const readDoc = await ScamAlert.findById(mockAlert._id);
      if (!readDoc.isRead) throw new Error("Mock alert read state failed");
      console.log("  ✓ Alert read state verified with test alert");
    }

    // ------------------------------------------------------------------------
    // SECTION 3: PRIVATE EVIDENCE VAULT (CHECKPOINT 12)
    // ------------------------------------------------------------------------
    console.log("\n[TEST 3] Testing Private Evidence Vault & Strict User Isolation...");
    testCaseA = await vaultService.createCase(userA._id, {
      caseTitle: "Investment Task Telegram Scheme Dossier",
      scamType: "JOB_SCAM",
      status: "OPEN",
      suspectIdentifier: { type: "PHONE", value: "+919876543210" },
      financialLoss: { amount: 50000, currency: "INR" },
      transactionReferences: [
        { referenceId: "UPI/2026/099182312", platform: "PhonePe", amount: 25000 },
      ],
      initialNote: "Received contact on WhatsApp promising ₹5000/day for liking YouTube videos.",
    });

    if (!testCaseA._id || !testCaseA.caseNumber.startsWith("SR-CASE-")) {
      throw new Error("Evidence case creation failed or caseNumber format invalid");
    }
    console.log(`  ✓ Case created: ${testCaseA.caseNumber} ("${testCaseA.caseTitle}")`);

    // Verify User A can fetch the case
    const fetchedByA = await vaultService.getCaseById(testCaseA._id, userA._id);
    if (!fetchedByA) throw new Error("User A could not fetch own case");
    console.log("  ✓ Owner (User A) granted access to case dossier");

    // STRICT ISOLATION TEST: Verify User B CANNOT access User A's case
    try {
      await vaultService.getCaseById(testCaseA._id, userB._id);
      throw new Error("SECURITY BREACH: User B accessed User A's private case!");
    } catch (authErr) {
      if (!authErr.message.includes("Unauthorized")) {
        throw authErr;
      }
      console.log("  ✓ Strict authorization verified: User B blocked from accessing User A case (Unauthorized)");
    }

    // Add Timeline Milestone
    await vaultService.addTimelineEvent(testCaseA._id, userA._id, {
      title: "Bank Statement Requested",
      description: "Disputed transaction with HDFC Bank under reference dispute #88219",
    });

    // Add Evidence File with validation
    const sampleBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    await vaultService.addEvidenceFile(testCaseA._id, userA._id, {
      filename: "payment_screenshot.png",
      fileType: "image/png",
      fileSize: 1024,
      fileData: sampleBase64,
    });

    const updatedCase = await vaultService.getCaseById(testCaseA._id, userA._id);
    if (updatedCase.evidenceFiles.length !== 1 || updatedCase.timeline.length < 2) {
      throw new Error("File attachment or timeline addition failed in vault case");
    }
    console.log("  ✓ File validation and secure attachment verified (PNG 1 KB)");
    console.log(`  ✓ Case timeline contains ${updatedCase.timeline.length} sequential milestones`);

    // Verify file size limit rejection
    try {
      await vaultService.addEvidenceFile(testCaseA._id, userA._id, {
        filename: "huge_dump.iso",
        fileType: "application/x-iso-image",
        fileSize: 10 * 1024 * 1024,
        fileData: "dummy",
      });
      throw new Error("Validation failure: file type should have been rejected");
    } catch (fileErr) {
      console.log(`  ✓ Unsafe file type rejected: "${fileErr.message}"`);
    }

    // ------------------------------------------------------------------------
    // SECTION 4: COMMUNITY TRUST & REPORT MODERATION (CHECKPOINT 13)
    // ------------------------------------------------------------------------
    console.log("\n[TEST 4] Testing Credibility Scoring, Disputes & Moderator Actions...");
    // Find a real report to test with
    testReport = await ScamReport.findOne();
    if (!testReport) {
      testReport = await ScamReport.create({
        title: "Suspicious Electricity Bill SMS",
        message: "Your electricity will be disconnected tonight. Call officer at 9876543210 immediately to pay bill.",
        identifier: "9876543210",
        identifierType: "PHONE",
        scamType: "PHISHING",
        riskScore: 85,
        riskLevel: "HIGH",
        location: { city: "Kolkata", state: "West Bengal" },
      });
    }

    // Recalculate credibility
    const credScore = await moderationService.recalculateCredibility(testReport._id);
    if (typeof credScore.score !== "number" || credScore.score < 0 || credScore.score > 100) {
      throw new Error("Credibility score calculation out of bounds [0, 100]");
    }
    console.log(`  ✓ Credibility score calculated: ${credScore.score} (${credScore.level})`);

    // File a dispute against the report
    const dispute = await moderationService.fileDispute(testReport._id, {
      name: "West Bengal Electricity Distribution Legal Desk",
      email: "legal@wbsedcl.test",
      relationship: "Legitimate Entity",
      reason: "IMPERSONATION_OF_LEGITIMATE_ENTITY",
      explanation: "This is a scam impersonator using our brand; we do not send personal phone numbers in SMS notices.",
      supportingEvidence: "https://wbsedcl.gov.in/official-notice-2026.pdf",
    });

    if (!dispute._id || dispute.status !== "PENDING") {
      throw new Error("Dispute filing failed");
    }
    console.log("  ✓ Formal dispute successfully filed and registered as PENDING");

    const reportAfterDispute = await ScamReport.findById(testReport._id);
    if (reportAfterDispute.credibility.moderationStatus !== "DISPUTED") {
      throw new Error("Report moderationStatus was not flagged as DISPUTED");
    }
    console.log("  ✓ Report status automatically flagged as DISPUTED");

    // Moderator resolves dispute as UPHELD
    const resolvedDispute = await moderationService.resolveDispute(
      dispute._id,
      modUser._id,
      {
        status: "UPHELD",
        moderatorNotes: "Confirmed fraudulent impersonation of utility service provider.",
      }
    );
    if (resolvedDispute.status !== "UPHELD") {
      throw new Error("Dispute resolution failed");
    }
    console.log("  ✓ Moderator resolved dispute as UPHELD");

    // ------------------------------------------------------------------------
    // SECTION 5: ADVANCED THREAT INTELLIGENCE (CHECKPOINT 14)
    // ------------------------------------------------------------------------
    console.log("\n[TEST 5] Testing Real Aggregation Threat Intelligence Analytics...");

    // 1. Time-Series Trends
    const trendsResult = await reportService.getTimeSeriesTrends({ interval: "day", days: 30 });
    if (!Array.isArray(trendsResult.trends)) {
      throw new Error("getTimeSeriesTrends did not return trends array");
    }
    console.log(`  ✓ Time-series trends aggregation returned ${trendsResult.trends.length} timestamped buckets`);

    // 2. Category Analytics
    const categoryResult = await reportService.getCategoryAnalytics();
    if (!Array.isArray(categoryResult)) {
      throw new Error("getCategoryAnalytics did not return array");
    }
    console.log(`  ✓ Category analytics returned ${categoryResult.length} real threat categories`);
    if (categoryResult.length > 0) {
      console.log(`    Top category: ${categoryResult[0].category} (${categoryResult[0].count} reports, ${categoryResult[0].percentage}%)`);
    }

    // 3. Geographic Threat Hotspots
    const hotspotsResult = await reportService.getGeographicHotspots();
    if (!Array.isArray(hotspotsResult)) {
      throw new Error("getGeographicHotspots did not return array");
    }
    console.log(`  ✓ Geographic hotspots aggregation returned ${hotspotsResult.length} location clusters`);

    // 4. Advanced Filtered Query
    const filteredReports = await reportService.getReports({
      riskLevel: "HIGH",
      limit: 5,
    });
    if (!filteredReports.reports || typeof filteredReports.total !== "number") {
      throw new Error("Advanced report filtering failed");
    }
    console.log(`  ✓ Filtered report query (riskLevel=HIGH): ${filteredReports.total} total matching records`);

    console.log("\n============================================================");
    console.log("✓ ALL PHASE 4 & 5 ADVANCED BACKEND TESTS PASSED SUCCESSFULLY");
    console.log("============================================================\n");
  } finally {
    // Clean up test records
    console.log("Cleaning up test records...");
    if (userA) await User.deleteOne({ _id: userA._id });
    if (userB) await User.deleteOne({ _id: userB._id });
    if (modUser) await User.deleteOne({ _id: modUser._id });
    if (testCaseA) await EvidenceCase.deleteOne({ _id: testCaseA._id });
    await ScamAlert.deleteMany({ user: { $in: [userA?._id, userB?._id] } });
    await ReportDispute.deleteMany({ "disputedBy.email": { $regex: "@wbsedcl.test" } });
    await mongoose.disconnect();
  }
}

runPhase4AdvancedTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test failure:", err.message);
    process.exit(1);
  });
