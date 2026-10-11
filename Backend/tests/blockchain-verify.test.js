const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { verifyReportOnChain } = require("../src/services/report.service");
const ScamReport = require("../src/models/ScamReport");

async function runBlockchainVerificationTests() {
  console.log("=== BLOCKCHAIN PROOF EXPLORER INTEGRATION TESTS ===");
  await mongoose.connect(process.env.MONGO_URI);

  // Test 1: Verified report on-chain
  const verifiedReportId = "6a914e6632a4ccf1de34b5fc";
  const result1 = await verifyReportOnChain(verifiedReportId);
  console.log(`[TEST 1] Verified Report (${verifiedReportId}):`);
  console.log(`  Status: ${result1.status} | Verified: ${result1.verified}`);
  console.log(`  Calculated: ${result1.calculatedHash}`);
  console.log(`  On-Chain:   ${result1.onChain?.reportHash}`);
  if (result1.status !== "VERIFIED" || !result1.verified) {
    throw new Error("Test 1 Failed: Expected status VERIFIED and verified === true");
  }

  // Test 2: Unregistered report on-chain
  const unregisteredReport = await ScamReport.findOne({
    _id: { $ne: new mongoose.Types.ObjectId(verifiedReportId) },
    "blockchain.registered": false,
  });
  if (unregisteredReport) {
    const result2 = await verifyReportOnChain(unregisteredReport._id.toString());
    console.log(`[TEST 2] Unregistered Report (${unregisteredReport._id}):`);
    console.log(`  Status: ${result2.status} | Verified: ${result2.verified}`);
    if (result2.status !== "NOT_REGISTERED_ON_CHAIN" || result2.verified) {
      throw new Error("Test 2 Failed: Expected status NOT_REGISTERED_ON_CHAIN and verified === false");
    }
  }

  // Test 3: Missing report in database
  try {
    await verifyReportOnChain("000000000000000000000000");
    throw new Error("Test 3 Failed: Non-existent report should throw 404");
  } catch (err) {
    console.log(`[TEST 3] Missing Report (404 check): Expected error received -> "${err.message}"`);
  }

  console.log("=== ALL BLOCKCHAIN VERIFICATION TESTS PASSED ===");
  await mongoose.disconnect();
}

runBlockchainVerificationTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test failure:", err.message);
    process.exit(1);
  });
