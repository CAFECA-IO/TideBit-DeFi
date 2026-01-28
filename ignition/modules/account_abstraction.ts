import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const AccountAbstractionModule = buildModule('AccountAbstractionModule', (m) => {
    // Info: (20260127 - Tzuhan) AA Components (SCW Factory)
    const entryPointAddress = process.env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS;

    const entryPoint = entryPointAddress
        ? m.contractAt('EntryPointImportHelper', entryPointAddress, { id: 'EntryPoint_At_Address' })
        : m.contract('EntryPointImportHelper', [], { id: 'EntryPoint_Deployed' });

    const scwFactory = m.contract('SCWFactory', [entryPoint]);

    return {
        entryPoint,
        scwFactory
    };
});

export default AccountAbstractionModule;
