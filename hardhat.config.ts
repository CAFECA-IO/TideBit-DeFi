import 'dotenv/config';
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import { HardhatUserConfig } from 'hardhat/config';

const PRIVATE_KEY = process.env.ISUNCOIN_PRIVATE_KEY;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    compilers: [
      {
        version: '0.8.28',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
          viaIR: true,
          evmVersion: 'paris',
        },
      },
      {
        version: '0.8.17', // Info: (20260106 - Tzuahan) 針對 @erc3643org/erc-3643 (T-REX)
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: 'london',
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  networks: {
    isuncoin_mainnet: {
      type: 'http',
      chainType: 'l1',
      url: RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: CHAIN_ID,
    },
    localhost: {
      type: 'http',
      url: 'http://127.0.0.1:8545',
    },
  },
};

export default config;
