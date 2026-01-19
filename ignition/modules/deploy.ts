import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Info: (20260116 - Tzuhan) 載入所有必要的 ABI，包含 T-REX v4 權限與合規組件
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
  // Info: (20260116 - Tzuhan) 取得部署者帳戶與環境變數
  const deployer = m.getAccount(0);
  const entryPointAddress = process.env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS;
  const CLAIM_TOPIC = BigInt(101);

  // Info: (20260116 - Tzuhan) --- 1. 部署實作合約 (Implementations) ---
  const tokenImpl = m.contract('TokenImpl', TOKEN_ARTIFACT, []);
  const irImpl = m.contract('IRImpl', IR_ARTIFACT, []);
  const irsImpl = m.contract('IRSImpl', IRS_ARTIFACT, []);
  const tirImpl = m.contract('TIRImpl', TIR_ARTIFACT, []);
  const ctrImpl = m.contract('CTRImpl', CTR_ARTIFACT, []);
  const mcImpl = m.contract('MCImpl', MC_ARTIFACT, []);

  // Info: (20260119 - Tzuhan) --- 2. 部署並初始化基礎註冊表 (強制順序防止 Ownable 錯誤) ---
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

  // Info: (20260116 - Tzuhan) --- 3. 部署權限管理體系 (T-REX v4 Authority) ---
  const authorityLogic = m.contract('AuthorityLogic', AUTHORITY_ARTIFACT, [
    false,
    deployer,
    '0x0000000000000000000000000000000000000000',
  ]);

  const iaFactory = m.contract('IAFactory', IA_FACTORY_ARTIFACT, [authorityLogic]);

  const irAuthority = m.contract('IR_Authority', AUTHORITY_ARTIFACT, [true, deployer, iaFactory]);

  // Info: (20260119 - Tzuhan) 設定版本 (讓 Proxy 部署時 getImplementation 有回傳值)
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

  // Info: (20260116 - Tzuhan) --- 4. 部署 NTD 專屬 IdentityRegistry (修正依賴順序) ---
  const ntdIdentityRegistry = m.contract(
    'NTD_IdentityRegistry',
    IR_PROXY_ARTIFACT,
    [irAuthority, trustedIssuersRegistry, claimTopicsRegistry, identityRegistryStorage],
    { after: [initAuthority, addIssuer, initIRS] }
  );

  // Info: (20260119 - Tzuhan) --- 5. 部署 NTD 專屬合規合約 ---
  const ntdCompliance = m.contract('NTD_Compliance', MC_PROXY_ARTIFACT, [irAuthority], {
    id: 'NTD_Compliance',
  });

  const ntdMCAsImpl = m.contractAt('ModularCompliance', MC_ARTIFACT, ntdCompliance);
  const initMC = m.call(ntdMCAsImpl, 'init', [], { id: 'init_ntd_mc' });

  // Info: (20260119 - Tzuhan) --- 6. [修正] 部署 NTD 代幣 (第一參數改用 irAuthority) ---
  const ntdToken = m.contract(
    'NTD_Token',
    TOKEN_PROXY_ARTIFACT,
    [
      irAuthority,
      ntdIdentityRegistry,
      ntdCompliance, //  Info: (20260119 - Tzuhan) 使用剛部署的合規地址，而非 0x0
      'New Taiwan Dollar',
      'NTD',
      18,
      deployer,
    ],
    { after: [initMC, ntdIdentityRegistry] }
  );

  // Info: (20260116 - Tzuhan) --- 7. 設定 Agent (API 鑄幣權限) ---
  const ntdTokenAsImpl = m.contractAt('Token', TOKEN_ARTIFACT, ntdToken);
  m.call(ntdTokenAsImpl, 'addAgent', [deployer], { id: 'set_relayer_as_agent' });

  // Info: (20260116 - Tzuhan) --- 8. 部署 AA 與 Factory ---
  const entryPoint = entryPointAddress
    ? m.contractAt('EntryPointImportHelper', entryPointAddress)
    : m.contract('EntryPointImportHelper');

  const scwFactory = m.contract('SCWFactory', [entryPoint]);

  const companyAssetsFactory = m.contract('CompanyAssetsFactory', [
    trustedIssuersRegistry,
    claimTopicsRegistry,
    tokenImpl,
  ]);

  return {
    ntdToken,
    ntdIdentityRegistry,
    ntdCompliance,
    irAuthority,
    claimTopicsRegistry,
    trustedIssuersRegistry,
    identityRegistryStorage,
    scwFactory,
    companyAssetsFactory,
    entryPoint,
  };
});

export default ERC3643Module;
