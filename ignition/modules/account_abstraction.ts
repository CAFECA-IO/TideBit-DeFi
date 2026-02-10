import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const AccountAbstractionModule = buildModule('AccountAbstractionModule', (m) => {
    // Info: (20260119 - Tzuhan) 6. AA Components
    const entryPoint = m.contractAt('EntryPointImportHelper', '0x1e51E13D511016aB69C0F58c4282784eA5401Cf6', {
        id: 'EP',
    });

    const scwFactory = m.contract('SCWFactory', [entryPoint]);

    return { entryPoint, scwFactory };
});

export default AccountAbstractionModule;
