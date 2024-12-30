import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-ledger";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const DEPLOYER_ACCOUNT_PRIV_KEY = process.env.DEPLOYER_ACCOUNT_PRIV_KEY;
const LEDGER_ADDRESS = process.env.LEDGER_ADDRESS as string;
const ACCOUNTS = [DEPLOYER_ACCOUNT_PRIV_KEY].filter(Boolean) as string[];

const config: HardhatUserConfig = {
  networks: {
    ethereum: {
      chainId: 1,
      url:
        "https://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
      // accounts: ACCOUNTS
      ledgerAccounts: [LEDGER_ADDRESS],
    },
    manta: {
      chainId: 169,
      url: "https://pacific-rpc.manta.network/http",
      ledgerAccounts: [LEDGER_ADDRESS],
    },
    metis: {
      chainId: 1088,
      url:
        "https://metis-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
      ledgerAccounts: [LEDGER_ADDRESS],
      gas: 3000000,
      gasPrice: 30000000000,
      allowUnlimitedContractSize: true,
      blockGasLimit: 8000000,
      timeout: 100000,
      initialBaseFeePerGas: 1000000000,
    },
    amoy: {
      chainId: 80002,
      url: "https://rpc-amoy.polygon.technology",
      // accounts: ACCOUNTS
      ledgerAccounts: [LEDGER_ADDRESS],
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      // accounts: ACCOUNTS
      ledgerAccounts: [LEDGER_ADDRESS],
    },
    bartio: {
      chainId: 80084,
      url: "https://bartio.rpc.berachain.com/",
      // accounts: ACCOUNTS
      ledgerAccounts: [LEDGER_ADDRESS],
    },
    holesky: {
      chainId: 17000,
      url: "https://eth-holesky.g.alchemy.com/v2",
      // accounts: ACCOUNTS
      ledgerAccounts: [LEDGER_ADDRESS],
    },
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGON_API_KEY as string,
      amoy: process.env.POLYGON_API_KEY as string,
      mainnet: process.env.ETHEREUM_API_KEY as string,
      avalanche: "not needed",
      fuji: "not needed",
      bartio: "not needed",
      holesky: process.env.HOLESKY_API_KEY as string,
      manta: "not needed",
      metis: "not needed",
    },
    customChains: [
      {
        network: "manta",
        chainId: 169,
        urls: {
          apiURL: "https://pacific-explorer.manta.network/api",
          browserURL: "https://pacific-explorer.manta.network/",
        },
      },
      {
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
      {
        network: "holesky",
        chainId: 17000,
        urls: {
          apiURL: "https://api-holesky.etherscan.io/api",
          browserURL: "https://holesky.etherscan.io",
        },
      },
      {
        network: "bartio",
        chainId: 80084,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/testnet/evm/80084/etherscan",
          browserURL: "https://bartio.beratrail.io",
        },
      },
      {
        network: "metis",
        chainId: 1088,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/mainnet/evm/1088/etherscan",
          browserURL: "https://explorer.metis.io/",
        },
      },
    ],
  },
  solidity: "0.8.27",
};

export default config;
