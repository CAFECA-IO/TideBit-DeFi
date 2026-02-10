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

    // =========================================================
    // Info: (20260210 - Tzuhan) 1. Deploy Registries
    // =========================================================

    // Info: (20260210 - Tzuhan) A. Claim Topics Registry
    const claimTopicsRegistry = m.contract('ClaimTopicsRegistry', CTR_ARTIFACT, []);
    const initCTR = m.call(claimTopicsRegistry, 'init', [], { id: 'init_ctr' });

    // Info: (20260210 - Tzuhan) B. Trusted Issuers Registry
    const trustedIssuersRegistry = m.contract('TrustedIssuersRegistry', TIR_ARTIFACT, []);
    const initTIR = m.call(trustedIssuersRegistry, 'init', [], { id: 'init_tir' });

    // Info: (20260210 - Tzuhan) C. Identity Registry Storage
    const identityRegistryStorage = m.contract('IdentityRegistryStorage', IRS_ARTIFACT, []);
    const initIRS = m.call(identityRegistryStorage, 'init', [], { id: 'init_irs' });

    // =========================================================
    // Info: (20260210 - Tzuhan) 2. Deploy Identity Registry
    // =========================================================
    const identityRegistry = m.contract('IdentityRegistry', IR_ARTIFACT, []);

    // Info: (20260210 - Tzuhan) Initialize IdentityRegistry with links to other registries
    const initIR = m.call(identityRegistry, 'init', [
        trustedIssuersRegistry,
        claimTopicsRegistry,
        identityRegistryStorage
    ], {
        id: 'init_ir',
        after: [initTIR, initCTR, initIRS]
    });

    // =========================================================
    // Info: (20260210 - Tzuhan) 3. Deploy Modular Compliance
    // =========================================================
    const complianceNTD = m.contract('ModularCompliance', MC_ARTIFACT, [], { id: 'Compliance_NTD' });
    const initMCNTD = m.call(complianceNTD, 'init', [], { id: 'initMCNTD' });
    // =========================================================
    // Info: (20260210 - Tzuhan) 4. Deploy Issuer Identity (Required for Token)
    // =========================================================
    const issuerIdentity = m.contract('IssuerIdentity', IDENTITY_ARTIFACT, [deployer, false]);

    // =========================================================
    // Info: (20260210 - Tzuhan) 5. Deploy Asset Token (NTD)
    // =========================================================
    const token = m.contract('Token', TOKEN_ARTIFACT, [], { id: 'Token_NTD' }); // Info: (20260210 - Tzuhan) 加入 ID 區分

    // Info: (20260210 - Tzuhan) Initialize NTD Token
    const initToken = m.call(token, 'init', [
        identityRegistry,
        complianceNTD,
        'New Taiwan Dollar',
        'NTD',
        18,
        issuerIdentity
    ], {
        id: 'init_token',
        after: [initIR, initMCNTD, issuerIdentity]
    });

    // =========================================================
    // Info: (20260210 - Tzuhan) 5.5 Deploy Debit Token (Liability)
    // =========================================================
    const complianceDebit = m.contract('ModularCompliance', MC_ARTIFACT, [], { id: 'Compliance_Debit' });
    const initMCDebit = m.call(complianceDebit, 'init', [], { id: 'initMCDebit' });
    // Info: (20260210 - Tzuhan) 注意：這裡使用相同的 TOKEN_ARTIFACT，但部署為不同的實例
    const debitToken = m.contract('Token', TOKEN_ARTIFACT, [], { id: 'Token_DEBT' });

    // Info: (20260210 - Tzuhan) Initialize Debit Token
    // Info: (20260210 - Tzuhan) 共用 identityRegistry 和 modularCompliance，確保相同的合規標準
    const initDebitToken = m.call(debitToken, 'init', [
        identityRegistry,
        complianceDebit,
        'Debit Token',  // Info: (20260210 - Tzuhan) 名稱
        'DEBT',        // Info: (20260210 - Tzuhan) 代號
        18,
        issuerIdentity
    ], {
        id: 'init_debit_token',
        after: [initIR, initMCDebit, issuerIdentity]
    });

    // =========================================================
    // Info: (20260210 - Tzuhan) 6. Setup Bindings & Agents
    // =========================================================

    // Info: (20260210 - Tzuhan) A. Bind Storage -> Registry
    m.call(identityRegistryStorage, 'bindIdentityRegistry', [identityRegistry], {
        id: 'bind_irs_to_ir',
        after: [initIRS, identityRegistry]
    });

    // Info: (20260210 - Tzuhan) B. Bind Tokens to Compliance (Optional but recommended for strict checks)
    // Info: (20260210 - Tzuhan) 讓 Compliance 合約知道這兩個 Token 綁定於它
    m.call(complianceNTD, 'bindToken', [token], {
        id: 'bind_ntd_compliance',
        after: [initMCNTD, initToken]
    });
    m.call(complianceDebit, 'bindToken', [debitToken], {
        id: 'bind_debit_compliance',
        after: [initMCDebit, initDebitToken]
    });

    // Info: (20260210 - Tzuhan) C. Add Deployer as Token Agent (to allow minting)
    // Info: (20260210 - Tzuhan) 未來這裡應該也要加入 ClearingService 的地址作為 Agent
    m.call(token, 'addAgent', [deployer], {
        id: 'add_token_agent',
        after: [initToken]
    });

    // Info: (20260210 - Tzuhan) Add Deployer as Debit Token Agent
    m.call(debitToken, 'addAgent', [deployer], {
        id: 'add_debit_token_agent',
        after: [initDebitToken]
    });

    // Info: (20260210 - Tzuhan) D. Add Deployer as Identity Registry Agent (to allow registering identities)
    m.call(identityRegistry, 'addAgent', [deployer], {
        id: 'add_ir_agent',
        after: [initIR]
    });

    return {
        token,       // Info: (20260210 - Tzuhan) Asset / NTD
        debitToken,   // Info: (20260210 - Tzuhan) Liability / Debit
        identityRegistry,
        complianceNTD,
        complianceDebit,
        identityRegistryStorage,
        claimTopicsRegistry,
        trustedIssuersRegistry,
        issuerIdentity
    };
});

export default AssetCoreModule;