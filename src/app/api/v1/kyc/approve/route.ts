import { NextRequest } from 'next/server';
import { z } from 'zod';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import {
  createWalletClient,
  http,
  createPublicClient,
  toHex,
  keccak256,
  encodeAbiParameters,
  defineChain,
  type Abi,
  type Address,
  pad,
  Hex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import IdentityArtifact from '@/abis/Identity.json';
import IdentityRegistryArtifact from '@/abis/IdentityRegistry.json';

// Info: (20260114 - Tzuhan) --- 環境變數與常數 ---
const RELAYER_PRIVATE_KEY = process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');
const TAIWAN_COUNTRY_CODE = 158;

// Info: (20260114 - Tzuhan) --- 1. 定義 iSunCoin 鏈資訊 ---
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

const approveSchema = z.object({
  targetAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, '無效的錢包地址'),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, '無效的代幣地址'),
  type: z.enum(['USER', 'COMPANY']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = approveSchema.safeParse(body);
    if (!result.success) return jsonFail(ApiCode.VALIDATION_ERROR, result.error.message);

    const { targetAddress, tokenAddress, type } = result.data;
    const targetAddr = targetAddress as Address;
    const tokenAddr = tokenAddress as Address;
    const topic = type === 'USER' ? BigInt(101) : BigInt(102);

    // Info: (20260119 - Tzuhan) 1. 動態取得 Registry
    const identityRegistryAddress = (await publicClient.readContract({
      address: tokenAddr,
      abi: [
        {
          inputs: [],
          name: 'identityRegistry',
          outputs: [{ type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
      ] as const,
      functionName: 'identityRegistry',
    })) as Address;

    // Info: (20260119 - Tzuhan) --- [權限檢查] 確保 Relayer 是 Agent ---
    const isAgent = await publicClient.readContract({
      address: identityRegistryAddress,
      abi: IdentityRegistryArtifact.abi as Abi,
      functionName: 'isAgent',
      args: [account.address],
    });
    if (!isAgent) {
      console.log(`[Approve] 補齊 Relayer Agent 權限...`);
      const tx = await walletClient.writeContract({
        address: identityRegistryAddress,
        abi: IdentityRegistryArtifact.abi as Abi,
        functionName: 'addAgent',
        args: [account.address],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log(`[Approve] 權限補齊成功，繼續執行核准流程`);
    }
    let relayerIdentityAddress = (await publicClient.readContract({
      address: identityRegistryAddress,
      abi: IdentityRegistryArtifact.abi as Abi,
      functionName: 'identity',
      args: [account.address],
    })) as Address;

    if (relayerIdentityAddress === '0x0000000000000000000000000000000000000000') {
      console.log(`[Approve] 建立平台發行者 Identity...`);
      const tx = await walletClient.deployContract({
        abi: IdentityArtifact.abi as Abi,
        bytecode: IdentityArtifact.bytecode as Hex,
        args: [account.address, false],
      });
      const rec = await publicClient.waitForTransactionReceipt({ hash: tx });
      relayerIdentityAddress = rec.contractAddress!;
      // Info: (20260119 - Tzuhan) 賦予 Relayer 簽署權 (Purpose 3)
      await walletClient.writeContract({
        address: relayerIdentityAddress,
        abi: IdentityArtifact.abi as Abi,
        functionName: 'addKey',
        args: [pad(account.address, { size: 32 }), BigInt(3), BigInt(1)],
      });
    }

    // Info: (20260119 - Tzuhan) 3. 取得或部署用戶 Identity
    let userIdentityAddress = (await publicClient.readContract({
      address: identityRegistryAddress,
      abi: IdentityRegistryArtifact.abi as Abi,
      functionName: 'identity',
      args: [targetAddr],
    })) as Address;

    if (userIdentityAddress === '0x0000000000000000000000000000000000000000') {
      console.log(`[Approve] 為用戶 ${targetAddr} 建立 Identity...`);
      const tx = await walletClient.deployContract({
        abi: IdentityArtifact.abi as Abi,
        bytecode: IdentityArtifact.bytecode as Hex,
        args: [account.address, false],
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
      userIdentityAddress = receipt.contractAddress!;

      // Info: (20260119 - Tzuhan) [核心修正]：ONCHAINID Key 必須是 keccak256(abi.encode(address))
      const relayerKeyID = keccak256(encodeAbiParameters([{ type: 'address' }], [account.address]));
      const userKeyID = keccak256(encodeAbiParameters([{ type: 'address' }], [targetAddr]));

      await walletClient.writeContract({
        address: userIdentityAddress,
        abi: IdentityArtifact.abi as Abi,
        functionName: 'addKey',
        args: [relayerKeyID, BigInt(3), BigInt(1)],
      }); // Info: (20260119 - Tzuhan) Purpose 3: Claim Signer
      await walletClient.writeContract({
        address: userIdentityAddress,
        abi: IdentityArtifact.abi as Abi,
        functionName: 'addKey',
        args: [userKeyID, BigInt(1), BigInt(1)],
      }); // Info: (20260119 - Tzuhan) Purpose 1: Management
    }

    // Info: (20260119 - Tzuhan) 3. 生成與添加憑證 (Issuer 設為 Relayer EOA，與 deploy.ts 一致)
    const claimData = toHex(type === 'USER' ? 'KYC_TW_PASSED' : 'KYB_TW_PASSED');
    const claimHash = keccak256(
      encodeAbiParameters(
        [{ type: 'address' }, { type: 'uint256' }, { type: 'bytes' }],
        [userIdentityAddress, topic, claimData]
      )
    );
    const signature = await account.signMessage({ message: { raw: claimHash } });

    console.log(`[Approve] 添加 Topic ${topic} 憑證...`);
    const claimTxHash = await walletClient.writeContract({
      address: userIdentityAddress,
      abi: IdentityArtifact.abi as Abi,
      functionName: 'addClaim',
      args: [topic, BigInt(1), account.address, signature, claimData, ''],
    });
    await publicClient.waitForTransactionReceipt({ hash: claimTxHash });

    // Info: (20260119 - Tzuhan) 4. 註冊至 Registry
    console.log(`[Approve] 註冊至 Registry (台灣: 158)...`);
    const registerTxHash = await walletClient.writeContract({
      address: identityRegistryAddress,
      abi: IdentityRegistryArtifact.abi as Abi,
      functionName: 'registerIdentity',
      args: [targetAddr, userIdentityAddress, TAIWAN_COUNTRY_CODE],
    });
    await publicClient.waitForTransactionReceipt({ hash: registerTxHash });

    return jsonOk({
      status: 'APPROVED',
      userIdentity: userIdentityAddress,
      transactions: { addClaim: claimTxHash, register: registerTxHash },
    });
  } catch (error) {
    console.error('[Approve API] 錯誤:', error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
}
