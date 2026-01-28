import { NextRequest } from 'next/server';
import { walletClient, account, publicClient } from '@/lib/viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';

export async function POST(req: NextRequest) {
  try {
    const { relayerAddress, topic } = await req.json();
    const tirAddress = CONTRACT_ADDRESSES.TRUSTED_ISSUERS_REGISTRY;
    const claimTopic = BigInt(topic);

    // Info: (20260127 - Tzuhan) 1. 先檢查該 Relayer 是否已經是 Trusted Issuer
    const isAlreadyTrusted = await publicClient.readContract({
      address: tirAddress,
      abi: ABIS.TRUSTED_ISSUERS_REGISTRY,
      functionName: 'isTrustedIssuer',
      args: [relayerAddress],
    });

    let hash;

    if (!walletClient) {
      return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, 'Relayer not configured');
    }

    if (isAlreadyTrusted) {
      /**
       * Info: (20260127 - Tzuhan) 情況 A：發行者已存在，使用更新邏輯 (覆蓋或新增 Topic)
       * 注意：這會設定該發行者「僅擁有」傳入的這個 Topic
       */
      console.log(`[Admin] Relayer 已存在，執行 updateIssuerClaimTopics...`);
      hash = await walletClient.writeContract({
        address: tirAddress,
        abi: ABIS.TRUSTED_ISSUERS_REGISTRY,
        functionName: 'updateIssuerClaimTopics',
        args: [relayerAddress, [claimTopic]],
        account,
      });
    } else {
      // Info: (20260127 - Tzuhan) 情況 B：全新發行者，使用新增邏輯
      console.log(`[Admin] 執行 addTrustedIssuer...`);
      hash = await walletClient.writeContract({
        address: tirAddress,
        abi: ABIS.TRUSTED_ISSUERS_REGISTRY,
        functionName: 'addTrustedIssuer',
        args: [relayerAddress, [claimTopic]],
        account,
      });
    }

    await publicClient.waitForTransactionReceipt({ hash });

    return jsonOk({
      message: isAlreadyTrusted ? 'Topic 授權更新成功' : '全新發行者註冊成功',
      txHash: hash,
    });
  } catch (error) {
    console.error('Grant Issuer Role Failed:', error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
}
