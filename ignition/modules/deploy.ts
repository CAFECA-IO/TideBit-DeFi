import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const CTR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/ClaimTopicsRegistry.sol/ClaimTopicsRegistry.json');
const TIR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/TrustedIssuersRegistry.sol/TrustedIssuersRegistry.json');
const IRS_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistryStorage.sol/IdentityRegistryStorage.json');
const IR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistry.sol/IdentityRegistry.json');
const TOKEN_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/token/Token.sol/Token.json');
const TOKEN_PROXY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/TokenProxy.sol/TokenProxy.json');
const IR_PROXY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/IdentityRegistryProxy.sol/IdentityRegistryProxy.json');
const AUTHORITY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/authority/TREXImplementationAuthority.sol/TREXImplementationAuthority.json');
const IA_FACTORY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/authority/IAFactory.sol/IAFactory.json');
const MC_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/compliance/modular/ModularCompliance.sol/ModularCompliance.json');
const MC_PROXY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/ModularComplianceProxy.sol/ModularComplianceProxy.json');

const ERC3643Module = buildModule('ERC3643Module', (m) => {
  const deployer = m.getAccount(0);
  const CLAIM_TOPIC = BigInt(101);

  // 1. 部署實作
  const tokenImpl = m.contract('TokenImpl', TOKEN_ARTIFACT, []);
  const irImpl = m.contract('IRImpl', IR_ARTIFACT, []);
  const irsImpl = m.contract('IRSImpl', IRS_ARTIFACT, []);
  const tirImpl = m.contract('TIRImpl', TIR_ARTIFACT, []);
  const ctrImpl = m.contract('CTRImpl', CTR_ARTIFACT, []);
  const mcImpl = m.contract('MCImpl', MC_ARTIFACT, []);

  // 2. 初始化基礎註冊表
  const claimTopicsRegistry = m.contract('ClaimTopicsRegistry', CTR_ARTIFACT, []);
  const initCTR = m.call(claimTopicsRegistry, 'init', [], { id: 'init_ctr' });
  const addTopic = m.call(claimTopicsRegistry, 'addClaimTopic', [CLAIM_TOPIC], {
    id: 'add_topic_101',
    after: [initCTR],
  });

  const trustedIssuersRegistry = m.contract('TrustedIssuersRegistry', TIR_ARTIFACT, []);
  const initTIR = m.call(trustedIssuersRegistry, 'init', [], { id: 'init_tir' });
  const addIssuer = m.call(trustedIssuersRegistry, 'addTrustedIssuer', [deployer, [CLAIM_TOPIC]], {
    id: 'add_issuer_101',
    after: [initTIR, addTopic],
  });

  const identityRegistryStorage = m.contract('IdentityRegistryStorage', IRS_ARTIFACT, []);
  const initIRS = m.call(identityRegistryStorage, 'init', [], { id: 'init_irs' });

  // 3. 權限中心
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

  // 4. 代理合約與合規
  const ntdIdentityRegistry = m.contract(
    'NTD_IdentityRegistry',
    IR_PROXY_ARTIFACT,
    [irAuthority, trustedIssuersRegistry, claimTopicsRegistry, identityRegistryStorage],
    { after: [initAuthority, addIssuer, initIRS] }
  );
  const ntdCompliance = m.contract('NTD_Compliance', MC_PROXY_ARTIFACT, [irAuthority], {
    id: 'NTD_Compliance',
  });
  const initMC = m.call(
    m.contractAt('ModularCompliance', MC_ARTIFACT, ntdCompliance, { id: 'MC_Instance' }),
    'init',
    [],
    { id: 'init_ntd_mc' }
  );

  const ntdToken = m.contract(
    'NTD_Token',
    TOKEN_PROXY_ARTIFACT,
    [irAuthority, ntdIdentityRegistry, ntdCompliance, 'New Taiwan Dollar', 'NTD', 18, deployer],
    { after: [initMC, ntdIdentityRegistry] }
  );

  // 5. Info: (20260119 - Tzuhan) --- [核心修正] 建立全鏈上 Agent 信任鏈 ---

  // A. Relayer -> Token Agent (用於 Mint)
  // Info: (20260121 - Tzuhan) 將這個操作存為變數，以便後面的 unpause 依賴它
  const addTokenAgent = m.call(
    m.contractAt('Token', TOKEN_ARTIFACT, ntdToken, { id: 'Token_As_Agent' }),
    'addAgent',
    [deployer],
    { id: 'set_relayer_token_agent' }
  );

  // Info: (20260121 - Tzuhan) B. Relayer -> Registry Agent (用於 API 核准)
  m.call(
    m.contractAt('IdentityRegistry', IR_ARTIFACT, ntdIdentityRegistry, { id: 'IR_As_Agent' }),
    'addAgent',
    [deployer],
    { id: 'set_relayer_registry_agent' }
  );

  // Info: (20260121 - Tzuhan)C. [關鍵] Registry -> Storage Agent (讓 Registry 有權寫入 Storage) 使用 bindIdentityRegistry，它會自動將 Registry 加為 Agent
  m.call(
    m.contractAt('IdentityRegistryStorage', IRS_ARTIFACT, identityRegistryStorage, {
      id: 'IRS_For_Binding',
    }),
    'bindIdentityRegistry',
    [ntdIdentityRegistry],
    { id: 'bind_registry_to_storage' }
  );

  // 6. [ Info: (20260121 - Tzuhan) --- 自動解除 Token 暫停狀態 (Unpause) --- ]
  const ntdTokenAsImpl = m.contractAt('Token', TOKEN_ARTIFACT, ntdToken, {
    id: 'Token_Cast_For_Unpause',
  });

  m.call(ntdTokenAsImpl, 'unpause', [], {
    id: 'unpause_token_after_deploy',
    after: [ntdToken, addTokenAgent],
  });

  // Info: (20260121 - Tzuhan) 7. AA 組件
  const scwFactory = m.contract('SCWFactory', [
    m.contractAt('EntryPointImportHelper', '0x1e51E13D511016aB69C0F58c4282784eA5401Cf6', {
      id: 'EP',
    }),
  ]);

  return { ntdToken, ntdIdentityRegistry, irAuthority, identityRegistryStorage, scwFactory };
});

export default ERC3643Module;
