import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Info: (20260124 - Tzuhan) Info: (20260124 - Tzuhan) 引入 ERC-3643 標準合約 Artifacts
const CTR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/ClaimTopicsRegistry.sol/ClaimTopicsRegistry.json');
const TIR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/TrustedIssuersRegistry.sol/TrustedIssuersRegistry.json');
const IRS_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistryStorage.sol/IdentityRegistryStorage.json');
const IR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistry.sol/IdentityRegistry.json');
const TOKEN_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/token/Token.sol/Token.json');
const TOKEN_PROXY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/TokenProxy.sol/TokenProxy.json');
const IR_PROXY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/IdentityRegistryProxy.sol/IdentityRegistryProxy.json');
const AUTHORITY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/authority/TREXImplementationAuthority.sol/TREXImplementationAuthority.json');
const IA_FACTORY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/authority/IAFactory.sol/IAFactory.json');
const MC_PROXY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/ModularComplianceProxy.sol/ModularComplianceProxy.json');
const MC_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/compliance/modular/ModularCompliance.sol/ModularCompliance.json');

const ERC3643Module = buildModule('ERC3643Module', (m) => {
  const deployer = m.getAccount(0);
  const CLAIM_TOPIC = BigInt(101); // Info: (20260124 - Tzuhan) 定義 KYC 的 Topic ID

  // =========================================================
  // Info: (20260124 - Tzuhan) 1. 部署邏輯合約 (Implementations)
  // =========================================================
  const tokenImpl = m.contract('TokenImpl', TOKEN_ARTIFACT, []);
  const irImpl = m.contract('IRImpl', IR_ARTIFACT, []);
  const irsImpl = m.contract('IRSImpl', IRS_ARTIFACT, []);
  const tirImpl = m.contract('TIRImpl', TIR_ARTIFACT, []);
  const ctrImpl = m.contract('CTRImpl', CTR_ARTIFACT, []);
  const mcImpl = m.contract('ModularCompliance', MC_ARTIFACT, []);

  // =========================================================
  // Info: (20260124 - Tzuhan) 2. 初始化基礎註冊表 (Registries)
  // =========================================================

  // Info: (20260124 - Tzuhan) A. Claim Topics Registry (定義有哪些 Topic 存在)
  const claimTopicsRegistry = m.contract('ClaimTopicsRegistry', CTR_ARTIFACT, []);
  const initCTR = m.call(claimTopicsRegistry, 'init', [], { id: 'init_ctr' });
  const addTopic = m.call(claimTopicsRegistry, 'addClaimTopic', [CLAIM_TOPIC], {
    id: 'add_topic_101',
    after: [initCTR],
  });

  // Info: (20260124 - Tzuhan) B. Trusted Issuers Registry (定義誰可以發憑證)
  const trustedIssuersRegistry = m.contract('TrustedIssuersRegistry', TIR_ARTIFACT, []);
  const initTIR = m.call(trustedIssuersRegistry, 'init', [], { id: 'init_tir' });
  const addIssuer = m.call(trustedIssuersRegistry, 'addTrustedIssuer', [deployer, [CLAIM_TOPIC]], {
    id: 'add_issuer_101',
    after: [initTIR, addTopic],
  });

  // Info: (20260124 - Tzuhan) C. Identity Registry Storage (儲存身分資料)
  const identityRegistryStorage = m.contract('IdentityRegistryStorage', IRS_ARTIFACT, []);
  const initIRS = m.call(identityRegistryStorage, 'init', [], { id: 'init_irs' });

  // =========================================================
  // Info: (20260124 - Tzuhan) 3. 權限中心 (TREX Authority)
  // =========================================================
  const authorityLogic = m.contract('AuthorityLogic', AUTHORITY_ARTIFACT, [
    false,
    deployer,
    '0x0000000000000000000000000000000000000000',
  ]);
  const iaFactory = m.contract('IAFactory', IA_FACTORY_ARTIFACT, [authorityLogic]);
  const irAuthority = m.contract('IR_Authority', AUTHORITY_ARTIFACT, [true, deployer, iaFactory]);

  const initAuthority = m.call(
    irAuthority,
    'addAndUseTREXVersion',
    [
      { major: 1, minor: 0, patch: 0 },
      {
        tokenImplementation: tokenImpl,
        ctrImplementation: ctrImpl,
        irImplementation: irImpl,
        irsImplementation: irsImpl,
        tirImplementation: tirImpl,
        mcImplementation: mcImpl,
      },
    ],
    { id: 'init_authority_version' }
  );

  // =========================================================
  // Info: (20260124 - Tzuhan) 4. 代理合約與合規 (Proxies & Compliance)
  // =========================================================

  // Info: (20260124 - Tzuhan) A. Identity Registry Proxy
  const ntdIdentityRegistry = m.contract(
    'NTD_IdentityRegistry',
    IR_PROXY_ARTIFACT,
    [irAuthority, trustedIssuersRegistry, claimTopicsRegistry, identityRegistryStorage],
    { after: [initAuthority, addIssuer, initIRS] }
  );

  // Info: (20260124 - Tzuhan) B. Compliance Proxy (使用 ModularCompliance)
  const ntdCompliance = m.contract('ModularComplianceProxy', MC_PROXY_ARTIFACT, [irAuthority], {
    id: 'ntd_compliance_proxy',
    after: [initAuthority],
  });

  // Info: (20260124 - Tzuhan) C. Token Proxy
  const ntdToken = m.contract(
    'NTD_Token',
    TOKEN_PROXY_ARTIFACT,
    [irAuthority, ntdIdentityRegistry, ntdCompliance, 'New Taiwan Dollar', 'NTD', 18, deployer],
    { after: [ntdCompliance, ntdIdentityRegistry] }
  );

  // Info: (20260124 - Tzuhan) [關鍵步驟] 綁定 Token 與 Compliance
  const ntdComplianceAsImpl = m.contractAt('ModularCompliance', MC_ARTIFACT, ntdCompliance, {
    id: 'Compliance_For_Bind',
  });

  const bindTokenStep = m.call(ntdComplianceAsImpl, 'bindToken', [ntdToken], {
    id: 'bind_token_to_compliance',
    after: [ntdToken],
  });

  // =========================================================
  // Info: (20260124 - Tzuhan) 5. 建立全鏈上 Agent 信任鏈
  // =========================================================

  // Info: (20260124 - Tzuhan) 為了呼叫 addAgent，我們需要用 Implementation 的介面
  const ntdIdentityRegistryAsImpl = m.contractAt(
    'IdentityRegistry',
    IR_ARTIFACT,
    ntdIdentityRegistry,
    {
      id: 'IR_For_Agent', // Info: (20260124 - Tzuhan) ID 改一下避免重複
    }
  );

  // Info: (20260124 - Tzuhan) A. Relayer -> Token Agent (用於 Mint)
  const addTokenAgent = m.call(
    m.contractAt('Token', TOKEN_ARTIFACT, ntdToken, { id: 'Token_As_Agent' }),
    'addAgent',
    [deployer],
    { id: 'set_relayer_token_agent', after: [ntdToken] }
  );

  // Info: (20260124 - Tzuhan) B. Relayer -> Registry Agent (用於 API 幫用戶註冊)
  m.call(ntdIdentityRegistryAsImpl, 'addAgent', [deployer], {
    id: 'set_relayer_registry_agent',
    after: [ntdIdentityRegistry],
  });

  // Info: (20260124 - Tzuhan) C. Registry -> Storage Agent (讓 Registry 有權寫入 Storage)
  m.call(
    m.contractAt('IdentityRegistryStorage', IRS_ARTIFACT, identityRegistryStorage, {
      id: 'IRS_For_Binding',
    }),
    'bindIdentityRegistry',
    [ntdIdentityRegistry],
    { id: 'bind_registry_to_storage', after: [ntdIdentityRegistry] }
  );

  // =========================================================
  // Info: (20260124 - Tzuhan) 6. 自動解除 Token 暫停狀態 (Unpause)
  // =========================================================
  const ntdTokenAsImpl = m.contractAt('Token', TOKEN_ARTIFACT, ntdToken, {
    id: 'Token_Cast_For_Unpause',
  });

  m.call(ntdTokenAsImpl, 'unpause', [], {
    id: 'unpause_token_after_deploy',
    after: [addTokenAgent, bindTokenStep], // Info: (20260124 - Tzuhan) 確保權限和綁定都完成後再 Unpause
  });

  // =========================================================
  // Info: (20260124 - Tzuhan) 7. AA 組件 (SCW Factory)
  // =========================================================
  const entryPointAddress = process.env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS;

  const entryPoint = entryPointAddress
    ? m.contractAt('EntryPointImportHelper', entryPointAddress, { id: 'EntryPoint_At_Address' })
    : m.contract('EntryPointImportHelper', [], { id: 'EntryPoint_Deployed' });

  const scwFactory = m.contract('SCWFactory', [entryPoint]);

  return {
    ntdToken,
    ntdIdentityRegistry,
    irAuthority,
    identityRegistryStorage,
    scwFactory,
    ntdCompliance,
  };
});

export default ERC3643Module;
