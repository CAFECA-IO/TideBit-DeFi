import { NextRequest } from 'next/server';
import { z } from 'zod';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import {
  createWalletClient,
  http,
  createPublicClient,
  defineChain,
  parseAbi,
  parseEther,
  type Address,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Info: (20260120 - Tzuhan) --- 環境變數與常數 ---
const RELAYER_PRIVATE_KEY = process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');

// Info: (20260120 - Tzuhan) --- 定義 iSunCoin 鏈資訊 ---
const isuncoin = defineChain({
  id: CHAIN_ID,
  name: 'iSunCoin Mainnet',
  network: 'isuncoin',
  nativeCurrency: { decimals: 18, name: 'iSunCoin', symbol: 'ISC' },
  rpcUrls: { default: { http: [RPC_URL] }, public: { http: [RPC_URL] } },
});

// Info: (20260120 - Tzuhan) --- 初始化 Viem Clients ---
const account = privateKeyToAccount(RELAYER_PRIVATE_KEY);
const walletClient = createWalletClient({ account, chain: isuncoin, transport: http() });
const publicClient = createPublicClient({ chain: isuncoin, transport: http() });

// Info: (20260120 - Tzuhan) --- Zod 驗證 Schema ---
const mintSchema = z.object({
  targetAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, '無效的錢包地址'),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, '無效的代幣地址'),
  // Info: (20260120 - Tzuhan) 支援字串或數字輸入，轉為字串處理以避免精度問題
  amount: z.union([z.string(), z.number()]).transform((val) => val.toString()),
});

// Info: (20260120 - Tzuhan) --- ERC-3643 Token ABI (部分) ---
const TOKEN_ABI = parseAbi([
  // 核心鑄造函式
  'function mint(address _to, uint256 _amount) external',
  // 查驗身分狀態 (Optional, 供除錯用)
  'function isVerified(address _userAddress) external view returns (bool)',
  // 暫停狀態檢查
  'function paused() external view returns (bool)',
]);

export async function POST(req: NextRequest) {
  try {
    // 1. 解析與驗證請求參數
    const body = await req.json();
    const result = mintSchema.safeParse(body);

    if (!result.success) {
      return jsonFail(ApiCode.VALIDATION_ERROR, result.error.message);
    }

    const { targetAddress, tokenAddress, amount } = result.data;
    const targetAddr = targetAddress as Address;
    const tokenAddr = tokenAddress as Address;

    // Info: (20260120 - Tzuhan) 2. 轉換金額 (假設 token 為 18 位小數)
    // 若未來有不同小數點位數的 Token，需動態讀取 decimals()
    const mintAmount = parseEther(amount);

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

    // Info: (20260120 - Tzuhan) 6. 等待交易確認 (Optional: 視業務需求決定是否要 sync 等待)
    // 為了確保入金狀態一致性，這裡選擇等待確認
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
