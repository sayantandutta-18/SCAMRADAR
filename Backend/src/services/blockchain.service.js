const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// =====================================================
// BLOCKCHAIN CONFIGURATION
// =====================================================

const RPC_URL =
  process.env.BLOCKCHAIN_RPC_URL ||
  "http://127.0.0.1:8545";

const CONTRACT_ADDRESS =
  process.env.BLOCKCHAIN_CONTRACT_ADDRESS;

const PRIVATE_KEY =
  process.env.BLOCKCHAIN_PRIVATE_KEY;


// =====================================================
// SMART CONTRACT GETTER
// =====================================================

let contractInstance = null;

const getContract = () => {
  if (contractInstance) return contractInstance;

  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
  const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;

  if (!contractAddress || !privateKey) {
    throw new Error("BLOCKCHAIN_CONTRACT_ADDRESS or BLOCKCHAIN_PRIVATE_KEY is missing from .env");
  }

  const artifactPath = path.resolve(
    __dirname,
    "../../../blockchain/artifacts/contracts/ScamReportRegistry.sol/ScamReportRegistry.json"
  );

  if (!fs.existsSync(artifactPath)) {
    throw new Error("ScamReportRegistry artifact not found. Run 'npx hardhat compile' in blockchain directory.");
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  contractInstance = new ethers.Contract(contractAddress, artifact.abi, wallet);
  return contractInstance;
};


// =====================================================
// REGISTER REPORT
// =====================================================

const registerReport = async (
  reportId,
  reportHash
) => {

  if (!reportId) {
    throw new Error(
      "Report ID is required"
    );
  }

  if (!reportHash) {
    throw new Error(
      "Report hash is required"
    );
  }

  console.log(
    `Registering report ${reportId} on blockchain...`
  );

  const contract = getContract();
  const tx = await contract.registerReport(
    reportId,
    reportHash
  );

  console.log(
    "Blockchain transaction sent:",
    tx.hash
  );

  const receipt = await tx.wait();

  console.log(
    "Blockchain transaction confirmed:",
    receipt.hash
  );

  return {
    success: true,
    reportId,
    transactionHash: tx.hash,
  };
};


// =====================================================
// VERIFY REPORT
// =====================================================

const verifyReport = async (
  reportId,
  reportHash
) => {

  if (!reportId) {
    throw new Error(
      "Report ID is required"
    );
  }

  if (!reportHash) {
    throw new Error(
      "Report hash is required"
    );
  }

  const contract = getContract();
  const result =
    await contract.verifyReport(
      reportId,
      reportHash
    );

  return result;
};


// =====================================================
// GET BLOCKCHAIN REPORT
// =====================================================

const getBlockchainReport = async (
  reportId
) => {

  if (!reportId) {
    throw new Error(
      "Report ID is required"
    );
  }

  const contract = getContract();
  const result =
    await contract.getReport(
      reportId
    );

  return {
    reportHash: result[0],
    timestamp: result[1].toString(),
    submittedBy: result[2],
    exists: result[3],
  };
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerReport,
  verifyReport,
  getBlockchainReport,
};