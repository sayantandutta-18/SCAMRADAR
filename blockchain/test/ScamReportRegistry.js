import { expect } from "chai";
import { network } from "hardhat";

describe("ScamReportRegistry", function () {
  async function deployContract() {
    const { ethers } = await network.connect();

    const [owner, otherAccount] = await ethers.getSigners();

    const scamReportRegistry = await ethers.deployContract(
      "ScamReportRegistry"
    );

    await scamReportRegistry.waitForDeployment();

    return {
      ethers,
      scamReportRegistry,
      owner,
      otherAccount,
    };
  }

  it("should register a scam report", async function () {
    const { ethers, scamReportRegistry, owner } =
      await deployContract();

    const reportId = "report-001";

    const reportHash = ethers.keccak256(
      ethers.toUtf8Bytes("9876543210")
    );

    await scamReportRegistry.registerReport(
      reportId,
      reportHash
    );

    const report = await scamReportRegistry.getReport(reportId);

    expect(report.reportHash).to.equal(reportHash);
    expect(report.submittedBy).to.equal(owner.address);
    expect(report.exists).to.equal(true);
  });

  it("should verify a registered report", async function () {
    const { ethers, scamReportRegistry } =
      await deployContract();

    const reportId = "report-002";

    const reportHash = ethers.keccak256(
      ethers.toUtf8Bytes("test-scam-data")
    );

    await scamReportRegistry.registerReport(
      reportId,
      reportHash
    );

    const result = await scamReportRegistry.verifyReport(
      reportId,
      reportHash
    );

    expect(result).to.equal(true);
  });

  it("should reject an incorrect hash", async function () {
    const { ethers, scamReportRegistry } =
      await deployContract();

    const reportId = "report-003";

    const originalHash = ethers.keccak256(
      ethers.toUtf8Bytes("original-data")
    );

    const wrongHash = ethers.keccak256(
      ethers.toUtf8Bytes("wrong-data")
    );

    await scamReportRegistry.registerReport(
      reportId,
      originalHash
    );

    const result = await scamReportRegistry.verifyReport(
      reportId,
      wrongHash
    );

    expect(result).to.equal(false);
  });

  it("should reject duplicate reports", async function () {
    const { ethers, scamReportRegistry } =
      await deployContract();

    const reportId = "report-004";

    const reportHash = ethers.keccak256(
      ethers.toUtf8Bytes("duplicate-test")
    );

    await scamReportRegistry.registerReport(
      reportId,
      reportHash
    );

    await expect(
      scamReportRegistry.registerReport(
        reportId,
        reportHash
      )
    ).to.be.revertedWith("Report already registered");
  });

  it("should allow only the owner to register reports", async function () {
    const { ethers, scamReportRegistry, otherAccount } =
      await deployContract();

    const reportId = "report-005";

    const reportHash = ethers.keccak256(
      ethers.toUtf8Bytes("unauthorized-test")
    );

    await expect(
      scamReportRegistry
        .connect(otherAccount)
        .registerReport(reportId, reportHash)
    ).to.be.revertedWithCustomError(
      scamReportRegistry,
      "OwnableUnauthorizedAccount"
    );
  });

  it("should return false for an unknown report", async function () {
    const { ethers, scamReportRegistry } =
      await deployContract();

    const reportHash = ethers.keccak256(
      ethers.toUtf8Bytes("unknown-data")
    );

    const result = await scamReportRegistry.verifyReport(
      "does-not-exist",
      reportHash
    );

    expect(result).to.equal(false);
  });
});