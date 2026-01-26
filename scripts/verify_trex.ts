import { createPublicClient, http, getContract, defineChain, getAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createRequire } from 'module';
import dotenv from 'dotenv';
import path from 'path';
import { publicClient } from '@/lib/viem-public';

// Force load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const require = createRequire(import.meta.url);

// --- 1. Load Artifacts ---
const TOKEN_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/token/Token.sol/Token.json');
const IR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistry.sol/IdentityRegistry.json');
const TIR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/TrustedIssuersRegistry.sol/TrustedIssuersRegistry.json');
const CTR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/ClaimTopicsRegistry.sol/ClaimTopicsRegistry.json');
const MC_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/compliance/modular/ModularCompliance.sol/ModularCompliance.json');

// --- 2. Configuration ---
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');
const PRIVATE_KEY = process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`;

// Contract Addresses
const ADDR_TOKEN = process.env.NEXT_PUBLIC_NTD_TOKEN_ADDRESS as `0x${string}`;
const ADDR_IR = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS as `0x${string}`;
const ADDR_TIR = process.env.NEXT_PUBLIC_TRUSTED_ISSUERS_REGISTRY_ADDRESS as `0x${string}`;
const ADDR_CTR = process.env.NEXT_PUBLIC_CLAIM_TOPICS_REGISTRY_ADDRESS as `0x${string}`;

const CLAIM_TOPIC = BigInt(101);

if (!PRIVATE_KEY) {
  console.error('❌ Missing ISUNCOIN_PRIVATE_KEY in .env');
  process.exit(1);
}

const account = privateKeyToAccount(PRIVATE_KEY);
console.log(`� Verifying as User: ${account.address}`);

const chain = defineChain({
  id: CHAIN_ID,
  name: 'iSunCoin',
  network: 'isuncoin',
  nativeCurrency: { decimals: 18, name: 'iSunCoin', symbol: 'ISC' },
  rpcUrls: { default: { http: [RPC_URL] }, public: { http: [RPC_URL] } },
});

const client = createPublicClient({ chain, transport: http() });

// --- 3. Helpers ---
function printResult(label: string, pass: boolean, info?: string) {
  if (pass) {
    console.log(`✅ ${label} ${info ? `(${info})` : ''}`);
  } else {
    console.log(`❌ ${label} ${info ? `(${info})` : ''}`);
  }
}

async function verify() {
  console.log('\n� Starting T-REX Configuration Verification...\n');

  try {
    // --- Verify Token ---
    const token = getContract({ address: ADDR_TOKEN, abi: TOKEN_ARTIFACT.abi, client });

    // Check Config: Token -> IdentityRegistry
    const irOnToken = await token.read.identityRegistry();
    const cleanIROnToken = (irOnToken as string).toLowerCase();
    printResult(
      'Token -> IdentityRegistry Link',
      cleanIROnToken === ADDR_IR.toLowerCase(),
      `Expected: ${ADDR_IR}, Got: ${irOnToken}`
    );

    // Check Paused
    const isPaused = await token.read.paused();
    printResult('Token Unpaused', isPaused === false, isPaused ? 'Paused' : 'Active');

    // Check Agent (Deployer)
    const isAgentToken = await token.read.isAgent([account.address]);
    printResult('Deployer is Token Agent', isAgentToken as boolean);

    // --- Verify Identity Registry ---
    const ir = getContract({ address: ADDR_IR, abi: IR_ARTIFACT.abi, client });

    // Check Config: IR -> TIR
    const tirOnIR = await ir.read.issuersRegistry();
    printResult(
      'IR -> TrustedIssuersRegistry Link',
      (tirOnIR as string).toLowerCase() === ADDR_TIR.toLowerCase()
    );

    // Check Config: IR -> CTR
    const ctrOnIR = await ir.read.topicsRegistry();
    printResult(
      'IR -> ClaimTopicsRegistry Link',
      (ctrOnIR as string).toLowerCase() === ADDR_CTR.toLowerCase()
    );

    // Check Config: IR -> Compliance (Implicitly bound via Token? No IR doesn't know compliance directly usually unless proxied or queried logic)
    // Actually IR interacts with Storage.
    // Let's check Agent on IR.
    const isAgentIR = await ir.read.isAgent([account.address]);
    printResult('Deployer is IdentityRegistry Agent', isAgentIR as boolean);

    // --- Verify Trusted Issuers Registry ---
    const tir = getContract({ address: ADDR_TIR, abi: TIR_ARTIFACT.abi, client });
    const isTrusted = await tir.read.isTrustedIssuer([account.address]);
    printResult('Deployer is Trusted Issuer', isTrusted as boolean);

    if (isTrusted) {
      const issuerTopics = await tir.read.getTrustedIssuerClaimTopics([account.address]);
      const hasTopic101 = (issuerTopics as bigint[]).some((t) => t === CLAIM_TOPIC);
      printResult('Deployer has Topic 101', hasTopic101);
    }

    // --- Verify Claim Topics Registry ---
    const ctr = getContract({ address: ADDR_CTR, abi: CTR_ARTIFACT.abi, client });
    const topics = await ctr.read.getClaimTopics();
    const topicExists = (topics as bigint[]).some((t) => t === CLAIM_TOPIC);
    printResult('Claim Topic 101 Exists', topicExists);

    // --- Verify Compliance ---
    // Get Compliance info from Token
    const complianceAddr = await token.read.compliance();
    console.log(`ℹ️  Compliance Contract: ${complianceAddr}`);

    if (complianceAddr && complianceAddr !== '0x0000000000000000000000000000000000000000') {
      const mc = getContract({
        address: complianceAddr as `0x${string}`,
        abi: MC_ARTIFACT.abi,
        client,
      });
      const boundToken = await mc.read.getTokenBound();
      printResult(
        'Compliance Bound to Token',
        (boundToken as string).toLowerCase() === ADDR_TOKEN.toLowerCase(),
        `Expected: ${ADDR_TOKEN}, Got: ${boundToken}`
      );
    } else {
      printResult('Compliance Contract Found', false);
    }

    const userAddress = '0x903752eFF817DCac83062760B50b9D50E3Ad022c';

    const identityContract = await publicClient.readContract({
      address: ADDR_IR,
      abi: IR_ARTIFACT.abi,
      functionName: 'identity',
      args: [getAddress(userAddress)],
    });
    console.log('用戶 Identity 合約地址:', identityContract);

    // 在 verify_trex.ts 中加入這段進行診斷
    try {
      const userAddress = '0x903752eFF817DCac83062760B50b9D50E3Ad022c';

      // 使用 simulateContract 捕捉詳細報錯
      await client.simulateContract({
        address: ADDR_IR,
        abi: IR_ARTIFACT.abi,
        functionName: 'isVerified',
        args: [getAddress(userAddress)],
      });

      console.log('✅ isVerified 模擬執行成功');
    } catch (error) {
      console.log('\n🔥 診斷資訊 - isVerified 為何 Revert:');
      // Viem 會在 error.shortMessage 中顯示合約拋出的具體錯誤名稱
      console.error((error as Error).message);
    }
  } catch (error) {
    console.error('\n❌ Verification Failed with Error:');
    console.error(error);
  }
}

verify();
