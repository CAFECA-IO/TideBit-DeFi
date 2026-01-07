import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const CompanyAssetsModule = buildModule('CompanyAssetsModule', (m) => {
  // Info: (20260106 - Tzuahan) --- 1. 部署共用基礎設施 (Shared Infrastructure) ---

  // Info: (20260106 - Tzuahan) 這些合約是全平台共用的，不需要每家公司部署一份
  const trustedIssuersRegistry = m.contract('TrustedIssuersRegistry', [], {
    id: 'TrustedIssuersRegistry',
  });

  const claimTopicsRegistry = m.contract('ClaimTopicsRegistry', [], {
    id: 'ClaimTopicsRegistry',
  });

  // Info: (20260106 - Tzuahan) 部署 Token 邏輯合約 (Implementation)，供所有 TokenProxy 使用
  const tokenImpl = m.contract('Token', [], { id: 'TokenImpl' });

  // Info: (20260106 - Tzuahan) --- 2. 部署資產工廠 (Factory) ---
  const companyAssetsFactory = m.contract(
    'CompanyAssetsFactory',
    [trustedIssuersRegistry, claimTopicsRegistry, tokenImpl],
    {
      id: 'CompanyAssetsFactory',
    }
  );

  return {
    companyAssetsFactory,
    trustedIssuersRegistry,
    claimTopicsRegistry,
  };
});

export default CompanyAssetsModule;
