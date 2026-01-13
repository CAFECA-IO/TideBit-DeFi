import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// 1. 載入所有需要的 Artifacts (包含 Token)
const CTR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/ClaimTopicsRegistry.sol/ClaimTopicsRegistry.json');
const TIR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/TrustedIssuersRegistry.sol/TrustedIssuersRegistry.json');
const IRS_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistryStorage.sol/IdentityRegistryStorage.json');
const TOKEN_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/token/Token.sol/Token.json');
const EP_ARTIFACT = require('../../artifacts/@account-abstraction/contracts/core/EntryPoint.sol/EntryPoint.json');

const DeployAllModule = buildModule('DeployAllModule', (m) => {
  // =================================================================
  // 1. 參數設定 (Parameters)
  // =================================================================
  const deployer = m.getAccount(0);
  const CLAIM_TOPIC = BigInt(101); // KYC Topic ID

  const entryPoint = m.contract('EntryPoint', EP_ARTIFACT, [], {
    id: 'EntryPoint_Deployed',
  });

  const claimTopicsRegistry = m.contract('ClaimTopicsRegistry', CTR_ARTIFACT, [], {
    id: 'ClaimTopicsRegistry_Deployed', // 給予明確 ID 避免衝突
  });

  m.call(claimTopicsRegistry, 'init', []);
  m.call(claimTopicsRegistry, 'addClaimTopic', [CLAIM_TOPIC], {
    id: 'add_claim_topic_kyc',
  });

  // ----------------------------------------------------------------
  // 3. 部署 TrustedIssuersRegistry (TIR)
  // ----------------------------------------------------------------
  const trustedIssuersRegistry = m.contract('TrustedIssuersRegistry', TIR_ARTIFACT, [], {
    id: 'TrustedIssuersRegistry_Deployed',
  });

  m.call(trustedIssuersRegistry, 'init', []);

  m.call(trustedIssuersRegistry, 'addTrustedIssuer', [deployer, [CLAIM_TOPIC]], {
    id: 'add_trusted_issuer_deployer',
  });

  // ----------------------------------------------------------------
  // 4. 部署 IdentityRegistryStorage (IRS)
  // ----------------------------------------------------------------
  const identityRegistryStorage = m.contract('IdentityRegistryStorage', IRS_ARTIFACT, [], {
    id: 'IdentityRegistryStorage_Deployed',
  });

  m.call(identityRegistryStorage, 'init', []);

  // ----------------------------------------------------------------
  // 5. 部署 Token Implementation (給 Factory 使用)
  // ----------------------------------------------------------------
  // [Fix] 使用 artifact 選項部署 Token，確保使用官方標準實作
  const tokenImpl = m.contract('Token', TOKEN_ARTIFACT, [], {
    id: 'Token_Implementation',
  });

  // =================================================================
  // 3. Factory 部署 (ERC-4337)
  // =================================================================

  // 部署 SCWFactory，傳入 EntryPoint 地址
  const scwFactory = m.contract('SCWFactory', [entryPoint]);

  // =================================================================
  // 4. Asset Factory 部署 (ERC-3643 資產工廠)
  // =================================================================
  const companyAssetsFactory = m.contract('CompanyAssetsFactory', [
    trustedIssuersRegistry,
    claimTopicsRegistry,
    tokenImpl,
  ]);

  // =================================================================
  // 5. 回傳所有關鍵合約 (Artifacts)
  // =================================================================
  return {
    claimTopicsRegistry,
    trustedIssuersRegistry,
    identityRegistryStorage,
    tokenImpl,
    scwFactory,
    companyAssetsFactory,
  };
});

export default DeployAllModule;
