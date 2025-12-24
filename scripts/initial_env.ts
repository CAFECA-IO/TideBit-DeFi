import { promises as fs } from 'fs';
import path from 'path';
import { generateKeyPair, exportPKCS8 } from 'jose';

/**
 * Info: (20250925 - Tzuhan) 【更新】確保環境變數存在且有值。如果不存在或值為空，則會移除舊行並添加新行。
 * @param content - 當前的 .env 文件內容
 * @param key - 要檢查的變數名
 * @param valueFn - 一個回傳變數值的函式
 * @returns 更新後的 .env 文件內容
 */
async function ensureEnvVar(
  content: string,
  key: string,
  valueFn: () => string | Promise<string>
): Promise<string> {
  // Info: (20250925 - Tzuhan) 正則表達式現在檢查 key 後面是否至少有一個字符 (.+)
  const hasKeyWithNonEmptyValue = new RegExp(`^${key}=.+$`, 'm');

  // Info: (20250925 - Tzuhan) 如果變數已存在且有值，直接返回，不做任何操作。
  if (hasKeyWithNonEmptyValue.test(content)) {
    return content;
  }

  // Info: (20250925 - Tzuhan) 如果代碼執行到這裡，表示 key 不存在或其值為空。
  const contentWithoutKey = content.replace(new RegExp(`^${key}=.*\n?`, 'm'), '');

  console.log(`-> Setting or updating environment variable: ${key}`);

  let newContent = contentWithoutKey;
  if (newContent.length > 0 && !newContent.endsWith('\n')) {
    newContent += '\n';
  }
  const value = await valueFn();
  return `${newContent}${key}=${value}\n`;
}

/**
 * Info: (20250925 - Tzuhan) 生成 ES256 金鑰對並回傳格式化後的 PEM 私鑰。
 */
async function generateFormattedPrivateKey(): Promise<string> {
  const { privateKey } = await generateKeyPair('ES256', { extractable: true });
  const pem = await exportPKCS8(privateKey);
  // Info: (20250925 - Tzuhan) 將換行符號轉義，確保能單行存入 .env
  return `"${pem.replace(/\n/g, '\\n')}"`;
}

async function initializeEnv() {
  console.log('Checking .env file for TideBit DeFi setup...');
  const envFile = path.resolve(process.cwd(), '.env');
  const sampleFile = path.resolve(process.cwd(), '.env.example');
  let originalContent = '';

  try {
    originalContent = await fs.readFile(envFile, 'utf-8');
  } catch {
    try {
      await fs.copyFile(sampleFile, envFile);
      originalContent = await fs.readFile(envFile, 'utf-8');
      console.log('Initialized .env from .env.example.');
    } catch {
      console.log('No .env or .env.example found. A new .env file will be created.');
    }
  }

  let modifiedContent = originalContent;

  modifiedContent = await ensureEnvVar(
    modifiedContent,
    'NEXT_PUBLIC_APP_URL',
    () => '"http://localhost:3000"'
  );

  modifiedContent = await ensureEnvVar(
    modifiedContent,
    'DEWT_PRIVATE_KEY_PEM',
    generateFormattedPrivateKey
  );

  // Info: (20251223 - Tzuhan) 確保 DATABASE_URL 存在 (提醒用)
  if (!/^DATABASE_URL=.*$/m.test(modifiedContent)) {
    console.warn('\n[!] IMPORTANT: Please manually set your DATABASE_URL in the .env file.');
  }

  if (modifiedContent !== originalContent) {
    await fs.writeFile(envFile, modifiedContent, 'utf-8');
    console.log('✅ .env file updated successfully.');
  } else {
    console.log('No changes needed for .env file.');
  }
}

initializeEnv().catch((error) => {
  console.error('An error occurred during .env initialization:', error);
  process.exit(1);
});
