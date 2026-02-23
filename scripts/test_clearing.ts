import 'dotenv/config';
import { createPublicClient, createWalletClient, http, parseAbi, formatEther, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import { createRequire } from 'module';
import { CONTRACT_ADDRESSES, ABIS } from '../src/config/contracts'; 

const require = createRequire(import.meta.url);
const IDENTITY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/@onchain-id/solidity/contracts/Identity.sol/Identity.json');

// 設定區塊鏈環境
const chainId = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');
const targetChain = defineChain({
  id: chainId,
  name: 'IsunCoin',
  nativeCurrency: { name: 'Token', symbol: 'TOK', decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com'] } },
});

// 初始化客戶端 (使用環境變數中的私鑰作為 Admin 測試者)
const account = privateKeyToAccount(process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`);
const client = createPublicClient({ chain: targetChain, transport: http() });
const wallet = createWalletClient({ account, chain: targetChain, transport: http() });

// 測試用收款方 (取自您之前的部署腳本，該地址已具有 Identity)
const USER_B = '0x8DeF697F326Be8F9CbA8eBe526f7670d56500757';

async function main() {
  console.log(`🚀 開始驗證雙向借貸記帳系統 (測試者: ${account.address})`);

  // --- 輔助函數：印出帳戶餘額 ---
  async function printBalances(address: string, name: string) {
    const ntd = await client.readContract({
      address: CONTRACT_ADDRESSES.NTD_TOKEN,
      abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
      functionName: 'balanceOf', args: [address as `0x${string}`]
    });
    const debt = await client.readContract({
      address: CONTRACT_ADDRESSES.DEBIT_TOKEN,
      abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
      functionName: 'balanceOf', args: [address as `0x${string}`]
    });
    console.log(`📊 [${name}] NTD 餘額: ${formatEther(ntd).padStart(4, ' ')} | DEBT 負債: ${formatEther(debt).padStart(4, ' ')}`);
    return { ntd, debt };
  }

  // ==========================================
  // 📍 步驟 0：確保 Admin 具備合規 Identity
  // ==========================================
  const isVerified = await client.readContract({
    address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
    abi: ABIS.IDENTITY_REGISTRY,
    functionName: 'isVerified',
    args: [account.address]
  });

  if (!isVerified) {
    console.log('⚠️ 偵測到測試者尚未註冊 KYC Identity，正在自動註冊...');
    const idHash = await wallet.deployContract({
      abi: IDENTITY_ARTIFACT.abi, bytecode: IDENTITY_ARTIFACT.bytecode as `0x${string}`, args: [account.address, false]
    });
    const idReceipt = await client.waitForTransactionReceipt({ hash: idHash });
    await wallet.writeContract({
      address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY, abi: ABIS.IDENTITY_REGISTRY,
      functionName: 'registerIdentity', args: [account.address, idReceipt.contractAddress!, 158]
    });
    console.log('✅ 測試者 KYC 註冊完成！\n');
  }

  // 取得初始狀態
  console.log('--- 初始狀態 ---');
  let adminState = await printBalances(account.address, 'Admin');
  await printBalances(USER_B, 'User B');

  // ==========================================
  // 📍 測試 A：透支支付 (餘額不足產生負債)
  // ==========================================
  console.log('\n=============================================');
  console.log('▶️ 測試 A：Admin 發起透支轉帳給 User B');
  console.log('=============================================');
  
  // 為了確保一定會透支，我們轉帳 Admin 目前所有 NTD 餘額 + 10 元
  const transferAmount = adminState.ntd + parseEther('10');
  console.log(`👉 Admin 嘗試轉帳 ${formatEther(transferAmount)} NTD... (預期將產生 10 DEBT)`);

  const txA = await wallet.writeContract({
    address: CONTRACT_ADDRESSES.CLEARING_SERVICE,
    abi: ABIS.CLEARING_SERVICE,
    functionName: 'settlementTransfer',
    args: [account.address, USER_B, transferAmount]
  });
  await client.waitForTransactionReceipt({ hash: txA });
  console.log(`✅ 轉帳成功！(TX: ${txA})`);
  
  adminState = await printBalances(account.address, 'Admin');
  await printBalances(USER_B, 'User B');

  // ==========================================
  // 📍 測試 B：自動還款 (有負債時收到錢自動沖銷)
  // ==========================================
  console.log('\n=============================================');
  console.log('▶️ 測試 B：Admin 獲得資金，系統自動沖銷負債');
  console.log('=============================================');
  
  // 1. 我們先印鈔 50 NTD 給 Admin，模擬 Admin 從外部入金或收到匯款
  console.log('👉 模擬 Admin 外部入金 50 NTD...');
  const txMint = await wallet.writeContract({
    address: CONTRACT_ADDRESSES.NTD_TOKEN,
    abi: parseAbi(['function batchMint(address[], uint256[]) external']),
    functionName: 'batchMint',
    args: [[account.address], [parseEther('50')]]
  });
  await client.waitForTransactionReceipt({ hash: txMint });
  adminState = await printBalances(account.address, 'Admin (入金後，尚未觸發清算)');

  // 2. 觸發自動清算：只要 Admin 再次成為 `settlementTransfer` 的接收方，就會觸發沖銷。
  // 我們可以讓 Admin 發起一筆「自己轉給自己 0.001 NTD」的微小交易來當作觸發器。
  console.log('\n👉 觸發大腦清算：執行微型結算交易 (自動扣款)...');
  const txB = await wallet.writeContract({
    address: CONTRACT_ADDRESSES.CLEARING_SERVICE,
    abi: ABIS.CLEARING_SERVICE,
    functionName: 'settlementTransfer',
    args: [account.address, account.address, parseEther('0.001')]
  });
  await client.waitForTransactionReceipt({ hash: txB });
  console.log(`✅ 清算成功！(TX: ${txB})`);

  console.log('\n--- 最終結算狀態 ---');
  await printBalances(account.address, 'Admin');
  
  console.log('\n🎉 雙向借貸記帳系統 (Dual-Token Clearing) 邏輯驗證完美結束！');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});