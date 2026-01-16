import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';
import { createPublicClient, http, type Address, keccak256, toHex } from 'viem';
import { defineChain } from 'viem';
import SCWFactoryArtifact from '@/abis/SCWFactory.json';

const isuncoin = defineChain({
  id: parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017'),
  name: 'iSunCoin',
  network: 'isuncoin',
  nativeCurrency: { decimals: 18, name: 'iSunCoin', symbol: 'ISC' },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_RPC_URL!] } },
});

const publicClient = createPublicClient({ chain: isuncoin, transport: http() });
const SCW_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_SCW_FACTORY_ADDRESS as Address;

export async function POST(req: NextRequest) {
  try {
    const { companyId } = await req.json();

    // Info: (20260116 - Tzuhan) 1. 取得公司與 Creator 資訊
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { creator: true },
    });

    if (!company) return jsonFail(ApiCode.NOT_FOUND, '公司不存在');
    if (company.status !== 'PENDING') return jsonFail(ApiCode.VALIDATION_ERROR, '公司狀態非待審核');

    const { pubKeyX, pubKeyY } = company.creator;
    if (!pubKeyX || !pubKeyY) {
      return jsonFail(ApiCode.VALIDATION_ERROR, '建立者尚未設定公鑰 (Passkey)，無法預測公司錢包');
    }

    // Info: (20260116 - Tzuhan) 2. 計算確定性 Salt (使用 Company UUID)
    // Info: (20260116 - Tzuhan) 將 UUID 轉為 bytes32 格式，確保鏈上 getAddress 可解析
    const salt = keccak256(toHex(company.id));

    // Info: (20260116 - Tzuhan) 3. 呼叫 SCWFactory 預測 CompanySCW 地址
    // Info: (20260116 - Tzuhan) 重要：這裡的 getAddress 內部必須使用 CompanySCW 的 Bytecode
    // Info: (20260116 - Tzuhan) 或是 Factory 有區分 getCompanyAddress 與 getPersonalAddress
    const predictedAddress = (await publicClient.readContract({
      address: SCW_FACTORY_ADDRESS,
      abi: SCWFactoryArtifact.abi,
      functionName: 'getAddress',
      args: [
        BigInt(pubKeyX),
        BigInt(pubKeyY),
        BigInt(salt),
        true, // Info: (20260116 - Tzuhan) 假設增加 isCompany 標籤來區分 Bytecode，防止與 PersonalSCW 碰撞
      ],
    })) as Address;

    console.log(`[On-chain SoT] 公司預測地址: ${predictedAddress} (Salt: ${salt})`);

    // Info: (20260116 - Tzuhan) 4. 更新 DB (作為鏈上資料的快取)
    await prisma.company.update({
      where: { id: companyId },
      data: {
        status: 'PENDING', // Info: (20260116 - Tzuhan) 保持 PENDING 等待管理員核准 KYB
        address: predictedAddress,
        salt: salt,
        currentStep: 5, // Info: (20260116 - Tzuhan) 標記已完成提交
      },
    });

    return jsonOk({
      companyAddress: predictedAddress,
      message: '公司資料已提交，預測錢包地址已產生，等待 KYB 審核。',
    });
  } catch (error) {
    console.error('[Company Submit Error]:', error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
}
