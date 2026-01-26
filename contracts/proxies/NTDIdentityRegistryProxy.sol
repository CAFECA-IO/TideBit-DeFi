// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import '@erc3643org/erc-3643/contracts/proxy/IdentityRegistryProxy.sol';

/**
 * @title NTDIdentityRegistryProxy
 * @dev Extension of IdentityRegistryProxy to support EIP-1967 implementation slot exposure.
 *      This allows block explorers and tools to detect the implementation contract automatically.
 */
contract NTDIdentityRegistryProxy is IdentityRegistryProxy {
  // EIP-1967 implementation slot: keccak256("eip1967.proxy.implementation") - 1
  bytes32 internal constant _IMPLEMENTATION_SLOT =
    0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

  constructor(
    address implementationAuthority,
    address _trustedIssuersRegistry,
    address _claimTopicsRegistry,
    address _identityStorage
  )
    IdentityRegistryProxy(
      implementationAuthority,
      _trustedIssuersRegistry,
      _claimTopicsRegistry,
      _identityStorage
    )
  {
    _syncImplementation();
  }

  /**
   * @dev Public function to manually sync the implementation slot if it becomes stale.
   *      (e.g., if the Authority contract updates the implementation version).
   */
  function syncImplementation() external {
    _syncImplementation();
  }

  /**
   * @dev Internal function to read implementation from Authority and store it in EIP-1967 slot.
   */
  function _syncImplementation() internal {
    address impl = (ITREXImplementationAuthority(getImplementationAuthority()))
      .getIRImplementation();
    assembly {
      sstore(_IMPLEMENTATION_SLOT, impl)
    }
  }

  receive() external payable {}
}
