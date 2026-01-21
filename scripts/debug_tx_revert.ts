import 'dotenv/config';
import { createPublicClient, http, defineChain } from 'viem';

// --- 設定區 ---
const TX_HASH = '0xc901230dc682a75948c0699d0f46ab32f70b635e24c3cdea312b838a9bb6d975';
// ----------------

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');

const isuncoin = defineChain({
  id: CHAIN_ID,
  name: 'iSunCoin Mainnet',
  network: 'isuncoin',
  nativeCurrency: { decimals: 18, name: 'iSunCoin', symbol: 'ISC' },
  rpcUrls: { default: { http: [RPC_URL] }, public: { http: [RPC_URL] } },
});

const publicClient = createPublicClient({ chain: isuncoin, transport: http() });

async function main() {
  console.log(`🔍 正在診斷交易: ${TX_HASH} ...\n`);

  try {
    // 1. 取得交易收據 (Receipt)
    const receipt = await publicClient.getTransactionReceipt({ hash: TX_HASH });

    console.log(`📋 交易狀態 (Receipt Status): ${receipt.status}`);

    if (receipt.status === 'success') {
      console.log(`✅ 鏈上狀態確實為 Success。`);
      console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
      console.log(`   Logs 數量: ${receipt.logs.length}`);

      // 如果狀態是 Success 但餘額是 0，檢查是否有 Transfer 事件
      const transferLog = receipt.logs.find(
        (log) =>
          log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // Transfer topic
      );

      if (transferLog) {
        console.log(`🎉 發現 Transfer 事件！代幣確實有轉移。`);
        console.log(`   這代表餘額查詢 API 可能查錯了地址或合約。`);
      } else {
        console.log(`⚠️ 狀態為 Success 但沒有發出 Transfer 事件！`);
        console.log(`   可能原因: Mint 函數執行了，但金額為 0 或邏輯被跳過。`);
      }
    } else {
      console.log(`❌ 鏈上狀態為 Reverted (失敗)。`);
      console.log(`   (瀏覽器顯示的 Success 可能是指 "交易請求成功上鏈"，而非 "執行成功")`);

      // 2. 嘗試抓取 Revert Reason
      console.log(`\n🔍 正在重播交易以獲取錯誤訊息...`);
      const tx = await publicClient.getTransaction({ hash: TX_HASH });

      try {
        await publicClient.call({
          to: tx.to!,
          data: tx.input,
          value: tx.value,
          gas: tx.gas,
        });
      } catch (err) {
        const error = err as { shortMessage?: string; message: string };
        console.error(`\n🚨 抓到了！交易失敗原因:`);
        console.error(`----------------------------------------`);
        console.error(error.shortMessage || error.message);
        console.error(`----------------------------------------`);

        if (error.message.includes('Identity is not verified')) {
          console.log(`💡 解法: 這是合規檢查失敗。請檢查 approve 步驟中的 Relayer 權限或簽名。`);
        } else if (error.message.includes('paused')) {
          console.log(`💡 解法: 合約被暫停了。請執行 unpause 腳本。`);
        }
      }
    }
  } catch (error) {
    console.error('無法取得交易資訊，請確認 RPC 連線或 Hash 是否正確。', error);
  }
}

main();
