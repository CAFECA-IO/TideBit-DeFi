import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import AccountAbstractionModule from './account_abstraction';
import AssetCoreModule from './asset_core';

const DeployModule = buildModule('DeployModule', (m) => {
  const { token, identityRegistry, compliance, identityRegistryStorage, claimTopicsRegistry, trustedIssuersRegistry, issuerIdentity } = m.useModule(AssetCoreModule);
  const { entryPoint, scwFactory } = m.useModule(AccountAbstractionModule);

  return {
    token,
    identityRegistry,
    compliance,
    identityRegistryStorage,
    claimTopicsRegistry,
    trustedIssuersRegistry,
    issuerIdentity,
    entryPoint,
    scwFactory
  };
});

export default DeployModule;
