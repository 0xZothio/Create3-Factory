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
      constructorArguments
    });
    console.log(`${contract} verified successfully at ${address}`);
  } catch (error) {
    console.error(`Error verifying ${contract}:`, error);
  }
}

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Create3Factory with account:", await deployer.getAddress());

    // Deploy Create3Factory
    console.log("\nDeploying Create3Factory...");
    const Create3Factory = await ethers.getContractFactory("Create3Factory");

    // Prepare deployment transaction with specific gas parameters
    const deployTx = await Create3Factory.getDeployTransaction(deployer.address);

    // Set explicit gas parameters for networks that need it
    if (hre.network.name === "metis") {
      deployTx.gasLimit = ethers.getBigInt("3000000");
      deployTx.gasPrice = ethers.getBigInt("30000000000");
    }

    // Deploy with modified transaction
    const deploymentTx = await deployer.sendTransaction(deployTx);
    console.log("Deployment transaction sent:", deploymentTx.hash);

    const receipt = await deploymentTx.wait();
    if (!receipt?.contractAddress) {
      throw new Error("Contract deployment failed - no contract address");
    }

    const factoryAddress = receipt.contractAddress;
    console.log("Create3Factory deployed at:", factoryAddress);

    // Connect to deployed contract
    const create3Factory = Create3Factory.attach(factoryAddress);

    // Verify contract if not on localhost
    if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
      console.log("\nVerifying contract...");

      // Wait a bit before verification to ensure the contract is deployed
      await new Promise(resolve => setTimeout(resolve, 30000));

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