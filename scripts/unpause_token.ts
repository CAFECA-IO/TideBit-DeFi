import 'dotenv/config';
import { createWalletClient, http, createPublicClient, defineChain, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// 1. 設定環境
const RELAYER_PRIVATE_KEY = process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_NTD_TOKEN_ADDRESS as `0x${string}`;

const isuncoin = defineChain({
  id: CHAIN_ID,
  name: 'iSunCoin Mainnet',
  network: 'isuncoin',
  nativeCurrency: { decimals: 18, name: 'iSunCoin', symbol: 'ISC' },
  rpcUrls: { default: { http: [RPC_URL] }, public: { http: [RPC_URL] } },
});

const account = privateKeyToAccount(RELAYER_PRIVATE_KEY);
const walletClient = createWalletClient({ account, chain: isuncoin, transport: http() });
const publicClient = createPublicClient({ chain: isuncoin, transport: http() });

async function main() {
  console.log(`正在解除 Token ${TOKEN_ADDRESS} 的暫停狀態...`);

  // 檢查目前狀態
  const isPaused = await publicClient.readContract({
    address: TOKEN_ADDRESS,
    abi: parseAbi(['function paused() external view returns (bool)']),
    functionName: 'paused',
  });

  if (!isPaused) {
    console.log('✅ Token 已經是 Unpaused 狀態，無需操作。');
    return;
  }

  // 執行 Unpause
  const hash = await walletClient.writeContract({
    address: TOKEN_ADDRESS,
    abi: parseAbi(['function unpause() external']),
    functionName: 'unpause',
    args: [],
  });

  console.log(`交易已發送: ${hash}`);
  await publicClient.waitForTransactionReceipt({ hash });
  console.log('✅ Token 解除暫停成功！現在可以進行 Mint 了。');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
