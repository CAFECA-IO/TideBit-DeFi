import 'dotenv/config';
import { createPublicClient, createWalletClient, http, parseAbi, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import { createRequire } from 'module';
import { getAddress } from 'viem';

// Info: (20260126 - Luphia) 載入合約 Artifacts (編譯後的 JSON 檔案)
const require = createRequire(import.meta.url);
// Info: (20260126 - Luphia) IdentityRegistry:身分註冊表邏輯合約
const IR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistry.sol/IdentityRegistry.json');
// Info: (20260126 - Luphia) IdentityRegistryStorage: 身分註冊表儲存合約 (負責儲存實際資料)
const IRS_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistryStorage.sol/IdentityRegistryStorage.json');
// Info: (20260126 - Luphia) ClaimTopicsRegistry: Claim 主題註冊表 (定義合規所需的 Claim 類型)
const CTR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/ClaimTopicsRegistry.sol/ClaimTopicsRegistry.json');
// Info: (20260126 - Luphia) TrustedIssuersRegistry: 受信任發行者註冊表 (定義誰有權簽署 Claim)
const TIR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/TrustedIssuersRegistry.sol/TrustedIssuersRegistry.json');
// Info: (20260126 - Luphia) ModularCompliance: 模組化合規合約 (定義代幣移轉的限制規則)
const COMPLIANCE_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/compliance/modular/ModularCompliance.sol/ModularCompliance.json');
// Info: (20260126 - Luphia) Identity: 用戶身分合約 (OnchainID)
const IDENTITY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/@onchain-id/solidity/contracts/Identity.sol/Identity.json');
// Info: (20260126 - Luphia) Token: ERC-3643 代幣標準實作
const TOKEN_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/token/Token.sol/Token.json');

// Info: (20260126 - Luphia) 設定區塊鏈環境
const chainId = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');
const targetChain = defineChain({
  id: chainId,
  name: 'TargetChain',
  nativeCurrency: { name: 'Token', symbol: 'TOK', decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com'] } },
});

// Info: (20260126 - Luphia) 目標用戶地址 (接收代幣者)
const USER_ADDRESS = getAddress('0x3C31897F531ce62Cc9D4928e35D6F8B7ee9BDD28');

async function main() {
  console.log('--- 開始執行完整 TWD 系統部署與鑄造 (簡化合規版本) ---');

  // Info: (20260126 - Luphia) 設定部署者帳戶 (從 .env 讀取私鑰)
  const account = privateKeyToAccount(process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`);
  const wallet = createWalletClient({ account, chain: targetChain, transport: http() });
  const client = createPublicClient({ chain: targetChain, transport: http() });

  console.log(`部署者地址: ${account.address}`);

  /**
   * Info: (20260126 - Luphia)
   * 步驟 0: 部署基礎註冊表 (Registries)
   * 為了確保合規檢查能通過，我們部署全新的註冊表且"不設定"任何強制 Claim 需求。
   */

  /**
   * Info: (20260126 - Luphia)
   * 0a. 部署 ClaimTopicsRegistry (Claim 主題註冊表)
   * 這裡我們不添加任何主題，表示不強制檢查特定 Claim。
   */
  console.log('正在部署 ClaimTopicsRegistry...');
  const ctrHash = await wallet.deployContract({
    abi: CTR_ARTIFACT.abi,
    bytecode: CTR_ARTIFACT.bytecode,
  });
  const ctrReceipt = await client.waitForTransactionReceipt({ hash: ctrHash });
  const CTR_ADDRESS = ctrReceipt.contractAddress!;
  console.log(`ClaimTopicsRegistry 已部署於: ${CTR_ADDRESS}`);
  // Info: (20260126 - Luphia) 初始化合約
  await wallet.writeContract({ address: CTR_ADDRESS, abi: CTR_ARTIFACT.abi, functionName: 'init', args: [] });

  // Info: (20260126 - Luphia) 0b. 部署 TrustedIssuersRegistry (受信任發行者註冊表)
  console.log('正在部署 TrustedIssuersRegistry...');
  const tirHash = await wallet.deployContract({
    abi: TIR_ARTIFACT.abi,
    bytecode: TIR_ARTIFACT.bytecode,
  });
  const tirReceipt = await client.waitForTransactionReceipt({ hash: tirHash });
  const TIR_ADDRESS = tirReceipt.contractAddress!;
  console.log(`TrustedIssuersRegistry 已部署於: ${TIR_ADDRESS}`);
  await wallet.writeContract({ address: TIR_ADDRESS, abi: TIR_ARTIFACT.abi, functionName: 'init', args: [] });

  /**
   * Info: (20260126 - Luphia)
   * 0c. 部署 IdentityRegistryStorage (身分資料儲存合約)
   * 這是實際儲存 "錢包地址 -> Identity 合約地址" 對應關係的地方。
   */
  console.log('正在部署 IdentityRegistryStorage...');
  const irsHash = await wallet.deployContract({
    abi: IRS_ARTIFACT.abi,
    bytecode: IRS_ARTIFACT.bytecode,
  });
  const irsReceipt = await client.waitForTransactionReceipt({ hash: irsHash });
  const identityRegistryStorageAddress = irsReceipt.contractAddress!;
  console.log(`IdentityRegistryStorage 已部署於: ${identityRegistryStorageAddress}`);

  await wallet.writeContract({
    address: identityRegistryStorageAddress,
    abi: IRS_ARTIFACT.abi,
    functionName: 'init',
    args: []
  });
  const IRS_ADDRESS = identityRegistryStorageAddress;

  /**
   * Info: (20260126 - Luphia)
   * 步驟 1: 部署 Identity Registry (身分註冊表邏輯)
   */
  console.log('正在部署 IdentityRegistry (邏輯層)...');
  const irHash = await wallet.deployContract({
    abi: IR_ARTIFACT.abi,
    bytecode: IR_ARTIFACT.bytecode,
  });
  const irReceipt = await client.waitForTransactionReceipt({ hash: irHash });
  const identityRegistryAddress = irReceipt.contractAddress!;
  console.log(`IdentityRegistry 已部署於: ${identityRegistryAddress}`);

  // Info: (20260126 - Luphia) 初始化 Identity Registry，綁定前面部署的三個基礎註冊表
  console.log('正在初始化 IdentityRegistry...');
  await wallet.writeContract({
    address: identityRegistryAddress,
    abi: IR_ARTIFACT.abi,
    functionName: 'init',
    args: [TIR_ADDRESS, CTR_ADDRESS, IRS_ADDRESS]
  });

  /**
   * Info: (20260126 - Luphia)
   * 步驟 2: 部署 Modular Compliance (模組化合規)
   */
  console.log('正在部署 ModularCompliance...');
  const compHash = await wallet.deployContract({
    abi: COMPLIANCE_ARTIFACT.abi,
    bytecode: COMPLIANCE_ARTIFACT.bytecode,
  });
  const compReceipt = await client.waitForTransactionReceipt({ hash: compHash });
  const complianceAddress = compReceipt.contractAddress!;
  console.log(`ModularCompliance 已部署於: ${complianceAddress}`);

  await wallet.writeContract({
    address: complianceAddress,
    abi: COMPLIANCE_ARTIFACT.abi,
    functionName: 'init',
    args: []
  });

  /**
   * Info: (20260126 - Luphia)
   * 步驟 3: 部署 TWD 代幣合約 (直接部署實作層，不使用 Proxy)
   */
  console.log('正在部署 TWD Token (直接實作模式)...');

  /**
   * Info: (20260126 - Luphia)
   * 3a. 先為"代幣本身"部署一個 Identity (Issuer Identity)
   * 這是 ERC-3643 規範要求的，代幣合約需要有一個擁有者身分。
   */
  console.log('正在部署發行者身分 (Issuer Identity)...');
  const ioiHash = await wallet.deployContract({
    abi: IDENTITY_ARTIFACT.abi,
    bytecode: IDENTITY_ARTIFACT.bytecode,
    args: [account.address, false] // Info: (20260126 - Luphia) 由部署者擁有
  });
  const ioiReceipt = await client.waitForTransactionReceipt({ hash: ioiHash });
  const issuerIdentityAddress = ioiReceipt.contractAddress!;
  console.log(`發行者身分 (Issuer Identity) 地址: ${issuerIdentityAddress}`);

  const COMPLIANCE_ABI = parseAbi(['function bindToken(address) external']);

  // Info: (20260126 - Luphia) 定義 Token 所需的 ABI
  const TOKEN_ABI = parseAbi([
    'function init(address _identityRegistry, address _compliance, string memory _name, string memory _symbol, uint8 _decimals, address _onchainID) external',
    'function addAgent(address) external',
    'function batchMint(address[] _toList, uint256[] _amounts) external'
  ]);

  // Info: (20260126 - Luphia) 3b. 部署 TWD 代幣
  const tokenHash = await wallet.deployContract({
    abi: TOKEN_ARTIFACT.abi,
    bytecode: TOKEN_ARTIFACT.bytecode,
    args: []
  });
  const tokenReceipt = await client.waitForTransactionReceipt({ hash: tokenHash });
  const tokenAddress = tokenReceipt.contractAddress!;
  console.log(`TWD Token (Direct) 已部署於: ${tokenAddress}`);

  /**
   * Info: (20260126 - Luphia)
   * 3c. 初始化 TWD 代幣
   * 將代幣與 Registry、Compliance 和 Issuer Identity 連結
   */
  console.log('正在初始化 TWD Token...');
  await wallet.writeContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'init',
    args: [identityRegistryAddress, complianceAddress, 'Taiwan Dollar', 'TWD', 18, issuerIdentityAddress]
  });

  /**
   * Info: (20260126 - Luphia)
   * 步驟 4: 設定系統連結 (Linkages)
   * 確保各組件互相知道對方的地址並授權
   */

  // Info: (20260126 - Luphia) 4a. 綁定 Storage -> Registry
  console.log('正在綁定 Storage 到 Registry...');
  const IRS_ABI = parseAbi(['function bindIdentityRegistry(address) external']);
  await wallet.writeContract({
    address: IRS_ADDRESS,
    abi: IRS_ABI,
    functionName: 'bindIdentityRegistry',
    args: [identityRegistryAddress]
  });

  /**
   * Info: (20260126 - Luphia)
   * 4b. 綁定 Token -> Compliance
   * 這樣 Compliance 才能攔截並檢查 Token 的交易
   */
  console.log('正在綁定 Token 到 Compliance...');
  await wallet.writeContract({
    address: complianceAddress,
    abi: COMPLIANCE_ABI,
    functionName: 'bindToken',
    args: [tokenAddress]
  });

  /**
   * Info: (20260126 - Luphia)
   * 4c. 將部署者設為 Token 的 Agent
   * Agent 角色擁有鑄造 (issue/mint) 的權限
   */
  console.log('正在將部署者設為 Token Agent...');
  await wallet.writeContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'addAgent',
    args: [account.address]
  });

  /**
   * Info: (20260126 - Luphia)
   * 步驟 5: 部署用戶身分 (User Identity) 並註冊
   * ERC-3643 要求：接收代幣的地址必須在 Registry 中有對應的 Identity
   */
  console.log('正在部署用戶身分 (User Identity)...');
  const uoiHash = await wallet.deployContract({
    abi: IDENTITY_ARTIFACT.abi,
    bytecode: IDENTITY_ARTIFACT.bytecode,
    args: [USER_ADDRESS, false] // Info: (20260126 - Luphia) 直接由用戶擁有
  });
  const uoiReceipt = await client.waitForTransactionReceipt({ hash: uoiHash });
  const userIdentityAddress = uoiReceipt.contractAddress!;
  console.log(`用戶身分 (User Identity) 地址: ${userIdentityAddress}`);

  /**
   * Info: (20260126 - Luphia)
   * 5b. 將部署者設為 Registry 的 Agent
   * 這樣部署者才有權限呼叫 registerIdentity
   */
  const REG_ABI = parseAbi(['function registerIdentity(address, address, uint16) external', 'function addAgent(address) external']);

  console.log('正在將部署者設為 Registry Agent...');
  await wallet.writeContract({
    address: identityRegistryAddress,
    abi: REG_ABI,
    functionName: 'addAgent',
    args: [account.address]
  });

  /**
   * Info: (20260126 - Luphia)
   * 5c. 在 Registry 中註冊用戶
   * 將 用戶錢包地址 <-> 用戶 Identity 合約地址 綁定
   * 158 是台灣的 ISO 國家代碼 (Numeric)
   */
  console.log('正在註冊用戶身分到 Registry...');
  await wallet.writeContract({
    address: identityRegistryAddress,
    abi: REG_ABI,
    functionName: 'registerIdentity',
    args: [USER_ADDRESS, userIdentityAddress, 158]
  });

  /**
   * Info: (20260126 - Luphia)
   * 步驟 6: 鑄造代幣 (Mint)
   * 由於我們使用空的 ClaimTopicsRegistry，不需要額外的 Claim 驗證
   */
  console.log('正在鑄造 TWD 代幣...');
  const amount = BigInt(1000) * BigInt(10) ** BigInt(18); // Info: (20260126 - Luphia) 1000 TWD
  try {
    // Info: (20260126 - Luphia) 使用 batchMint 可以避免部分舊版 issue 函數簽章的問題
    const tx = await wallet.writeContract({
      address: tokenAddress,
      abi: TOKEN_ABI,
      functionName: 'batchMint',
      args: [[USER_ADDRESS], [amount]]
    });
    console.log(`✅ 鑄造成功! 交易雜湊 (TX): ${tx}`);

    // Info: (20260126 - Luphia) 驗證餘額
    const balance = await client.readContract({
      address: tokenAddress,
      abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
      functionName: 'balanceOf',
      args: [USER_ADDRESS]
    });
    console.log(`用戶 TWD 當前餘額: ${formatEther(balance)}`);
  } catch (e) {
    console.error('鑄造失敗:', e);
  }
}

main();
