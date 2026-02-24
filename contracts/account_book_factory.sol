// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistry.sol';
import '@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistryStorage.sol';
import '@erc3643org/erc-3643/contracts/compliance/modular/ModularCompliance.sol';
import '@erc3643org/erc-3643/contracts/proxy/TokenProxy.sol';
import '@erc3643org/erc-3643/contracts/token/IToken.sol';
import '@erc3643org/erc-3643/contracts/roles/AgentRoleUpgradeable.sol';

import './company_assets_factory.sol'; 
import './clearing_service.sol';

// ==========================================
// Info: (20260223 - Tzuhan) 小幫手合約，專門分擔肥大的 Registry 與 Compliance 部署
// ==========================================
contract AccountBookHelper {
    function deployBasics(address trustedIssuersRegistry, address claimTopicsRegistry)
        external
        returns (address identityRegistry, address identityStorage, address compliance)
    {
        // Info: (20260223 - Tzuhan) 1. 部署 Storage
        IdentityRegistryStorage storageContract = new IdentityRegistryStorage();
        storageContract.init();

        // Info: (20260223 - Tzuhan) 2. 部署 Registry
        IdentityRegistry registryContract = new IdentityRegistry();
        registryContract.init(trustedIssuersRegistry, claimTopicsRegistry, address(storageContract));

        // Info: (20260223 - Tzuhan) 3. 綁定關係 (此時 Helper 還是 Owner，所以呼叫成功)
        storageContract.bindIdentityRegistry(address(registryContract));

        // Info: (20260223 - Tzuhan) 4. 權限設定完畢，將所有權全部交還給 Factory
        storageContract.transferOwnership(msg.sender);
        registryContract.transferOwnership(msg.sender);

        // Info: (20260223 - Tzuhan) 5. 部署 Compliance
        ModularCompliance complianceContract = new ModularCompliance();
        complianceContract.init();
        complianceContract.transferOwnership(msg.sender);

        return (address(registryContract), address(storageContract), address(complianceContract));
    }
}

// ==========================================
// Info: (20260223 - Tzuhan) Factory 合約
// ==========================================
contract AccountBookFactory {
    address public immutable trustedIssuersRegistry;
    address public immutable claimTopicsRegistry;
    address public immutable tokenImplementation;
    AccountBookHelper public immutable helper;

    event AccountBookCreated(
        address indexed companyScw, address creditToken, address debtToken,
        address clearingService, address identityRegistry
    );

    constructor(
        address _trustedIssuersRegistry,
        address _claimTopicsRegistry,
        address _tokenImplementation,
        address _helper
    ) {
        trustedIssuersRegistry = _trustedIssuersRegistry;
        claimTopicsRegistry = _claimTopicsRegistry;
        tokenImplementation = _tokenImplementation;
        helper = AccountBookHelper(_helper);
    }

    function createAccountBook(address _companyScw, string memory _projectName, uint8 _decimals) external {
        // Info: (20260223 - Tzuhan) 1. 透過 Helper 部署肥大的基礎建設
        (address ir, address irs, address comp) = helper.deployBasics(trustedIssuersRegistry, claimTopicsRegistry);
        IdentityRegistry identityRegistry = IdentityRegistry(ir);
        IdentityRegistryStorage identityStorage = IdentityRegistryStorage(irs);
        ModularCompliance compliance = ModularCompliance(comp);

        // Info: (20260223 - Tzuhan) 2. 部署輕量級的 Authority 與 Token Proxies
        SimpleAuthority authority = new SimpleAuthority(tokenImplementation);

        address creditToken = address(new TokenProxy(
            address(authority), ir, comp,
            string(abi.encodePacked(_projectName, " Credit")), 
            string(abi.encodePacked("c", _projectName)), 
            _decimals, address(0)
        ));

        address debtToken = address(new TokenProxy(
            address(authority), ir, comp,
            string(abi.encodePacked(_projectName, " Debt")), 
            string(abi.encodePacked("d", _projectName)), 
            _decimals, address(0)
        ));

        // Info: (20260223 - Tzuhan) 3. 部署 Clearing Service
        ClearingService clearingService = new ClearingService(creditToken, debtToken);

        // Info: (20260223 - Tzuhan) --- 權限綁定與轉移 ---
        identityRegistry.addAgent(creditToken);
        identityRegistry.addAgent(debtToken);

        AgentRoleUpgradeable(creditToken).addAgent(address(clearingService));
        AgentRoleUpgradeable(debtToken).addAgent(address(clearingService));
        AgentRoleUpgradeable(creditToken).addAgent(_companyScw);
        AgentRoleUpgradeable(debtToken).addAgent(_companyScw);

        AgentRoleUpgradeable(creditToken).addAgent(address(this));
        IToken(creditToken).unpause();
        AgentRoleUpgradeable(creditToken).removeAgent(address(this));

        AgentRoleUpgradeable(debtToken).addAgent(address(this));
        IToken(debtToken).unpause();
        AgentRoleUpgradeable(debtToken).removeAgent(address(this));

        // Info: (20260223 - Tzuhan) 轉移所有權給 Company SCW
        AgentRoleUpgradeable(creditToken).transferOwnership(_companyScw);
        AgentRoleUpgradeable(debtToken).transferOwnership(_companyScw);
        authority.transferOwnership(_companyScw);
        identityRegistry.transferOwnership(_companyScw);
        identityStorage.transferOwnership(_companyScw);
        compliance.transferOwnership(_companyScw);

        emit AccountBookCreated(_companyScw, creditToken, debtToken, address(clearingService), ir);
    }
}