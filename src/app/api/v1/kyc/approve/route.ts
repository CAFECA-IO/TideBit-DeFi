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
  type Abi,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { prisma } from '@/lib/prisma';
import IdentityArtifact from '@/abis/Identity.json';

const RELAYER_PRIVATE_KEY = process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
const CLAIM_TOPIC = BigInt(101); // Info: (20260112 - Tzuhan) Basic KYC

const account = privateKeyToAccount(RELAYER_PRIVATE_KEY);

const walletClient = createWalletClient({
  account,
  transport: http(RPC_URL),
});

const publicClient = createPublicClient({
  transport: http(RPC_URL),
});

const approveKycSchema = z.object({
  userId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = approveKycSchema.safeParse(body);
    if (!parseResult.success) {
      return jsonFail(ApiCode.VALIDATION_ERROR, 'Invalid User ID');
    }
    const { userId } = parseResult.data;

    // Info: (20260112 - Tzuhan) 2. 取得用戶
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return jsonFail(ApiCode.NOT_FOUND, 'User not found');
    if (!user.address) return jsonFail(ApiCode.VALIDATION_ERROR, 'User has no wallet address');

    console.log(`[KYC] Processing user ${user.address}...`);

    // ----------------------------------------------------------------
    // Info: (20260112 - Tzuhan) Step A: 確保用戶有 Identity 合約 (ONCHAINID)
    // ----------------------------------------------------------------
    let identityAddress = user.identityAddress;

    if (!identityAddress) {
      console.log('[KYC] Deploying new Identity for user...');
      const hash = await walletClient.deployContract({
        abi: IdentityArtifact.abi as Abi,
        bytecode: IdentityArtifact.bytecode as `0x${string}`,
        args: [user.address, false],
        chain: undefined,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (!receipt.contractAddress) throw new Error('Identity deployment failed');

      identityAddress = receipt.contractAddress;
      console.log(`[KYC] Identity deployed at ${identityAddress}`);

      // Info: (20260112 - Tzuhan) 存回 DB
      await prisma.user.update({
        where: { id: userId },
        data: { identityAddress },
      });
    } else {
      console.log(`[KYC] User already has Identity: ${identityAddress}`);
    }

    // ----------------------------------------------------------------
    // Info: (20260112 - Tzuhan) Step B: Relayer (Issuer) 簽署 Claim 並寫入 Identity
    // ----------------------------------------------------------------

    // Info: (20260112 - Tzuhan) Claim 內容
    const topic = CLAIM_TOPIC;
    const scheme = BigInt(1); // ECDSA
    const issuer = account.address;
    const data = toHex('KYC_PASSED_V1');
    const uri = '';

    // Info: (20260112 - Tzuhan) 計算 Claim Hash (ERC-735 標準)
    // Info: (20260112 - Tzuhan) keccak256(abi.encode(address identitySubject, uint256 topic, bytes data))
    const claimHash = keccak256(
      encodePacked(['address', 'uint256', 'bytes'], [identityAddress as `0x${string}`, topic, data])
    );

    // Info: (20260112 - Tzuhan) Relayer 簽名
    const signature = await account.signMessage({
      message: { raw: claimHash },
    });

    console.log('[KYC] Adding claim to Identity contract...');

    // Info: (20260112 - Tzuhan) 呼叫 Identity.addClaim
    const txHash = await walletClient.writeContract({
      address: identityAddress as `0x${string}`,
      abi: IdentityArtifact.abi as Abi,
      functionName: 'addClaim',
      args: [topic, scheme, issuer, signature, data, uri],
      chain: undefined,
    });

    await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log(`[KYC] Claim added! Tx: ${txHash}`);

    return jsonOk({
      status: 'APPROVED',
      identityAddress,
      txHash,
    });
  } catch (error) {
    console.error('[KYC] Error:', error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
}
