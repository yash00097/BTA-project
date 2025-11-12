// scripts/deployEventManager.cjs
const hre = require("hardhat");

async function main() {
  const POAP_ADDRESS = "0xbD347fe7Bb315fCcfC90D3f16ADDa3613346Cbb9"; // ✅ your deployed POAP address

  const EventManager = await hre.ethers.getContractFactory("EventManager");
  const eventManager = await EventManager.deploy(POAP_ADDRESS);

  // 🟢 FIXED: ethers v6 uses waitForDeployment() instead of deployed()
  await eventManager.waitForDeployment();

  console.log(`✅ EventManager deployed successfully at: ${eventManager.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
