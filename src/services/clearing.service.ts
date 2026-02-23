'use server';

import { createPublicClient, createWalletClient, http, getAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';

const chainId = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');
const targetChain = defineChain({
  id: chainId,
  name: 'IsunCoin',
  nativeCurrency: { name: 'Token', symbol: 'TOK', decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com'] },
  },
});

const account = privateKeyToAccount(process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`);
const client = createPublicClient({ chain: targetChain, transport: http() });
const wallet = createWalletClient({ account, chain: targetChain, transport: http() });

/**
 * Info: (20260223 - Tzuhan) 
 * 1. 部署子公司的專屬雙代幣帳本 (由伺服器 Admin 錢包發起)
 */
export async function deployCompanyAccountBook(companyScw: string, projectName: string) {
  try {
    const tx = await wallet.writeContract({
      address: CONTRACT_ADDRESSES.ACCOUNT_BOOK_FACTORY,
      abi: ABIS.ACCOUNT_BOOK_FACTORY,
      functionName: 'createAccountBook',
      args: [getAddress(companyScw), projectName, 18],
    });

    const receipt = await client.waitForTransactionReceipt({ hash: tx });
    return { success: true, message: '子公司帳本部署成功！', txHash: tx, receipt };
  } catch (error) {
    console.error('部署子公司帳本失敗:', error);
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Info: (20260223 - Tzuhan) 
 * 2. 產生清算轉帳的 CallData (供前端 ERC-4337 智能錢包 SCW 打包使用)
 * 注意：合約有寫 require(msg.sender == from)，所以這筆交易必須由用戶的 SCW 自己發起！
 */
export async function getSettlementTransferCallData(
  fromAddress: string,
  toAddress: string,
  amount: number
) {
  const { encodeFunctionData } = await import('viem');
  const amountBigInt = BigInt(amount) * BigInt(10) ** BigInt(18);

  const callData = encodeFunctionData({
    abi: ABIS.CLEARING_SERVICE,
    functionName: 'settlementTransfer',
    args: [getAddress(fromAddress), getAddress(toAddress), amountBigInt],
  });

  return {
    targetAddress: CONTRACT_ADDRESSES.CLEARING_SERVICE,
    callData,
    value: BigInt(0),
  };
}
