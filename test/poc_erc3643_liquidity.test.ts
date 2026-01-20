import { expect } from 'chai';
import { network } from 'hardhat';
import { parseEther, type WalletClient } from 'viem';
import { describe, it } from 'node:test';

const { viem } = await network.connect();

const CLAIM_TOPIC_USER = BigInt(101);
const API_URL = 'http://localhost:3000/api/v1/kyc/approve';

const CONTRACTS = {
  ClaimTopicsRegistry: 'ClaimTopicsRegistry',
  TrustedIssuersRegistry: 'TrustedIssuersRegistry',
  IdentityRegistryStorage: 'IdentityRegistryStorage',
  IdentityRegistry: 'IdentityRegistry',
  DefaultCompliance: 'DefaultCompliance',
  Token: 'Token',
} as const;

describe('TideBit-DeFi POC: ERC-3643 合規流通性測試 (API 整合版)', function () {
  /**
   * 基礎設施部署：建立 T-REX 合規體系
   */
  async function deployTREXFixture() {
    const [deployer, aliceWallet, bobWallet, carolWallet] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    // 1. 部署註冊表相關合約
    const claimTopicsRegistry = await viem.deployContract(CONTRACTS.ClaimTopicsRegistry, []);
    const trustedIssuersRegistry = await viem.deployContract(CONTRACTS.TrustedIssuersRegistry, []);
    const identityRegistryStorage = await viem.deployContract(CONTRACTS.IdentityRegistryStorage, [
      trustedIssuersRegistry.address,
      claimTopicsRegistry.address,
    ]);
    const identityRegistry = await viem.deployContract(CONTRACTS.IdentityRegistry, [
      trustedIssuersRegistry.address,
      claimTopicsRegistry.address,
      identityRegistryStorage.address,
    ]);
    const compliance = await viem.deployContract(CONTRACTS.DefaultCompliance, []);

    // 2. 部署 RWA Token
    const token = await viem.deployContract(CONTRACTS.Token, [
      identityRegistry.address,
      compliance.address,
      'TideBit RWA NTD',
      'TBNTD',
      18,
      identityRegistryStorage.address,
    ]);

    // 3. 系統初始化配置：綁定合約關係
    await identityRegistryStorage.write.bindIdentityRegistry([identityRegistry.address]);
    await identityRegistry.write.addAgent([token.address]);
    await compliance.write.addTokenAgent([token.address]);
    // 讓 deployer 成為代理人以便鑄幣
    await token.write.addAgent([deployer.account.address]);

    // 4. 設定合規 Topic
    await claimTopicsRegistry.write.addClaimTopic([CLAIM_TOPIC_USER]);

    return {
      token,
      identityRegistry,
      deployer,
      aliceWallet,
      bobWallet,
      carolWallet,
      publicClient,
    };
  }

  /**
   * 核心優化：實際呼叫後端 API 進行身分核准
   * 證明「鏈上為真」：API 執行的動作會反映在合約狀態中
   */
  async function approveKycViaApi(targetWallet: WalletClient, tokenAddress: `0x${string}`) {
    const targetAddress = targetWallet.account?.address;

    console.log(`[Test] 正在透過 API 核准地址: ${targetAddress}...`);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetAddress,
        tokenAddress,
        type: 'USER', // 對應 Topic 101
      }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(`API 核准失敗: ${result.message}`);
    }

    console.log(`[Test] API 核准成功，Identity 合約: ${result.data.identityAddress}`);
    return result.data;
  }

  // --- 測試案例 ---

  it('證明 1：只有通過 API 核准的用戶 (Alice) 才能接收鑄造的代幣', async function () {
    const fixture = await deployTREXFixture();
    const { token, aliceWallet } = fixture;
    const aliceAddr = aliceWallet.account.address;

    // 步驟：呼叫 API 核准 Alice
    await approveKycViaApi(aliceWallet, token.address);

    // 執行：鑄造 1000 NTD 給 Alice
    const mintAmount = parseEther('1000');
    await token.write.mint([aliceAddr, mintAmount]);

    // 驗證：餘額正確且合約認定其為 Verified
    const balance = await token.read.balanceOf([aliceAddr]);
    const isVerified = await token.read.isVerified([aliceAddr]);

    expect(balance).to.equal(mintAmount);
    expect(isVerified).to.equal(true);
  });

  it('證明 2：合規下的即時流通 — Alice 與 Bob 互轉，無需人工干預', async function () {
    const fixture = await deployTREXFixture();
    const { token, aliceWallet, bobWallet } = fixture;
    const aliceAddr = aliceWallet.account.address;
    const bobAddr = bobWallet.account.address;

    // 步驟 1：API 核准兩人
    await approveKycViaApi(aliceWallet, token.address);
    await approveKycViaApi(bobWallet, token.address);

    // 步驟 2：分配初始資金
    await token.write.mint([aliceAddr, parseEther('1000')]);

    // 步驟 3：Alice 轉帳給 Bob (鏈上自動檢查 IdentityRegistry)
    const tokenAsAlice = await viem.getContractAt('Token', token.address, {
      client: { wallet: aliceWallet },
    });
    await tokenAsAlice.write.transfer([bobAddr, parseEther('400')]);

    // 驗證：轉帳成功
    expect(await token.read.balanceOf([aliceAddr])).to.equal(parseEther('600'));
    expect(await token.read.balanceOf([bobAddr])).to.equal(parseEther('400'));
  });

  it('證明 3：安全性防護 — 禁止轉帳給未通過 API 核准的用戶 (Carol)', async function () {
    const fixture = await deployTREXFixture();
    const { token, aliceWallet, carolWallet } = fixture;
    const aliceAddr = aliceWallet.account.address;
    const carolAddr = carolWallet.account.address;

    // 步驟 1：只核准 Alice
    await approveKycViaApi(aliceWallet, token.address);
    await token.write.mint([aliceAddr, parseEther('1000')]);

    // 步驟 2：試圖轉帳給未核准的 Carol
    const tokenAsAlice = await viem.getContractAt('Token', token.address, {
      client: { wallet: aliceWallet },
    });

    try {
      await tokenAsAlice.write.transfer([carolAddr, parseEther('100')]);
      expect.fail('應該要被攔截並 Revert');
    } catch (error) {
      // ERC-3643 典型的攔截錯誤訊息
      expect((error as Error).message).to.match(/Transfer not possible|reverted/);
    }
  });
});
