import hre, { ethers } from "hardhat";

async function verifyContract(
  address: string,
  contract: string,
  constructorArguments: any[] = []
) {
  try {
    await hre.run("verify:verify", {
      address,
      contract,
      constructorArguments,
    });
    console.log(`${contract} verified successfully at ${address}`);
  } catch (error) {
    console.error(`Error verifying ${contract}:`, error);
  }
}

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying Create3Factory with account:",
      await deployer.getAddress()
    );

    // Deploy Create3Factory
    console.log("\nDeploying Create3Factory...");
    const Create3Factory = await ethers.getContractFactory("Create3Factory");
    const create3Factory = await Create3Factory.deploy(deployer.address);
    await create3Factory.waitForDeployment();

    const factoryAddress = await create3Factory.getAddress();
    console.log("Create3Factory deployed at:", factoryAddress);

    // Verify contract if not on localhost
    if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
      console.log("\nVerifying contract...");

      await verifyContract(
        factoryAddress,
        "contracts/Create3Factory.sol:Create3Factory",
        [deployer.address]
      );
    }

    console.log("\nDeployment Summary:");
    console.log("Network:", hre.network.name);
    console.log("Create3Factory:", factoryAddress);
    console.log("Deployer:", await deployer.getAddress());
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
