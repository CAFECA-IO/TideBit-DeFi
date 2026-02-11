import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import AssetCoreModule from './asset_core';
import AccountAbstractionModule from './account_abstraction';

const DeployModule = buildModule('DeployModule', (m) => {
  const {
    token,
    identityRegistry,
    complianceNTD,
    complianceDebit,
    identityRegistryStorage,
    claimTopicsRegistry,
    trustedIssuersRegistry,
    issuerIdentity
  } = m.useModule(AssetCoreModule);

  const { entryPoint, scwFactory } = m.useModule(AccountAbstractionModule);

  return {
    token,
    identityRegistry,
    complianceNTD,
    complianceDebit,
    identityRegistryStorage,
    claimTopicsRegistry,
    trustedIssuersRegistry,
    issuerIdentity,
    entryPoint,
    scwFactory
  };
});

export default DeployModule;
