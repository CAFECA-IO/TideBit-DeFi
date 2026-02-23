import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const TOKEN_ARTIFACT = require('@erc3643org/erc-3643/artifacts/contracts/token/Token.sol/Token.json');

// Info: (20260223 - Tzuhan) 直接讀取已在主網上線的合約地址 
const NTD_TOKEN_ADDRESS = '0xb3ce18F4fB5f64A32b5417B5590B36667A4d8dE7';
const DEBIT_TOKEN_ADDRESS = '0x1E7d4784138B50E83D002136386eFfFFD604d6C2';
const TIR_ADDRESS = '0x610E94F7CDcBbb03a8D0872496D29B9c459b889c';
const CTR_ADDRESS = '0x8088D1664983E2F7BF0c714F15F85b23293D559B';

const ClearingSystemModule = buildModule('ClearingSystemModule', (m) => {
    // Info: (20260223 - Tzuhan) 1. 綁定主網代幣 (明確傳入 TOKEN_ARTIFACT，並設定 id 避免衝突)
    const ntdToken = m.contractAt('Token', TOKEN_ARTIFACT, NTD_TOKEN_ADDRESS, { id: 'ntd_token_instance' });
    const debitToken = m.contractAt('Token', TOKEN_ARTIFACT, DEBIT_TOKEN_ADDRESS, { id: 'debit_token_instance' });

    // Info: (20260223 - Tzuhan) 2. 部署 Clearing Service
    const clearingService = m.contract('ClearingService', [ntdToken, debitToken]);

    // Info: (20260223 - Tzuhan) 3. 授權 Clearing Service 成為平台幣的 Agent
    m.call(ntdToken, 'addAgent', [clearingService], {
        id: 'add_clearing_agent_ntd',
        after: [clearingService]
    });

    m.call(debitToken, 'addAgent', [clearingService], {
        id: 'add_clearing_agent_debit',
        after: [clearingService]
    });

    // Info: (20260223 - Tzuhan) 4. 部署 AccountBookHelper (小幫手)
    const helper = m.contract('AccountBookHelper');

    // Info: (20260223 - Tzuhan) 5. 部署 AccountBookFactory，並把小幫手地址傳入
    const accountBookFactory = m.contract('AccountBookFactory', [
        TIR_ADDRESS,
        CTR_ADDRESS,
        NTD_TOKEN_ADDRESS, // Info: (20260223 - Tzuhan) 用 NTD 當作 Implementation
        helper
    ], {
        after: [helper]
    });

    return { clearingService, helper, accountBookFactory };
});

export default ClearingSystemModule;