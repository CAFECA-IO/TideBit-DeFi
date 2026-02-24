'use server';

import { createPublicClient, createWalletClient, http, getAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';

const chainId = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');
const targetChain = defineChain({
  id: chainId,
  name: 'iSunCoin',
  nativeCurrency: { name: 'Token', symbol: 'TOK', decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com'] } },
});

// Info: (20260223 - Tzuhan) 使用後端環境變數中的管理員私鑰
const account = privateKeyToAccount(process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`);
const client = createPublicClient({ chain: targetChain, transport: http() });
const wallet = createWalletClient({ account, chain: targetChain, transport: http() });

/**
 * Info: (20260223 - Tzuhan) 
 * 測試用：由後端 Admin 錢包發起清算轉帳 (Settlement Transfer)
 * @param to 接收方地址
 * @param amount 轉帳金額 (NTD)
 */
export async function adminSettlementTransfer(to: string, amount: number) {
  try {
    const validTo = getAddress(to);
    const amountBigInt = BigInt(amount) * BigInt(10) ** BigInt(18);

    const tx = await wallet.writeContract({
      address: CONTRACT_ADDRESSES.CLEARING_SERVICE,
      abi: ABIS.CLEARING_SERVICE,
      functionName: 'settlementTransfer',
      // Info: (20260223 - Tzuhan) ClearingService 規定發送方必須是 msg.sender，所以 from 填入 account.address
      args: [account.address, validTo, amountBigInt],
    });

    await client.waitForTransactionReceipt({ hash: tx });
    return { success: true, message: `清算轉帳成功！自動觸發會計拋帳。TX: ${tx}` };
  } catch (error) {
    console.error('清算轉帳失敗:', error);
    return { success: false, message: `清算失敗: ${(error as Error).message}` };
  }
}
