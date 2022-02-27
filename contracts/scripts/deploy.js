
async function main(){
    const hre = require("hardhat");
    // We get the contract to deploy
    const IronDice = await hre.ethers.getContractFactory("IronDice");
    const irondice = await hre.ethers.IronDice.deploy();
    await irondice.deployed();
    console.log("IronDice deployed to:", irondice.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

