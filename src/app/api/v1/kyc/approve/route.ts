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
  defineChain, // Info: (20260114 - Tzuhan) 用於定義自定義鏈
  type Abi,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { prisma } from '@/lib/prisma';
import IdentityArtifact from '@/abis/Identity.json';
import IdentityRegistryArtifact from '@/abis/IdentityRegistry.json';

// Info: (20260114 - Tzuhan) --- 環境變數與常數 ---
const RELAYER_PRIVATE_KEY = process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');
const CLAIM_TOPIC = BigInt(101); // Info: (20260114 - Tzuhan) Basic KYC Topic

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

// Info: (20260114 - Tzuhan) --- 2. 初始化 Client 時注入 chain ---
const walletClient = createWalletClient({
  account,
  chain: isuncoin, // Info: (20260114 - Tzuhan) 注入鏈資訊後，後續 action 就不需重複寫 chain: isuncoin
  transport: http(RPC_URL),
});

const publicClient = createPublicClient({
  chain: isuncoin,
  transport: http(RPC_URL),
});

const approveKycSchema = z.object({
  userId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = approveKycSchema.safeParse(body);
    if (!parseResult.success) return jsonFail(ApiCode.VALIDATION_ERROR, 'Invalid User ID');

    const { userId } = parseResult.data;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.address) return jsonFail(ApiCode.NOT_FOUND, 'User or wallet not found');

    console.log(`[KYC] Processing User: ${userId}, Wallet: ${user.address}`);

    // Info: (20260114 - Tzuhan) Step A: 部署或取得 Identity 合約
    let identityAddress = user.identityAddress;
    if (!identityAddress) {
      console.log('[KYC] Deploying Identity contract...');
      const hash = await walletClient.deployContract({
        abi: IdentityArtifact.abi as Abi,
        bytecode: IdentityArtifact.bytecode as `0x${string}`,
        args: [user.address, false],
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      identityAddress = receipt.contractAddress!;

      await prisma.user.update({
        where: { id: userId },
        data: { identityAddress },
      });
    }

    // Info: (20260114 - Tzuhan) Step B: 添加 KYC Claim (Topic 101)
    const data = toHex('KYC_PASSED_V1');
    const claimHash = keccak256(
      encodePacked(
        ['address', 'uint256', 'bytes'],
        [identityAddress as `0x${string}`, CLAIM_TOPIC, data]
      )
    );
    const signature = await account.signMessage({ message: { raw: claimHash } });

    console.log('[KYC] Adding Claim...');
    const claimTxHash = await walletClient.writeContract({
      address: identityAddress as `0x${string}`,
      abi: IdentityArtifact.abi as Abi,
      functionName: 'addClaim',
      args: [CLAIM_TOPIC, BigInt(1), account.address, signature, data, ''],
    });
    await publicClient.waitForTransactionReceipt({ hash: claimTxHash });

    // Info: (20260114 - Tzuhan) Step C: 註冊 Identity 到 Registry (關鍵流通性步驟)
    if (!identityAddress) throw new Error('IDENTITY_REGISTRY_ADDRESS is not configured');

    console.log('[KYC] Registering Identity to Registry...');
    const countryCode = 458;

    const registerTxHash = await walletClient.writeContract({
      address: identityAddress as `0x${string}`,
      abi: IdentityRegistryArtifact.abi as Abi,
      functionName: 'registerIdentity',
      args: [user.address as `0x${string}`, identityAddress as `0x${string}`, countryCode],
    });
    await publicClient.waitForTransactionReceipt({ hash: registerTxHash });

    return jsonOk({
      status: 'APPROVED',
      identityAddress,
      claimTxHash,
      registerTxHash,
    });
  } catch (error) {
    console.error('[KYC] API Error:', error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
}
