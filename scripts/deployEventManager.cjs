const hre = require("hardhat");

async function main() {
  const POAP_ADDRESS = "0x752D845dAa0Aa41C991188e18c6fb3d80e4d0260"; // your POAP address

  const EventManager = await hre.ethers.getContractFactory("EventManager");
  const eventManager = await EventManager.deploy(POAP_ADDRESS);
  await eventManager.waitForDeployment();

  console.log(`✅ EventManager deployed at: ${eventManager.target}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
