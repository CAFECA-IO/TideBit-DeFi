import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Info: (20260115 - Tzuhan) 載入所有必要的 ABI
const CTR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/ClaimTopicsRegistry.sol/ClaimTopicsRegistry.json');
const TIR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/TrustedIssuersRegistry.sol/TrustedIssuersRegistry.json');
const IRS_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistryStorage.sol/IdentityRegistryStorage.json');
const IR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistry.sol/IdentityRegistry.json');
const TOKEN_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/token/Token.sol/Token.json');
const TOKEN_PROXY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/TokenProxy.sol/TokenProxy.json');
const IR_PROXY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/proxy/IdentityRegistryProxy.sol/IdentityRegistryProxy.json');

const ERC3643Module = buildModule('ERC3643Module', (m) => {
  const deployer = m.getAccount(0);
  const CLAIM_TOPIC = BigInt(101);

  // Info: (20260115 - Tzuhan) --- 1. 部署基礎註冊表 (Registries) ---
  const claimTopicsRegistry = m.contract('ClaimTopicsRegistry', CTR_ARTIFACT, [], {
    id: 'ClaimTopicsRegistry_Deployed',
  });
  m.call(claimTopicsRegistry, 'init', []);
  m.call(claimTopicsRegistry, 'addClaimTopic', [CLAIM_TOPIC], { id: 'add_claim_topic_kyc' });

  const trustedIssuersRegistry = m.contract('TrustedIssuersRegistry', TIR_ARTIFACT, [], {
    id: 'TrustedIssuersRegistry_Deployed',
  });
  m.call(trustedIssuersRegistry, 'init', []);
  m.call(trustedIssuersRegistry, 'addTrustedIssuer', [deployer, [CLAIM_TOPIC]], {
    id: 'add_trusted_issuer_deployer',
  });

  const identityRegistryStorage = m.contract('IdentityRegistryStorage', IRS_ARTIFACT, [], {
    id: 'IdentityRegistryStorage_Deployed',
  });
  m.call(identityRegistryStorage, 'init', []);

  // Info: (20260115 - Tzuhan) --- 2. 部署代幣實作合規組件 ---
  const tokenImpl = m.contract('Token', TOKEN_ARTIFACT, [], { id: 'Token_Implementation' });
  const irImpl = m.contract('IdentityRegistry', IR_ARTIFACT, [], { id: 'IR_Implementation' });

  // Info: (20260115 - Tzuhan) --- 3. [新增] 部署 NTD 專屬的 IdentityRegistry ---
  // Info: (20260115 - Tzuhan) 先部署 Proxy，再初始化
  const ntdIdentityRegistry = m.contract(
    'IdentityRegistryProxy',
    IR_PROXY_ARTIFACT,
    [
      irImpl, // Info: (20260115 - Tzuhan) 實作合約
    ],
    { id: 'NTD_IdentityRegistry' }
  );

  m.call(
    ntdIdentityRegistry,
    'init',
    [trustedIssuersRegistry, claimTopicsRegistry, identityRegistryStorage],
    { id: 'init_ntd_ir' }
  );

  // Info: (20260115 - Tzuhan) --- 4. [新增] 部署 NTD 代幣 (作為受控的 ERC-3643) ---
  // Info: (20260115 - Tzuhan) 設定 NTD 參數：名稱 "New Taiwan Dollar", 代號 "NTD", 精度 18, ONCHAINID 為部署者
  const ntdToken = m.contract(
    'TokenProxy',
    TOKEN_PROXY_ARTIFACT,
    [
      tokenImpl, // Info: (20260115 - Tzuhan) 實作合約
      ntdIdentityRegistry, // Info: (20260115 - Tzuhan) 關聯剛部署的 IR
      '0x0000000000000000000000000000000000000000', // Info: (20260115 - Tzuhan) Compliance (暫無特定規則)
      'New Taiwan Dollar',
      'NTD',
      18,
      deployer, // Info: (20260115 - Tzuhan) ONCHAINID
    ],
    { id: 'NTD_Token' }
  );

  // Info: (20260115 - Tzuhan) --- 5. [核心] 將 Relayer 設為 Agent ---
  // Info: (20260115 - Tzuhan) 這樣 API 才能透過 Relayer 的私鑰對用戶進行 Mint 操作
  m.call(ntdToken, 'addAgent', [deployer], { id: 'set_relayer_as_agent' });

  // Info: (20260115 - Tzuhan) --- 6. 部署 Factory 與 ERC-4337 組件 ---
  const companyAssetsFactory = m.contract('CompanyAssetsFactory', [
    trustedIssuersRegistry,
    claimTopicsRegistry,
    tokenImpl,
  ]);

  const entryPointAddress = process.env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS;

  const entryPoint = entryPointAddress
    ? m.contractAt('EntryPoint', entryPointAddress) // Info: (20260115 - Tzuhan) 優先使用現有地址
    : m.contract('EntryPointImportHelper');
  const scwFactory = m.contract('SCWFactory', [entryPoint]);

  return {
    claimTopicsRegistry,
    trustedIssuersRegistry,
    identityRegistryStorage,
    ntdToken,
    ntdIdentityRegistry,
    companyAssetsFactory,
    entryPoint,
    scwFactory,
  };
});

export default ERC3643Module;
