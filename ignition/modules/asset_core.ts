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

const AssetCoreModule = buildModule('AssetCoreModule', (m) => {
    const deployer = m.getAccount(0);

    // Info: (20260127 - Tzuhan) 1. Deploy Registries
    // Info: (20260127 - Tzuhan) A. Claim Topics Registry
    const claimTopicsRegistry = m.contract('ClaimTopicsRegistry', CTR_ARTIFACT, []);
    const initCTR = m.call(claimTopicsRegistry, 'init', [], { id: 'init_ctr' });

    // Info: (20260127 - Tzuhan) B. Trusted Issuers Registry
    const trustedIssuersRegistry = m.contract('TrustedIssuersRegistry', TIR_ARTIFACT, []);
    const initTIR = m.call(trustedIssuersRegistry, 'init', [], { id: 'init_tir' });

    // Info: (20260127 - Tzuhan) C. Identity Registry Storage
    const identityRegistryStorage = m.contract('IdentityRegistryStorage', IRS_ARTIFACT, []);
    const initIRS = m.call(identityRegistryStorage, 'init', [], { id: 'init_irs' });

    // Info: (20260127 - Tzuhan) 2. Deploy Identity Registry
    const identityRegistry = m.contract('IdentityRegistry', IR_ARTIFACT, []);

    // Info: (20260127 - Tzuhan) Initialize IdentityRegistry with links to other registries
    const initIR = m.call(identityRegistry, 'init', [
        trustedIssuersRegistry,
        claimTopicsRegistry,
        identityRegistryStorage
    ], {
        id: 'init_ir',
        after: [initTIR, initCTR, initIRS]
    });

    // Info: (20260127 - Tzuhan) 3. Deploy Modular Compliance
    const modularCompliance = m.contract('ModularCompliance', MC_ARTIFACT, []);
    const initMC = m.call(modularCompliance, 'init', [], { id: 'init_mc' });

    // Info: (20260127 - Tzuhan) 4. Deploy Issuer Identity (Required for Token)
    const issuerIdentity = m.contract('IssuerIdentity', IDENTITY_ARTIFACT, [deployer, false]);

    // Info: (20260127 - Tzuhan) 5. Deploy Token
    const token = m.contract('Token', TOKEN_ARTIFACT, []);

    // Info: (20260127 - Tzuhan) Initialize Token
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

    // Info: (20260127 - Tzuhan) 6. Setup Bindings & Agents
    // Info: (20260127 - Tzuhan) A. Bind Storage -> Registry
    m.call(identityRegistryStorage, 'bindIdentityRegistry', [identityRegistry], {
        id: 'bind_irs_to_ir',
        after: [initIRS, identityRegistry]
    });

    // Info: (20260127 - Tzuhan) C. Add Deployer as Token Agent (to allow minting)
    m.call(token, 'addAgent', [deployer], {
        id: 'add_token_agent',
        after: [initToken]
    });

    // Info: (20260127 - Tzuhan) D. Add Deployer as Identity Registry Agent (to allow registering identities)
    m.call(identityRegistry, 'addAgent', [deployer], {
        id: 'add_ir_agent',
        after: [initIR]
    });

    return {
        token,
        identityRegistry,
        compliance: modularCompliance,
        identityRegistryStorage,
        claimTopicsRegistry,
        trustedIssuersRegistry,
        issuerIdentity
    };
});

export default AssetCoreModule;
