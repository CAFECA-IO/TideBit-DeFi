import { NextRequest, NextResponse } from 'next/server';
import { keccak256, encodeAbiParameters, parseAbiParameters, stringToHex } from 'viem';
import { walletClient, account, publicClient } from '@/lib/viem';
import { ABIS } from '@/config/contracts';

export async function POST(req: NextRequest) {
  try {
    const { identityAddress, topic } = await req.json();

    if (!walletClient || !account) {
      return NextResponse.json(
        { success: false, message: 'Server wallet not configured' },
        { status: 500 }
      );
    }
    const relayerKey = keccak256(
      encodeAbiParameters(parseAbiParameters('address'), [account.address as `0x${string}`])
    );
    const MANAGEMENT_PURPOSE = BigInt(1);

    const hasPermission = await publicClient.readContract({
      address: identityAddress,
      abi: ABIS.IDENTITY,
      functionName: 'keyHasPurpose',
      args: [relayerKey, MANAGEMENT_PURPOSE],
    });

    // Info: (20260123 - Fix) 若無權限應直接回傳錯誤，避免後續交易失敗
    if (!hasPermission) {
      console.error(
        `Relayer ${account.address} 缺少 Identity ${identityAddress} 的 Management 權限！`
      );
      return NextResponse.json(
        {
          success: false,
          message:
            'Relayer lacks Management permission on the target Identity. Check if Relayer key was added.',
        },
        { status: 403 }
      );
    }

    const claimTopic = BigInt(topic);
    const scheme = BigInt(1); // Info: (20260123 - Tzuhan) 1 = ECDSA
    const issuer = account.address;
    const data = stringToHex('KYC Verified via Admin Console');
    const uri = '';

    // Info: (20260123 - Tzuhan) 1. 計算 Hash (修正點：使用 encodeAbiParameters 對應 Solidity 的 abi.encode)
    // Info: (20260123 - Tzuhan) Solidity logic: keccak256(abi.encode(identity, topic, data))
    const dataHash = keccak256(
      encodeAbiParameters(parseAbiParameters('address identity, uint256 topic, bytes data'), [
        identityAddress as `0x${string}`,
        claimTopic,
        data,
      ])
    );

    // Info: (20260123 - Tzuhan) 2. Server 簽名
    // Info: (20260123 - Tzuhan) signMessage 會自動加上 "\x19Ethereum Signed Message:\n32" 前綴
    // Info: (20260123 - Tzuhan) 這對應合約中的 ECDSA.toEthSignedMessageHash(hash)
    const signature = await walletClient.signMessage({
      message: { raw: dataHash },
      account,
    });

    console.log('Claim Signer:', issuer);
    console.log('Target Identity:', identityAddress);
    console.log('Data Hash:', dataHash);
    console.log('Signature:', signature);

    // Info: (20260123 - Tzuhan) 3. 呼叫 Identity.addClaim
    const hash = await walletClient.writeContract({
      address: identityAddress as `0x${string}`,
      abi: ABIS.IDENTITY,
      functionName: 'addClaim',
      args: [claimTopic, scheme, issuer, signature, data, uri],
      account,
      // Info: (20260123 - Fix) 強制指定 Gas Limit，跳過 estimateGas 模擬檢查
      // 避免因節點資料不同步或權限邊緣情況導致的 Execution reverted
      gas: BigInt(600000),
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log(`${JSON.stringify(receipt)}`);

    if (receipt.status !== 'success') {
      throw new Error('Add claim transaction failed');
    }

    return NextResponse.json({ success: true, txHash: hash });
  } catch (error) {
    console.error('Add Claim Error Details:', error);
    // Info: (20260123 - Tzuhan) 嘗試回傳更詳細的錯誤資訊
    let errorMsg: string;
    if (
      typeof error === 'object' &&
      error !== null &&
      'shortMessage' in error &&
      typeof (error as { shortMessage?: unknown }).shortMessage === 'string'
    ) {
      errorMsg = (error as { shortMessage: string }).shortMessage;
    } else if (error instanceof Error) {
      errorMsg = error.message;
    } else {
      errorMsg = String(error);
    }
    return NextResponse.json(
      {
        success: false,
        message: errorMsg,
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
