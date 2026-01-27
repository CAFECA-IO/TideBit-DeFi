import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import { parseAbi, parseUnits, type Address } from 'viem';
import { publicClient, walletClient, account } from '@/lib/viem';

// Info: (20260120 - Tzuhan) --- Zod 驗證 Schema ---
const mintSchema = z.object({
  targetAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, '無效的錢包地址'),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, '無效的代幣地址'),
  // Info: (20260120 - Tzuhan) 支援字串或數字輸入，轉為字串處理以避免精度問題
  amount: z.union([z.string(), z.number()]).transform((val) => val.toString()),
});

// Info: (20260120 - Tzuhan) --- ERC-3643 Token ABI (部分) ---
const TOKEN_ABI = parseAbi([
  // Info: (20260121 - Tzuhan) 核心鑄造函式
  'function mint(address _to, uint256 _amount) external',
  // Info: (20260121 - Tzuhan) 暫停狀態檢查
  'function paused() external view returns (bool)',
  'function decimals() external view returns (uint8)',
]);

export async function POST(req: NextRequest) {
  try {
    // Info: (20260121 - Tzuhan) 1. 解析與驗證請求參數
    const body = await req.json();
    const result = mintSchema.safeParse(body);

    if (!result.success) {
      return jsonFail(ApiCode.VALIDATION_ERROR, result.error.message);
    }

    // Check if Relayer is configured
    if (!account || !walletClient) {
      return NextResponse.json(
        { code: 503, message: 'Relayer not configured (Missing Private Key)' },
        { status: 503 }
      );
    }

    const { targetAddress, tokenAddress, amount } = result.data;
    const targetAddr = targetAddress as Address;
    const tokenAddr = tokenAddress as Address;

    const decimals = await publicClient.readContract({
      address: tokenAddr,
      abi: TOKEN_ABI,
      functionName: 'decimals',
    });

    // Info: (20260120 - Tzuhan) 2. 轉換金額 (假設 token 為 18 位小數), 若未來有不同小數點位數的 Token，需動態讀取 decimals()
    const mintAmount = parseUnits(amount, decimals);

    console.log(`[Mint API] 準備鑄造 ${amount} tokens 給 ${targetAddress}...`);

    // Info: (20260120 - Tzuhan) 4. 檢查合約是否暫停
    const isPaused = await publicClient.readContract({
      address: tokenAddr,
      abi: TOKEN_ABI,
      functionName: 'paused',
    });

    if (isPaused) {
      return jsonFail(ApiCode.FORBIDDEN, '代幣合約目前處於暫停狀態 (Paused)，無法鑄造');
    }

    // Info: (20260120 - Tzuhan) 5. 發送鑄造交易
    // 使用 Relayer (Agent) 的私鑰簽署並發送
    const txHash = await walletClient.writeContract({
      address: tokenAddr,
      abi: TOKEN_ABI,
      functionName: 'mint',
      args: [targetAddr, mintAmount],
      // Info: (20260120 - Tzuhan) 若遇到節點同步問題，可考慮加上 gas 參數跳過模擬，但在 mint 場景通常較少見
      gas: BigInt(200000),
    });

    console.log(`[Mint API] 交易已發送: ${txHash}`);

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    if (receipt.status !== 'success') {
      return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, '鑄造交易執行失敗 (Reverted)');
    }

    return jsonOk({
      status: 'SUCCESS',
      transactionHash: txHash,
      recipient: targetAddress,
      amount: amount,
      tokenAddress: tokenAddress,
    });
  } catch (error) {
    console.error('[Mint API] 錯誤:', error);

    // Info: (20260120 - Tzuhan) 嘗試解析合約錯誤訊息
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('AgentRole')) {
      return jsonFail(ApiCode.FORBIDDEN, 'Relayer 錢包沒有鑄造權限 (Not an Agent)');
    }
    if (errorMessage.includes('Identity is not verified')) {
      return jsonFail(ApiCode.FORBIDDEN, '用戶身份驗證失效或未完成');
    }

    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, errorMessage);
  }
}
