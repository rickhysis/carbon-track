import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-verify";

import { mnemonic, privateKey } from './secret.json'

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  // ignition: {
  //   requiredConfirmations: 1
  // },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    liskSepolia: {
      url: 'https://rpc.sepolia-api.lisk.com/',
      chainId: 4202,
      accounts: [privateKey]
    },
    lisk: {
      url: "https://rpc.api.lisk.com/",
      chainId: 1135,
      gasPrice: 20000000000,
      accounts: { mnemonic: mnemonic }
    },
  },
  etherscan: {
    apiKey: {
      // Is not required by blockscout. Can be any non-empty string
      liskSepolia: "abc"
    },
    customChains: [
      {
        network: "liskSepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com",
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  }
};

export default config;
