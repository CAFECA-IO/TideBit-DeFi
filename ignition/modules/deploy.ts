import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const CTR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/ClaimTopicsRegistry.sol/ClaimTopicsRegistry.json');
const TIR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/TrustedIssuersRegistry.sol/TrustedIssuersRegistry.json');
const IRS_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistryStorage.sol/IdentityRegistryStorage.json');
const TOKEN_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/token/Token.sol/Token.json');

const ERC3643Module = buildModule('ERC3643Module', (m) => {
  const deployer = m.getAccount(0);
  const CLAIM_TOPIC = BigInt(101);

  // Info: (20260113 - Tzuhan) 1. ClaimTopicsRegistry
  const claimTopicsRegistry = m.contract('ClaimTopicsRegistry', CTR_ARTIFACT, [], {
    id: 'ClaimTopicsRegistry_Deployed',
  });
  m.call(claimTopicsRegistry, 'init', []);
  m.call(claimTopicsRegistry, 'addClaimTopic', [CLAIM_TOPIC], {
    id: 'add_claim_topic_kyc',
  });

  // Info: (20260113 - Tzuhan) 2. TrustedIssuersRegistry
  const trustedIssuersRegistry = m.contract('TrustedIssuersRegistry', TIR_ARTIFACT, [], {
    id: 'TrustedIssuersRegistry_Deployed',
  });
  m.call(trustedIssuersRegistry, 'init', []);
  m.call(trustedIssuersRegistry, 'addTrustedIssuer', [deployer, [CLAIM_TOPIC]], {
    id: 'add_trusted_issuer_deployer',
  });

  // Info: (20260113 - Tzuhan) 3. IdentityRegistryStorage
  const identityRegistryStorage = m.contract('IdentityRegistryStorage', IRS_ARTIFACT, [], {
    id: 'IdentityRegistryStorage_Deployed',
  });
  m.call(identityRegistryStorage, 'init', []);

  // Info: (20260113 - Tzuhan) 4. Token Implementation
  const tokenImpl = m.contract('Token', TOKEN_ARTIFACT, [], {
    id: 'Token_Implementation',
  });

  // Info: (20260113 - Tzuhan) 5. Factory
  const companyAssetsFactory = m.contract('CompanyAssetsFactory', [
    trustedIssuersRegistry,
    claimTopicsRegistry,
    tokenImpl,
  ]);

  // Info: (20260113 - Tzuhan) 6. 部署 EntryPoint
  const entryPoint = m.contract('EntryPointImportHelper');

  // Info: (20260113 - Tzuhan) 7. 部署 Factory
  const scwFactory = m.contract('SCWFactory', [entryPoint]);

  return {
    claimTopicsRegistry,
    trustedIssuersRegistry,
    identityRegistryStorage,
    tokenImpl,
    companyAssetsFactory,
    entryPoint,
    scwFactory,
  };
});

export default ERC3643Module;
