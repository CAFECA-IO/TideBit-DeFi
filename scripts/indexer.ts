import 'dotenv/config';
import { parseAbiItem } from 'viem';
import { publicClient } from '@/lib/viem';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { webAuthnRepo } from '@/repositories/webauthn.repo';
import { prisma } from '@/lib/prisma';

/**
 * Info: (20251226 - Tzuhan)
 * Background Indexer Service
 * 職責：監聽鏈上 SCWFactory 事件，即時將新註冊的用戶資料同步到資料庫。
 */
async function main() {
  console.log('🚀 Starting TideBit-DeFi Indexer...');
  console.log(`📡 Watching Factory Contract: ${CONTRACT_ADDRESSES.FACTORY}`);

  // Info: (20251230 - Tzuhan) 1. 監聽 AccountCreated (個人) - 保持不變
  const unwatch = publicClient.watchEvent({
    address: CONTRACT_ADDRESSES.FACTORY,
    event: parseAbiItem(
      'event AccountCreated(address indexed scw, uint256 pubKeyX, uint256 pubKeyY, uint256 salt, string credentialId, string name, string imageUrl)'
    ),
    onLogs: async (logs) => {
      for (const log of logs) {
        const { scw, pubKeyX, pubKeyY, name, imageUrl, credentialId } = log.args;

        if (!scw || !pubKeyX || !pubKeyY) continue;

        console.log(`[Indexer] New Account Detected: ${name} (${scw})`);

        try {
          await webAuthnRepo.upsertUser({
            address: scw,
            pubKeyX: pubKeyX.toString(),
            pubKeyY: pubKeyY.toString(),
            credentialId: credentialId,
            name: name || `User ${scw.slice(0, 6)}`,
            imageUrl: imageUrl,
          });
          console.log(`✅ [Indexer] Synced user ${scw} to DB.`);
        } catch (err) {
          console.error(`❌ [Indexer] Failed to sync user ${scw}:`, err);
        }
      }
    },
    onError: (error) => {
      console.error('❌ [Indexer] Watch Error:', error);
    },
  });

  // Info: (20251230 - Tzuhan) 2. [New] 監聽 CompanyCreated (公司)
  console.log('📡 Watching Company Events...');
  publicClient.watchEvent({
    address: CONTRACT_ADDRESSES.FACTORY,
    event: parseAbiItem(
      'event CompanyCreated(address indexed scw, uint256[][] owners, uint256 threshold, uint256 salt, string name, string imageUrl)'
    ),
    onLogs: async (logs) => {
      for (const log of logs) {
        const { scw, owners, threshold, salt, name, imageUrl } = log.args;

        if (!scw || !owners || owners.length === 0) continue;

        console.log(`[Indexer] New Company Detected: ${name} (${scw})`);

        try {
          // Info: (20251230 - Tzuhan) --- 1. 找出所有 Owner 並確認 Creator ---
          const ownerUsers = [];
          for (const ownerPubKey of owners) {
            const [x, y] = ownerPubKey;
            const user = await prisma.user.findFirst({
              where: {
                pubKeyX: x.toString(),
                pubKeyY: y.toString(),
              },
            });
            if (user) ownerUsers.push(user);
          }

          // Info: (20260116 - Tzuhan) 根據業務邏輯，owners[0] 通常是 Creator
          const creator = ownerUsers[0];

          if (!creator) {
            console.error(`❌ [Indexer] 找不到 Creator (第一位 Owner)，跳過公司 ${scw} 的同步`);
            continue;
          }

          // Info: (20260116 - Tzuhan) --- 2. 執行 Upsert (符合新 Schema) ---
          await prisma.company.upsert({
            where: { address: scw },
            update: {
              // Info: (20260116 - Tzuhan) 更新時也可以同步更新 Owner 名單與名稱
              name: name || undefined,
              imageUrl: imageUrl || undefined,
              threshold: Number(threshold),
              owners: {
                set: ownerUsers.map((u) => ({ id: u.id })), // Info: (20260116 - Tzuhan) 使用 set 確保名單與鏈上一致
              },
            },
            create: {
              address: scw,
              name: name || 'Unknown Company',
              imageUrl: imageUrl,
              threshold: Number(threshold),
              // Info: (20260116 - Tzuhan) 將 uint256 salt 轉為字串儲存，符合新 Schema 的 String 類型
              salt: salt ? salt.toString() : '0',
              // Info: (20260116 - Tzuhan) 關鍵：補上必填的 creatorId 關聯
              creatorId: creator.id,
              owners: {
                connect: ownerUsers.map((u) => ({ id: u.id })),
              },
              // Info: (20260116 - Tzuhan) 預設步驟與狀態
              currentStep: 5,
              status: 'PENDING',
            },
          });

          console.log(`✅ [Indexer] Synced company ${scw} with Creator ${creator.id} to DB.`);
        } catch (err) {
          console.error(`❌ [Indexer] Failed to sync company ${scw}:`, err);
        }
      }
    },
  });

  // Info: (20251226 - Tzuhan) 保持 Process 執行 (除非被強制停止)
  process.on('SIGINT', () => {
    console.log('🛑 Stopping Indexer...');
    unwatch();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Indexer fatal error:', error);
  process.exit(1);
});
