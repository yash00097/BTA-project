// scripts/deployEventManager.cjs
const hre = require("hardhat");

async function main() {
  // <-- Replace POAP_ADDRESS with the address printed from deployPoap.cjs
  const POAP_ADDRESS = "0x6BeE5606001D07Ae5815a908B7559273ddaa07EB";

  // METADATA URI using the CID you uploaded
  const METADATA_URI = "ipfs://bafkreidrjtor7hyh2dim6t5iklux73manje62r54bendxvgac4prl3x6i4";

  const EventManager = await hre.ethers.getContractFactory("contracts/EventManager.sol:EventManager");
  const eventManager = await EventManager.deploy(POAP_ADDRESS, METADATA_URI);
  await eventManager.waitForDeployment();
  console.log("EventManager deployed at:", eventManager.target);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
