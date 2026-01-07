// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistry.sol';
import '@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistryStorage.sol';
import '@erc3643org/erc-3643/contracts/compliance/modular/ModularCompliance.sol';
import '@erc3643org/erc-3643/contracts/proxy/TokenProxy.sol';
import '@erc3643org/erc-3643/contracts/token/IToken.sol';

// Info: (20260107 - Tzuahan) 簡易的 Authority 合約，用於滿足 TokenProxy 的介面檢查需求
contract SimpleAuthority {
  address public immutable tokenImplementation;

  constructor(address _tokenImplementation) {
    tokenImplementation = _tokenImplementation;
  }

  function getTokenImplementation() external view returns (address) {
    return tokenImplementation;
  }
  // Info: (20260107 - Tzuahan) 回傳非零地址以通過 AbstractProxy 的檢查
  function getCTRImplementation() external pure returns (address) {
    return address(0xdead);
  }
  function getIRImplementation() external pure returns (address) {
    return address(0xdead);
  }
  function getIRSImplementation() external pure returns (address) {
    return address(0xdead);
  }
  function getTIRImplementation() external pure returns (address) {
    return address(0xdead);
  }
  function getMCImplementation() external pure returns (address) {
    return address(0xdead);
  }
}

contract CompanyAssetsFactory {
  // Info: (20260106 - Tzuahan) 共用的基礎設施 (節省部署成本，所有公司共用同一份信任清單)
  address public immutable trustedIssuersRegistry;
  address public immutable claimTopicsRegistry;
  address public immutable tokenImplementation; // Info: (20260106 - Tzuahan) Token 邏輯合約

  event AssetsCreated(
    address indexed companyScw,
    address token,
    address identityRegistry,
    address compliance
  );

  constructor(
    address _trustedIssuersRegistry,
    address _claimTopicsRegistry,
    address _tokenImplementation
  ) {
    trustedIssuersRegistry = _trustedIssuersRegistry;
    claimTopicsRegistry = _claimTopicsRegistry;
    tokenImplementation = _tokenImplementation;
  }

  /**
   * @dev 為指定公司部署全套 RWA 資產合約
   */
  function createAssets(
    address _companyScw,
    string memory _tokenName,
    string memory _tokenSymbol,
    uint8 _decimals
  ) external {
    // Info: (20260107 - Tzuahan) 1. 部署 Identity Registry Storage 並初始化
    IdentityRegistryStorage identityStorage = new IdentityRegistryStorage();
    identityStorage.init();

    // Info: (20260107 - Tzuahan) 2. 部署 Identity Registry 並初始化 (綁定共用的 Issuers 和 Topics)
    IdentityRegistry identityRegistry = new IdentityRegistry();
    identityRegistry.init(trustedIssuersRegistry, claimTopicsRegistry, address(identityStorage));

    // Info: (20260106 - Tzuahan) 3. 綁定 Storage -> Registry
    identityStorage.bindIdentityRegistry(address(identityRegistry));

    // Info: (20260106 - Tzuahan) 4. 部署 Compliance (合規模組)
    ModularCompliance compliance = new ModularCompliance();
    compliance.init();

    // Info: (20260107 - Tzuahan) 5. 部署 Token (使用 Proxy 模式指向共用的 Implementation)
    // Info: (20260107 - Tzuahan) 部署一個簡易 Authority 來管理 Implementation
    SimpleAuthority authority = new SimpleAuthority(tokenImplementation);

    TokenProxy tokenProxy = new TokenProxy(
      address(authority),
      address(identityRegistry),
      address(compliance),
      _tokenName,
      _tokenSymbol,
      _decimals,
      address(0) // Info: (20260106 - Tzuahan) onchainID, 暫時設為 0
    );

    address tokenAddress = address(tokenProxy);

    // Info: (20260106 - Tzuahan) --- 權限綁定與轉移 ---

    // Info: (20260107 - Tzuahan) 6. Registry 綁定 Token
    // Info: (20260107 - Tzuahan) identityRegistry 是合約型別，直接繼承了 AgentRoleUpgradeable，所以可以直接呼叫
    identityRegistry.addAgent(tokenAddress);

    // Info: (20260107 - Tzuahan) 7. Token 綁定 CompanySCW 為 Agent (允許 Mint/Burn/ForcedTransfer)
    // Info: (20260107 - Tzuahan) 修正：將 tokenAddress 轉型為 AgentRoleUpgradeable 來呼叫 addAgent
    AgentRoleUpgradeable(tokenAddress).addAgent(_companyScw);

    // Info: (20260107 - Tzuahan) 8. 轉移所有權給 CompanySCW
    // Info: (20260107 - Tzuahan) 修正：同樣轉型為 AgentRoleUpgradeable 來呼叫 transferOwnership (繼承自 OwnableUpgradeable)
    AgentRoleUpgradeable(tokenAddress).transferOwnership(_companyScw);

    identityRegistry.transferOwnership(_companyScw);
    identityStorage.transferOwnership(_companyScw);
    compliance.transferOwnership(_companyScw);

    emit AssetsCreated(_companyScw, tokenAddress, address(identityRegistry), address(compliance));
  }
}
