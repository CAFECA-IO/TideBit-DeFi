import { expect } from 'chai';
import { network } from 'hardhat';
import { keccak256, parseEther, toHex, type WalletClient } from 'viem';
import { describe, it } from 'node:test';

const { viem } = await network.connect();

// Info: (20260114 - User) --- Constants & Types ---
const CLAIM_TOPIC = keccak256(toHex('KYC_VERIFIED'));
const COUNTRY_CODE_TW = BigInt(158);
const CONTRACTS = {
  ClaimTopicsRegistry:
    '@erc3643org/erc-3643/contracts/registry/implementation/ClaimTopicsRegistry.sol:ClaimTopicsRegistry',
  TrustedIssuersRegistry:
    '@erc3643org/erc-3643/contracts/registry/implementation/TrustedIssuersRegistry.sol:TrustedIssuersRegistry',
  IdentityRegistryStorage:
    '@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistryStorage.sol:IdentityRegistryStorage',
  IdentityRegistry:
    '@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistry.sol:IdentityRegistry',
  DefaultCompliance:
    '@erc3643org/erc-3643/contracts/compliance/legacy/DefaultCompliance.sol:DefaultCompliance',
  Token: '@erc3643org/erc-3643/contracts/token/Token.sol:Token',
  Identity: '@onchain-id/solidity/contracts/Identity.sol:Identity',
} as const;

