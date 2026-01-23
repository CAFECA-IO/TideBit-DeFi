import 'dotenv/config';
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import { HardhatUserConfig } from 'hardhat/config';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    // Info: (20260113 - Tzuhan) 解決方案：在 profiles 內部定義 compilers
    // Info: (20260113 - Tzuhan) 這樣可以避免 Hardhat 自動產生錯誤的 production profile
    profiles: {
      default: {
        // Info: (20260113 - Tzuhan) 定義多個編譯器，讓 Hardhat 自動為檔案選擇合適的版本
        compilers: [
          {
            version: '0.8.28', // Info: (20260113 - Tzuhan) 用於 EntryPoint 和新合約
            settings: {
              optimizer: {
                enabled: true,
                runs: 200,
              },
              evmVersion: 'paris',
            },
          },
          {
            version: '0.8.17', // Info: (20260113 - Tzuhan) 專門用於 T-REX (ERC-3643) 相關依賴
            settings: {
              optimizer: {
                enabled: true,
                runs: 200,
              },
              evmVersion: 'london', // Info: (20260113 - Tzuhan) T-REX 當時的標準 EVM
            },
          },
        ],
        // Info: (20260113 - Tzuhan) 強制 EntryPoint 使用 0.8.28 (雙重保險)
        overrides: {
          'contracts/entry_point.sol': {
            version: '0.8.28',
            settings: {
              optimizer: { enabled: true, runs: 200 },
              evmVersion: 'paris',
            },
          },
          // Info: (20260113 - Tzuhan) 如果 Factory 也有引用 EntryPoint，也鎖定它
          'contracts/scw_factory.sol': {
            version: '0.8.28',
            settings: {
              optimizer: { enabled: true, runs: 200 },
              evmVersion: 'paris',
            },
          },
        },
      },
      // Info: (20260113 - Tzuhan) 顯式定義 production profile，內容與 default 一致
      // Info: (20260113 - Tzuhan) 這能防止 Ignition 在部署時因切換到不存在或錯誤的 production profile 而失敗
      production: {
        compilers: [
          {
            version: '0.8.28',
            settings: {
              optimizer: { enabled: true, runs: 200 },
              evmVersion: 'paris',
            },
          },
          {
            version: '0.8.17',
            settings: {
              optimizer: { enabled: true, runs: 200 },
              evmVersion: 'london',
            },
          },
        ],
        overrides: {
          'contracts/entry_point.sol': {
            version: '0.8.28',
            settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: 'paris' },
          },
          'contracts/scw_factory.sol': {
            version: '0.8.28',
            settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: 'paris' },
          },
        },
      },
    },
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
      accounts: process.env.ISUNCOIN_PRIVATE_KEY ? [process.env.ISUNCOIN_PRIVATE_KEY] : [],
      chainId: CHAIN_ID,
    },
    localhost: {
      type: 'http',
      url: 'http://127.0.0.1:8545',
    },
  },
};

export default config;
