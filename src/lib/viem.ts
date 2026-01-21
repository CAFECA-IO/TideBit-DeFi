import { createPublicClient, createWalletClient, http, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Info: (20260121 - Tzuhan) --- 環境變數讀取 ---
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');
const RELAYER_PRIVATE_KEY = process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`;

if (!RELAYER_PRIVATE_KEY) {
  console.warn('⚠️ 未設定 ISUNCOIN_PRIVATE_KEY，Relayer 功能將無法使用');
}

// Info: (20260121 - Tzuhan) --- 1. 定義 iSunCoin 鏈 ---
export const isuncoin = defineChain({
  id: CHAIN_ID,
  name: 'iSunCoin Mainnet',
  network: 'isuncoin',
  nativeCurrency: { decimals: 18, name: 'iSunCoin', symbol: 'ISC' },
  rpcUrls: { default: { http: [RPC_URL] }, public: { http: [RPC_URL] } },
});

// Info: (20260121 - Tzuhan) --- 2. 公開客戶端 (唯讀操作) ---
// Info: (20260121 - Tzuhan) 全域單例，避免重複連線
export const account = privateKeyToAccount(RELAYER_PRIVATE_KEY);
export const walletClient = createWalletClient({ account, chain: isuncoin, transport: http() });
export const publicClient = createPublicClient({ chain: isuncoin, transport: http() });

// Info: (20260121 - Tzuhan) --- 3. Relayer 客戶端 (寫入操作) ---
// Info: (20260121 - Tzuhan) 只有在 Server Side 且有私鑰時才建立，避免前端報錯
export const relayerClient = RELAYER_PRIVATE_KEY
  ? createWalletClient({
      account: privateKeyToAccount(RELAYER_PRIVATE_KEY),
      chain: isuncoin,
      transport: http(),
    })
  : null; // Info: (20260121 - Tzuhan) 若無私鑰則為 null

// Info: (20260121 - Tzuhan) 匯出 Relayer 帳戶資訊方便取用地址
export const relayerAccount = RELAYER_PRIVATE_KEY ? privateKeyToAccount(RELAYER_PRIVATE_KEY) : null;

export const NTD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_NTD_TOKEN_ADDRESS as `0x${string}`;
