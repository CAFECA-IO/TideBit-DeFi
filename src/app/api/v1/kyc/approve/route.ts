import { NextRequest } from 'next/server';
import { z } from 'zod';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import {
  createWalletClient,
  http,
  createPublicClient,
  toHex,
  keccak256,
  encodePacked,
  defineChain,
  type Abi,
  type Address,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import IdentityArtifact from '@/abis/Identity.json';
import IdentityRegistryArtifact from '@/abis/IdentityRegistry.json';

// Info: (20260114 - Tzuhan) --- 環境變數與常數 ---
const RELAYER_PRIVATE_KEY = process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');
const TAIWAN_COUNTRY_CODE = 158; // Info: (20260115 - Tzuhan) ISO 3166-1 numeric for Taiwan

// Info: (20260114 - Tzuhan) --- 1. 定義 iSunCoin 鏈資訊 ---
const isuncoin = defineChain({
  id: CHAIN_ID,
  name: 'iSunCoin Mainnet',
  network: 'isuncoin',
  nativeCurrency: {
    decimals: 18,
    name: 'iSunCoin',
    symbol: 'ISC',
  },
  rpcUrls: {
    default: { http: [RPC_URL] },
    public: { http: [RPC_URL] },
  },
});

const account = privateKeyToAccount(RELAYER_PRIVATE_KEY);
const walletClient = createWalletClient({ account, chain: isuncoin, transport: http() });
const publicClient = createPublicClient({ chain: isuncoin, transport: http() });

// Info: (20260115 - Tzuhan) --- 請求驗證 Schema ---
const approveSchema = z.object({
  targetAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, '無效的錢包地址'),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, '無效的代幣地址'),
  type: z.enum(['USER', 'COMPANY']),
});

/**
 * Info: (20260115 - Tzuhan)
 * 核心邏輯：管理員核准 KYC/KYB
 * 遵循「鏈上為真」原則：不依賴 DB，動態查詢 Registry
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = approveSchema.safeParse(body);
    if (!result.success) return jsonFail(ApiCode.VALIDATION_ERROR, result.error.message);

    const { targetAddress, tokenAddress, type } = result.data;
    const targetAddr = targetAddress as Address;
    const tokenAddr = tokenAddress as Address;

    // Info: (20260115 - Tzuhan) 根據類型分配 Topic：101 (個人 KYC) / 102 (公司 KYB)
    const topic = type === 'USER' ? BigInt(101) : BigInt(102);

    console.log(`[KYC/KYB Approve] 目標: ${targetAddr}, 代幣: ${tokenAddr}, 類型: ${type}`);

    // Info: (20260115 - Tzuhan) --- 1. 動態查找：從 Token 合約取得其關聯的 IdentityRegistry 地址 ---
    // Info: (20260115 - Tzuhan) ERC-3643 標準：IToken.identityRegistry()
    const identityRegistryAddress = (await publicClient.readContract({
      address: tokenAddr,
      abi: [
        {
          inputs: [],
          name: 'identityRegistry',
          outputs: [{ type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
      ] as const,
      functionName: 'identityRegistry',
    })) as Address;

    console.log(`[Approve] 動態取得 Registry 地址: ${identityRegistryAddress}`);

    // Info: (20260115 - Tzuhan) --- 2. 鏈上檢查：是否已經通過驗證 (冪等性) ---
    const isVerified = await publicClient.readContract({
      address: identityRegistryAddress,
      abi: IdentityRegistryArtifact.abi as Abi,
      functionName: 'isVerified',
      args: [targetAddr],
    });

    if (isVerified) {
      return jsonOk({ message: '此地址已在鏈上完成驗證', status: 'ALREADY_APPROVED' });
    }

    // Info: (20260115 - Tzuhan) --- 3. 鏈上檢查：取得或部署 Identity 合約 ---
    let identityContractAddress = (await publicClient.readContract({
      address: identityRegistryAddress,
      abi: IdentityRegistryArtifact.abi as Abi,
      functionName: 'getIdentity',
      args: [targetAddr],
    })) as Address;

    let deployTxHash: string | undefined;

    //  Info: (20260115 - Tzuhan)若為 0x0...0 則代表此錢包尚未擁有 Identity 合約
    if (identityContractAddress === '0x0000000000000000000000000000000000000000') {
      console.log(`[Approve] 鏈上未發現 Identity，開始為 ${targetAddr} 部署...`);
      deployTxHash = await walletClient.deployContract({
        abi: IdentityArtifact.abi as Abi,
        bytecode: IdentityArtifact.bytecode as `0x${string}`,
        args: [targetAddr, false], // Info: (20260115 - Tzuhan) owner, managementRequired
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: deployTxHash as `0x${string}`,
      });
      identityContractAddress = receipt.contractAddress!;
      console.log(`[Approve] Identity 合約已部署: ${identityContractAddress}`);
    }

    // Info: (20260115 - Tzuhan) --- 4. 發放憑證 (Add Claim) ---
    const claimData = toHex(type === 'USER' ? 'KYC_TW_PASSED' : 'KYB_TW_PASSED');
    const claimHash = keccak256(
      encodePacked(['address', 'uint256', 'bytes'], [identityContractAddress, topic, claimData])
    );
    const signature = await account.signMessage({ message: { raw: claimHash } });

    console.log(`[Approve] 正在為 Identity 合約添加 Topic ${topic} 憑證...`);
    const claimTxHash = await walletClient.writeContract({
      address: identityContractAddress,
      abi: IdentityArtifact.abi as Abi,
      functionName: 'addClaim',
      args: [topic, BigInt(1), account.address, signature, claimData, ''],
    });
    await publicClient.waitForTransactionReceipt({ hash: claimTxHash });

    // Info: (20260115 - Tzuhan) --- 5. 註冊至 Registry (Register Identity) ---
    // Info: (20260115 - Tzuhan) 固定使用台灣 Country Code: 158
    console.log(`[Approve] 正在將錢包註冊至 Registry (Country: Taiwan)...`);
    const registerTxHash = await walletClient.writeContract({
      address: identityRegistryAddress,
      abi: IdentityRegistryArtifact.abi as Abi,
      functionName: 'registerIdentity',
      args: [targetAddr, identityContractAddress, TAIWAN_COUNTRY_CODE],
    });
    await publicClient.waitForTransactionReceipt({ hash: registerTxHash });

    return jsonOk({
      status: 'APPROVED',
      type,
      country: 'Taiwan (158)',
      targetAddress: targetAddr,
      identityAddress: identityContractAddress,
      registryUsed: identityRegistryAddress,
      transactions: {
        deploy: deployTxHash,
        addClaim: claimTxHash,
        register: registerTxHash,
      },
    });
  } catch (error) {
    console.error('[Approve API] 錯誤:', error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
}
