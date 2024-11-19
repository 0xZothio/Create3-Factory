# Create3Factory with Access Control

A Solidity-based implementation of a `Create3Factory` contract that leverages the `CREATE3` opcode for deterministic address generation with integrated access control. Built using the Hardhat framework, this project facilitates secure and predictable contract deployments.

---

## Features

- **Deterministic Address Generation**: Deploy contracts to predictable addresses regardless of the deployer’s address.
- **Access Control**: Restricts deployment functionality to authorized entities.
- **Hardhat Integration**: Uses Hardhat for testing, compiling, and deployment.

---

## Table of Contents

1. [Installation](#installation)
2. [Contracts Overview](#contracts-overview)
3. [Usage](#usage)
4. [Deployment](#deployment)
5. [License](#license)
6. [Acknowledgments](#acknowledgments)

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher)
- [pnpm](https://pnpm.io/)
- [Hardhat](https://hardhat.org/)

### Setup

Clone the repository and install the required dependencies:

```bash
git clone https://github.com/0xZothio/Create3-Factory.git
cd Create3-Factory
pnpm install
```

---

## Contracts Overview

### `Create3Factory.sol`

The `Create3Factory` contract offers:

1. **Deploy with Deterministic Address**:
   ```solidity
   function create(bytes32 _salt, bytes calldata _creationCode) external onlyRole(DEPLOYER_ROLE)
   ```
   Deploys a contract to a predictable address calculated from the provided `salt`.

2. **Get Deployed Address**:
   ```solidity
   function addressOf(bytes32 _salt) external view returns (address);
   ```
   Computes the deterministic address for a given `salt`.

3. **Access Control**:
   Access is restricted to authorized deployers via `onlyAuthorized` modifier.

---

## Usage

### Compile Contracts

Run the following command to compile the Solidity contracts:

```bash
npx hardhat compile
```

### Deploy Contracts Locally

To deploy the `Create3Factory` contract on a local Hardhat network:

```bash
npx hardhat ignition deploy ignition/modules/deploy.ts --network localhost
```

### Example Script for Deploying Contracts Using the Factory

Below is a sample script to deploy a contract via the `Create3Factory`:

```javascript
const { ethers } = require("hardhat");

async function main() {
  const Create3Factory = await ethers.getContractFactory("Create3Factory");
  const factory = await Create3Factory.deploy();
  await factory.deployed();

  console.log("Create3Factory deployed to:", factory.address);

  const salt = ethers.utils.formatBytes32String("mySalt");
  const bytecode = "0x6080604052348015600f57600080fd5b5060..."; // Replace with actual bytecode

  const tx = await factory.create(salt, bytecode);
  await tx.wait();

  const deployedAddress = await factory.addressOf(salt);
  console.log("Deployed contract at deterministic address:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```


## Deployment

### Configure Networks

Update the `hardhat.config.ts` file with your desired network details:

```javascript
module.exports = {
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID",
      accounts: ["YOUR_PRIVATE_KEY"],
    },
  },
};
```
> Replace placeholders (`YOUR_INFURA_PROJECT_ID`, `YOUR_PRIVATE_KEY`) with actual values.

### Deploy on a Live Network

Deploy the `Create3Factory` to a testnet or mainnet:

```bash
npx hardhat ignition deploy ignition/modules/deploy.ts --network rinkeby
```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgments

- Utilizes the `CREATE3` opcode for deterministic and secure deployments.
- Built with [Hardhat](https://hardhat.org/).
- Inspired by modern Solidity development practices and OpenZeppelin libraries.

Feel free to fork, contribute, or suggest improvements!
