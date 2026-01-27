import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const TOKEN_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/token/Token.sol/Token.json');
const IR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistry.sol/IdentityRegistry.json');
const IRS_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/IdentityRegistryStorage.sol/IdentityRegistryStorage.json');
const TIR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/TrustedIssuersRegistry.sol/TrustedIssuersRegistry.json');
const CTR_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/registry/implementation/ClaimTopicsRegistry.sol/ClaimTopicsRegistry.json');
const MC_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/compliance/modular/ModularCompliance.sol/ModularCompliance.json');
const IDENTITY_ARTIFACT = require('@erc3643org/erc-3643/artifacts/@onchain-id/solidity/contracts/Identity.sol/Identity.json');

const ERC3643Module = buildModule('ERC3643Module', (m) => {
  const deployer = m.getAccount(0);

  // =========================================================
  // 1. Deploy Registries
  // =========================================================

  // A. Claim Topics Registry
  const claimTopicsRegistry = m.contract('ClaimTopicsRegistry', CTR_ARTIFACT, []);
  const initCTR = m.call(claimTopicsRegistry, 'init', [], { id: 'init_ctr' });

  // B. Trusted Issuers Registry
  const trustedIssuersRegistry = m.contract('TrustedIssuersRegistry', TIR_ARTIFACT, []);
  const initTIR = m.call(trustedIssuersRegistry, 'init', [], { id: 'init_tir' });

  // C. Identity Registry Storage
  const identityRegistryStorage = m.contract('IdentityRegistryStorage', IRS_ARTIFACT, []);
  const initIRS = m.call(identityRegistryStorage, 'init', [], { id: 'init_irs' });

  // =========================================================
  // 2. Deploy Identity Registry
  // =========================================================
  const identityRegistry = m.contract('IdentityRegistry', IR_ARTIFACT, []);

  // Initialize IdentityRegistry with links to other registries
  const initIR = m.call(identityRegistry, 'init', [
    trustedIssuersRegistry,
    claimTopicsRegistry,
    identityRegistryStorage
  ], {
    id: 'init_ir',
    after: [initTIR, initCTR, initIRS]
  });

  // =========================================================
  // 3. Deploy Modular Compliance
  // =========================================================
  const modularCompliance = m.contract('ModularCompliance', MC_ARTIFACT, []);
  const initMC = m.call(modularCompliance, 'init', [], { id: 'init_mc' });

  // =========================================================
  // 4. Deploy Issuer Identity (Required for Token)
  // =========================================================
  const issuerIdentity = m.contract('IssuerIdentity', IDENTITY_ARTIFACT, [deployer, false]);

  // =========================================================
  // 5. Deploy Token
  // =========================================================
  const token = m.contract('Token', TOKEN_ARTIFACT, []);

  // Initialize Token
  const initToken = m.call(token, 'init', [
    identityRegistry,
    modularCompliance,
    'New Taiwan Dollar',
    'NTD',
    18,
    issuerIdentity
  ], {
    id: 'init_token',
    after: [initIR, initMC, issuerIdentity]
  });

  // =========================================================
  // 6. Setup Bindings & Agents
  // =========================================================

  // A. Bind Storage -> Registry
  m.call(identityRegistryStorage, 'bindIdentityRegistry', [identityRegistry], {
    id: 'bind_irs_to_ir',
    after: [initIRS, identityRegistry]
  });



  // C. Add Deployer as Token Agent (to allow minting)
  m.call(token, 'addAgent', [deployer], {
    id: 'add_token_agent',
    after: [initToken]
  });

  // D. Add Deployer as Identity Registry Agent (to allow registering identities)
  m.call(identityRegistry, 'addAgent', [deployer], {
    id: 'add_ir_agent',
    after: [initIR]
  });

  // =========================================================
  // 7. AA Components (SCW Factory) - Keeping existing logic
  // =========================================================
  const entryPointAddress = process.env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS;

  const entryPoint = entryPointAddress
    ? m.contractAt('EntryPointImportHelper', entryPointAddress, { id: 'EntryPoint_At_Address' })
    : m.contract('EntryPointImportHelper', [], { id: 'EntryPoint_Deployed' });

  const scwFactory = m.contract('SCWFactory', [entryPoint]);

  // Return connected instances
  return {
    token,
    identityRegistry,
    compliance: modularCompliance,
    identityRegistryStorage,
    claimTopicsRegistry,
    trustedIssuersRegistry,
    issuerIdentity,
    scwFactory
  };
});

export default ERC3643Module;
