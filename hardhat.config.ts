import 'dotenv/config';
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import { configVariable, defineConfig } from 'hardhat/config';

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    compilers: [
      {
        version: '0.8.28',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: 'paris',
        },
      },
      {
        version: '0.8.20', // Info: (20260106 - Tzuahan) 許多 OpenZeppelin 合約使用
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: 'paris',
        },
      },
      {
        version: '0.8.19', // Info: (20260106 - Tzuahan) 中間過渡版本
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
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
      url: 'https://mainnet.isuncoin.com',
      accounts: [configVariable('ISUNCOIN_PRIVATE_KEY')],
    },
    localhost: {
      type: 'http',
      url: 'http://127.0.0.1:8545',
    },
  },
});
