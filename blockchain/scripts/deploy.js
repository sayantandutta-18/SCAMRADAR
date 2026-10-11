import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  console.log("Deploying ScamReportRegistry...");

  const scamReportRegistry = await ethers.deployContract(
    "ScamReportRegistry"
  );

  await scamReportRegistry.waitForDeployment();

  const address = await scamReportRegistry.getAddress();

  console.log("ScamReportRegistry deployed successfully!");
  console.log("Contract Address:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});