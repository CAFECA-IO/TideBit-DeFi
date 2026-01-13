import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const ERC4337Module = buildModule('ERC4337Module', (m) => {
  // Info: (20260113 - Tzuhan) 1. 部署 EntryPoint
  const entryPoint = m.contract('EntryPointImportHelper');

  // Info: (20260113 - Tzuhan) 2. 部署 Factory
  const scwFactory = m.contract('SCWFactory', [entryPoint]);

  return {
    entryPoint,
    scwFactory,
  };
});

export default ERC4337Module;
