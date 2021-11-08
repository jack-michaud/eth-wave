// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const [owner] = await ethers.getSigners();
  const accountBalance = await owner.getBalance();
  console.log(`Owner account ${owner.address} has ${accountBalance.toString()}`);

  const wavePortalFactory = await ethers.getContractFactory("WavePortal");
  const wavePortal = await wavePortalFactory.deploy();
  await wavePortal.deployed();

  console.log(`WavePortal address: ${wavePortal.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
