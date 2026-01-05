import 'dotenv/config';
import { parseAbiItem } from 'viem';
import { publicClient } from '../src/lib/viem';
import { CONTRACT_ADDRESSES } from '../src/config/contracts';
import { webAuthnRepo } from '../src/repositories/webauthn.repo';
import { prisma } from '../src/lib/prisma';

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

        if (!scw || !owners) continue;

        console.log(`[Indexer] New Company Detected: ${name} (${scw})`);

        try {
          // Info: (20251230 - Tzuhan) A. 找出所有 Owner 的 User ID
          // Info: (20251230 - Tzuhan) owners 是 [[x1, y1], [x2, y2]...]
          const ownerConnectQueries = [];

          for (const ownerPubKey of owners) {
            const [x, y] = ownerPubKey;
            // Info: (20251230 - Tzuhan) 嘗試用公鑰找用戶
            const user = await prisma.user.findFirst({
              where: {
                pubKeyX: x.toString(),
                pubKeyY: y.toString(),
              },
            });

            if (user) {
              ownerConnectQueries.push({ id: user.id });
            } else {
              console.warn(`[Indexer] Warning: Owner with pubKey (${x}, ${y}) not found in DB.`);
            }
          }

          // Info: (20251230 - Tzuhan) B. 寫入 Company 並連結 Owners
          await prisma.company.upsert({
            where: { address: scw },
            update: {},
            create: {
              address: scw,
              name: name || 'Unknown Company',
              imageUrl: imageUrl,
              threshold: Number(threshold),
              salt: salt ? salt.toString() : '0',
              owners: {
                connect: ownerConnectQueries,
              },
            },
          });

          console.log(`✅ [Indexer] Synced company ${scw} to DB.`);
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
