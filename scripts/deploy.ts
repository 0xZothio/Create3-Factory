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

    // Get nonce
    const nonce = await ethers.provider.getTransactionCount(deployer.address);
    console.log("Current nonce:", nonce);

    // Deploy Create3Factory
    console.log("\nDeploying Create3Factory...");
    const Create3Factory = await ethers.getContractFactory("Create3Factory");

    // Prepare deployment data
    const deployTx = {
      from: deployer.address,
      nonce: nonce,
      gasPrice: ethers.parseUnits("30", "gwei"),
      gasLimit: ethers.parseUnits("3", "million"),
      data: Create3Factory.bytecode +
        Create3Factory.interface.encodeDeploy([deployer.address]).slice(2),
      type: 0, // Legacy transaction
      chainId: 1088 // Metis chainId
    };

    // Send transaction
    console.log("Sending deployment transaction...");
    console.log("Transaction details:", {
      gasPrice: deployTx.gasPrice.toString(),
      gasLimit: deployTx.gasLimit.toString(),
      nonce: deployTx.nonce
    });

    const transaction = await deployer.sendTransaction(deployTx);
    console.log("Transaction hash:", transaction.hash);

    console.log("Waiting for transaction confirmation...");
    const receipt = await transaction.wait();

    if (!receipt?.contractAddress) {
      throw new Error("Deployment failed - no contract address received");
    }

    const contractAddress = receipt.contractAddress;
    console.log("Create3Factory deployed to:", contractAddress);

    // Verify contract
    if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
      console.log("\nWaiting before verification...");
      await new Promise(resolve => setTimeout(resolve, 30000));

      await verifyContract(
        contractAddress,
        "contracts/Create3Factory.sol:Create3Factory",
        [deployer.address]
      );
    }

    console.log("\nDeployment Summary:");
    console.log("Network:", hre.network.name);
    console.log("Create3Factory:", contractAddress);
    console.log("Deployer:", await deployer.getAddress());

  } catch (error) {
    console.error("\nDeployment failed with error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });