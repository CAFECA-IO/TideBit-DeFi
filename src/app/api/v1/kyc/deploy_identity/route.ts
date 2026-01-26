import { NextRequest } from 'next/server';
import { parseAbi } from 'viem';
import { walletClient, account, publicClient, TAIWAN_COUNTRY_CODE } from '@/lib/viem';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import IdentityArtifact from '@/abis/Identity.json';
import { jsonFail, jsonOk } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';

const IR_ABI = parseAbi([
  'function registerIdentity(address user, address identity, uint16 country) external',
]);

export async function POST(req: NextRequest) {
  try {
    const { userAddress, countryCode } = await req.json();

    if (!walletClient || !account) {
      return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, 'Relayer not configured');
    }

    // Info: (20260123 - Tzuhan) 1. 部署 Identity 合約
    const hashDeploy = await walletClient.deployContract({
      abi: IdentityArtifact.abi,
      bytecode: IdentityArtifact.bytecode as `0x${string}`,
      // Info: (20260123 - Tzuhan) 修正：第二個參數 _isLibrary 必須為 false，Admin 才會被設為 Management Key
      args: [account.address, false],
      account,
    });

    console.log('Deploying Identity:', hashDeploy);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: hashDeploy });

    if (!receipt.contractAddress) {
      throw new Error('Identity deployment failed');
    }
    const identityAddress = receipt.contractAddress;
    console.log('Identity Deployed at:', identityAddress);

    // Info: (20260123 - Tzuhan) 2. 將 Identity 註冊到 Registry
    const hashRegister = await walletClient.writeContract({
      address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY, // Info: (20260123 - Tzuhan) 確保 config 變數名稱正確
      abi: IR_ABI,
      functionName: 'registerIdentity',
      args: [userAddress, identityAddress, parseInt(countryCode || TAIWAN_COUNTRY_CODE)],
      account,
    });

    console.log(`[Compliance] Transaction sent: ${hashRegister}`);

    const receiptRegister = await publicClient.waitForTransactionReceipt({ hash: hashRegister });

    if (receiptRegister.status !== 'success') {
      throw new Error('Identity registration transaction failed');
    }
    console.log(
      `[Compliance] Identity registered for user ${userAddress} with identity ${identityAddress}`
    );

    return jsonOk({
      txHash: hashRegister,
      message: 'User identity registered to ERC-3643 Registry',
    });
  } catch (error) {
    console.error('Deploy Identity Error:', error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
}
