// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@erc3643org/erc-3643/contracts/compliance/modular/IModularCompliance.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract SimpleCompliance is IModularCompliance, Ownable {
  address private _tokenBound;

function bindToken(address _token) external override {
    _tokenBound = _token;
    emit TokenBound(_token);
  }

  function unbindToken(address _token) external override {
    if (_tokenBound == _token) {
      _tokenBound = address(0);
      emit TokenUnbound(_token);
    }
  }

  function addModule(address _module) external override {
    emit ModuleAdded(_module);
  }

  function removeModule(address _module) external override {
    emit ModuleRemoved(_module);
  }

  function callModuleFunction(bytes calldata callData, address _module) external override {
    emit ModuleInteraction(_module, bytes4(callData));
  }

  function transferred(address _from, address _to, uint256 _amount) external override {
  }

  function created(address _to, uint256 _amount) external override {
  }

  function destroyed(address _from, uint256 _amount) external override {
  }

  function canTransfer(
    address /*_from*/,
    address /*_to*/,
    uint256 /*_amount*/
  ) external view override returns (bool) {
    return true;
  }

  function getModules() external view override returns (address[] memory) {
    return new address[](0);
  }

  function getTokenBound() external view override returns (address) {
    return _tokenBound;
  }

  function isModuleBound(address /*_module*/) external view override returns (bool) {
    return false;
  }
}
