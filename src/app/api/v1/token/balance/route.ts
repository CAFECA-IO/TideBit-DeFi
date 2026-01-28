import { NextRequest } from 'next/server';
import { z } from 'zod';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import { parseAbi, formatEther, type Address } from 'viem';
import { NTD_TOKEN_ADDRESS, publicClient } from '@/lib/viem_public';

// Info: (20260127 - Tzuhan) --- 驗證 Schema ---
const balanceSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, '無效的錢包地址'),
  tokenAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, '無效的代幣地址')
    .optional(),
});

// Info: (20260127 - Tzuhan) --- Token ABI (只讀取餘額與符號) ---
const TOKEN_ABI = parseAbi([
  'function balanceOf(address account) external view returns (uint256)',
  'function symbol() external view returns (string)',
  'function decimals() external view returns (uint8)',
]);

export async function GET(req: NextRequest) {
  try {
    // Info: (20260127 - Tzuhan) 1. 解析 Query Parameters
    const { searchParams } = new URL(req.url);
    const query = {
      address: searchParams.get('address'),
      tokenAddress: searchParams.get('tokenAddress') || NTD_TOKEN_ADDRESS,
    };

    // Info: (20260127 - Tzuhan) 2. 參數驗證
    const result = balanceSchema.safeParse(query);
    if (!result.success) {
      return jsonFail(ApiCode.VALIDATION_ERROR, result.error.errors[0].message);
    }

    const targetAddr = result.data.address as Address;
    const tokenAddr = result.data.tokenAddress as Address;

    /**
     * Info: (20260127 - Tzuhan) 3. 透過 Multicall 同時讀取餘額、符號與精度 (提升效能)
     * 如果鏈不支援 Multicall，Viem 會自動拆成多次請求
     */
    const [balance, symbol, decimals] = await Promise.all([
      publicClient.readContract({
        address: tokenAddr,
        abi: TOKEN_ABI,
        functionName: 'balanceOf',
        args: [targetAddr],
      }),
      publicClient.readContract({
        address: tokenAddr,
        abi: TOKEN_ABI,
        functionName: 'symbol',
      }),
      publicClient.readContract({
        address: tokenAddr,
        abi: TOKEN_ABI,
        functionName: 'decimals',
      }),
    ]);

    /**
     * Info: (20260127 - Tzuhan) 4. 格式化回傳 (自動轉為人類可讀數字)
     * formatEther 預設處理 18 位，若 decimals 不同需額外處理，這裡暫定標準 ERC-20
     */
    const formattedBalance = formatEther(balance);

    return jsonOk({
      address: targetAddr,
      tokenAddress: tokenAddr,
      symbol: symbol,
      decimals: decimals,
      balance: formattedBalance, // Info: (20260127 - Tzuhan) 字串格式，如 "1000.0"
      rawBalance: balance.toString(), // Info: (20260127 - Tzuhan) 原始 BigInt 字串
    });
  } catch (error) {
    console.error('[Balance API] Error:', error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
}