describe('TideBit-DeFi POC: ERC-3643 Token Liquidity (Strict TS)', function () {
  /**
   * Info: (20260114 - User) 部署 T-REX (ERC-3643) 核心基礎設施
   */
  async function deployTREXFixture() {
    const [deployer, issuerWallet, aliceWallet, bobWallet, carolWallet] =
      await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    // 1. 部署 Registry 相關合約
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

    // 2. 部署 Token
    const token = await viem.deployContract(CONTRACTS.Token, [
      identityRegistry.address,
      compliance.address,
      'TideBit RWA',
      'TDRWA',
      18,
      identityRegistryStorage.address,
    ]);

    // 3. 系統配置綁定
    await identityRegistryStorage.write.bindIdentityRegistry([identityRegistry.address]);
    await identityRegistry.write.addAgent([token.address]);
    await compliance.write.addTokenAgent([token.address]);
    await token.write.addAgent([deployer.account.address]);

    // 4. 設定合規規則
    await claimTopicsRegistry.write.addClaimTopic([CLAIM_TOPIC]);
    await trustedIssuersRegistry.write.addTrustedIssuer([
      issuerWallet.account.address,
      [CLAIM_TOPIC],
    ]);

    return {
      token,
      identityRegistry,
      identityRegistryStorage,
      claimTopicsRegistry,
      trustedIssuersRegistry,
      compliance,
      deployer,
      issuerWallet,
      aliceWallet,
      bobWallet,
      carolWallet,
      publicClient,
    };
  }

  // Info: (20260114 - User) 取得 Fixture 回傳型別，避免使用 any
  type FixtureType = Awaited<ReturnType<typeof deployTREXFixture>>;

  /**
   * Info: (20260114 - User) 輔助函式：為用戶建立鏈上身分 (Identity) 並通過 KYC
   */
  async function setupIdentity(userWallet: WalletClient, fixture: FixtureType) {
    const { identityRegistry, issuerWallet } = fixture;
    const userAddress = userWallet.account?.address;

    if (!userAddress) throw new Error('User wallet has no address');

    // 1. 部署用戶的 Identity 合約 (ERC-734/735)
    const identity = await viem.deployContract(CONTRACTS.Identity, [
      userAddress,
      false, // isCompany = false
    ]);

    // 2. 模擬 KYC: Issuer 簽署 Claim (此處簡化為直接操作)
    const claimData = toHex('KYC Verified');
    const claimSignature = toHex('mock_signature'); // 實際環境需 ECDSA 簽名

    // 3. 將 Claim 加入用戶的 Identity 合約
    await identity.write.addClaim([
      BigInt(CLAIM_TOPIC),
      BigInt(1), // Scheme: ECDSA
      issuerWallet.account.address,
      claimSignature,
      claimData,
      '', // URI
    ]);

    // 4. 在 IdentityRegistry 中註冊此 Identity
    await identityRegistry.write.registerIdentity([
      userAddress,
      identity.address,
      Number(COUNTRY_CODE_TW),
    ]);

    return identity;
  }

  // Info: (20260114 - User) --- Tests ---

  it('Should allow issuer to mint tokens to a verified user (Alice)', async function () {
    const fixture = await deployTREXFixture();
    const { token, aliceWallet } = fixture;

    // 1. Setup Alice's Identity
    await setupIdentity(aliceWallet, fixture);

    // 2. Mint Tokens
    const amount = parseEther('1000');
    const aliceAddress = aliceWallet.account.address;

    await token.write.mint([aliceAddress, amount]);

    // 3. Verify Balance
    const balance = await token.read.balanceOf([aliceAddress]);
    expect(balance).to.equal(amount);

    // 4. Verify Compliance State
    const isVerified = await token.read.isVerified([aliceAddress]);

    expect(isVerified).to.equal(true);
  });

  it('Should allow transfer between two verified users (Alice -> Bob)', async function () {
    const fixture = await deployTREXFixture();
    const { token, aliceWallet, bobWallet } = fixture;

    // 1. Setup Identities
    await setupIdentity(aliceWallet, fixture);
    await setupIdentity(bobWallet, fixture);

    // 2. Mint to Alice
    const aliceAddress = aliceWallet.account.address;
    const bobAddress = bobWallet.account.address;
    const mintAmount = parseEther('1000');
    await token.write.mint([aliceAddress, mintAmount]);

    // 3. Alice transfers to Bob
    const tokenAsAlice = await viem.getContractAt('Token', token.address, {
      client: { wallet: aliceWallet },
    });

    const transferAmount = parseEther('500');
    await tokenAsAlice.write.transfer([bobAddress, transferAmount]);

    // 4. Verify Balances
    const aliceBalance = await token.read.balanceOf([aliceAddress]);
    const bobBalance = await token.read.balanceOf([bobAddress]);

    expect(aliceBalance).to.equal(parseEther('500'));
    expect(bobBalance).to.equal(parseEther('500'));
  });

  it('Should revert when transferring to an unverified user (Alice -> Carol)', async function () {
    const fixture = await deployTREXFixture();
    const { token, aliceWallet, carolWallet } = fixture;

    // 1. Only Setup Alice (Carol is NOT verified)
    await setupIdentity(aliceWallet, fixture);

    // 2. Mint to Alice
    const aliceAddress = aliceWallet.account.address;
    const carolAddress = carolWallet.account.address;
    await token.write.mint([aliceAddress, parseEther('1000')]);

    // 3. Alice tries to transfer to Carol
    const tokenAsAlice = await viem.getContractAt('Token', token.address, {
      client: { wallet: aliceWallet },
    });

    // 4. Expect Revert
    // Info: (20260114 - User) ERC-3643 Revert string usually "Transfer not possible"
    let errorOccurred = false;
    try {
      await tokenAsAlice.write.transfer([carolAddress, parseEther('100')]);
    } catch (error: unknown) {
      errorOccurred = true;
      if (error instanceof Error) {
        expect(error.message).to.match(/Transfer not possible|reverted/);
      }
    }

    expect(errorOccurred).to.equal(true);
  });

  it('Should revert when unverified user tries to receive tokens via transferFrom', async function () {
    const fixture = await deployTREXFixture();
    const { token, aliceWallet, carolWallet, bobWallet } = fixture;

    // 1. Setup Alice (Owner) and Bob (Spender/Operator), Carol is Receiver (Unverified)
    await setupIdentity(aliceWallet, fixture);
    await setupIdentity(bobWallet, fixture);

    const aliceAddress = aliceWallet.account.address;
    const bobAddress = bobWallet.account.address;
    const carolAddress = carolWallet.account.address;

    // 2. Mint to Alice & Approve Bob
    await token.write.mint([aliceAddress, parseEther('1000')]);

    const tokenAsAlice = await viem.getContractAt('Token', token.address, {
      client: { wallet: aliceWallet },
    });
    await tokenAsAlice.write.approve([bobAddress, parseEther('1000')]);

    // 3. Bob tries to transferFrom Alice to Carol
    const tokenAsBob = await viem.getContractAt('Token', token.address, {
      client: { wallet: bobWallet },
    });

    let errorOccurred = false;
    try {
      await tokenAsBob.write.transferFrom([aliceAddress, carolAddress, parseEther('100')]);
    } catch (error: unknown) {
      errorOccurred = true;
      if (error instanceof Error) {
        expect(error.message).to.match(/Transfer not possible|reverted/);
      }
    }

    expect(errorOccurred).to.equal(true);
  });
});
