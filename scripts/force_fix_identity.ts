import { getContract } from 'viem';
import * as fs from 'fs';
import * as path from 'path';
import { CONTRACT_ADDRESSES } from '../src/config/contracts';
import { network } from 'hardhat';
import { TAIWAN_COUNTRY_CODE } from '@/lib/viem-public';

// Info: (20260123 - Tzuhan) 設定目標用戶地址
const TARGET_USER_ADDRESS = '0x5eBeE3dbDCED95DC901e2936B1476b961C32Fa92';

async function main() {
  const { viem } = await network.connect();
  // Info: (20260123 - Tzuhan) 1. 初始化 Client
  const [walletClient] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  const adminAddress = walletClient.account.address;

  console.log('---------------------------------------------------');
  console.log('🤖 Starting Identity Fix Process (Direct ABI Mode)');
  console.log('Using Admin Account:', adminAddress);

  // Info: (20260123 - Tzuhan) 2. 讀取 ABI 檔案 (繞過 Hardhat Artifacts)
  const rootDir = process.cwd();
  const identityPath = path.join(rootDir, 'src/abis/Identity.json');
  const registryPath = path.join(rootDir, 'src/abis/IdentityRegistry.json');

  if (!fs.existsSync(identityPath) || !fs.existsSync(registryPath)) {
    throw new Error('❌ ABI files not found in src/abis/. Please check the paths.');
  }

  const IdentityArtifact = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
  const RegistryArtifact = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

  // Info: (20260123 - Tzuhan) 3. 連接 Registry
  const registryAddress =
    CONTRACT_ADDRESSES.IDENTITY_REGISTRY || '0x697eC6a17fA851D63cA987BEAfbbF2DDE2d938aD';
  console.log(`Connecting to Registry at: ${registryAddress}`);

  // Info: (20260123 - Tzuhan) 使用 viem 原生 getContract
  const registry = getContract({
    address: registryAddress,
    abi: RegistryArtifact.abi,
    client: { public: publicClient, wallet: walletClient },
  });

  // Info: (20260123 - Tzuhan) 4. 檢查當前連結
  const currentIdentity = await registry.read.identity([TARGET_USER_ADDRESS]);
  console.log(`Current Registry Record: ${currentIdentity}`);

  // Info: (20260123 - Tzuhan) 5. 部署全新的 Identity 合約
  console.log('Deploying NEW Identity contract...');

  const hash = await walletClient.deployContract({
    abi: IdentityArtifact.abi,
    bytecode: IdentityArtifact.bytecode,
    // Info: (20260123 - Tzuhan) 關鍵修正：_isLibrary = false，確保 Admin 成為管理者
    args: [adminAddress, false],
  });

  console.log(`⏳ Deployment Tx Sent: ${hash}`);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (!receipt.contractAddress) {
    throw new Error('❌ Deployment failed: No contract address returned.');
  }

  const newIdentityAddress = receipt.contractAddress;
  console.log(`✅ New Identity Deployed at: ${newIdentityAddress}`);

  // Info: (20260123 - Tzuhan) 6. 強制覆寫 Registry
  console.log('Overwriting Registry link...');

  // 42 = Taiwan Country Code
  const txHash = await registry.write.registerIdentity([
    TARGET_USER_ADDRESS,
    newIdentityAddress,
    TAIWAN_COUNTRY_CODE,
  ]);

  console.log(`⏳ Register Tx Sent: ${txHash}`);
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  console.log('✅ Registry Updated Successfully!');
  console.log('---------------------------------------------------');
  console.log("Now go to Admin Console -> Click 'Issue Claim' (核發憑證)");
  console.log('---------------------------------------------------');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
