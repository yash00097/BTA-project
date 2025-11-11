const { ethers } = require("hardhat");

async function main() {
  const POAP = await ethers.getContractFactory("POAP");
  const poap = await POAP.deploy();
  await poap.waitForDeployment();

  console.log("POAP contract deployed at:", await poap.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
