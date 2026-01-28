import { NextRequest } from 'next/server';
import { z } from 'zod';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import { publicClient, NTD_TOKEN_ADDRESS } from '@/lib/viem_public';
import { walletClient } from '@/lib/viem';
import { parseAbi, keccak256, toBytes } from 'viem';

// Info: (20260123 - Tzuhan) 定義 MINTER_ROLE 的 Hash
const MINTER_ROLE = keccak256(toBytes('MINTER_ROLE'));
const TOKEN_ABI = parseAbi([
  'function grantRole(bytes32 role, address account) external',
  'function hasRole(bytes32 role, address account) view returns (bool)',
]);

const schema = z.object({
  targetAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetAddress } = schema.parse(body);

    if (!walletClient) {
      return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, 'Relayer not configured');
    }

    // Info: (20260123 - Tzuhan) 1. 檢查是否已有權限
    const hasRole = await publicClient.readContract({
      address: NTD_TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName: 'hasRole',
      args: [MINTER_ROLE, targetAddress as `0x${string}`],
    });

    if (hasRole) {
      return jsonOk({ message: 'Target already has MINTER_ROLE' });
    }

    console.log(`[Admin] Granting MINTER_ROLE to ${targetAddress}...`);

    // Info: (20260123 - Tzuhan) 2. 平台 (Relayer) 發送授權交易
    const hash = await walletClient.writeContract({
      address: NTD_TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName: 'grantRole',
      args: [MINTER_ROLE, targetAddress as `0x${string}`],
    });

    await publicClient.waitForTransactionReceipt({ hash });

    return jsonOk({
      message: 'Role Granted Successfully',
      txHash: hash,
    });
  } catch (error) {
    console.error('Grant Role Failed:', error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
}
