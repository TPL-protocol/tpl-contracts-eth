pragma solidity ^0.4.25;

import "openzeppelin-zos/contracts/token/ERC20/ERC20.sol";
import "../AttributeRegistryInterface.sol";
import "../TPLTokenInterface.sol";

contract ERC20Permissioned is Initializable, ERC20, TPLTokenInterface {

  // declare registry interface, used to request attributes from a jurisdiction
  AttributeRegistryInterface registry;

  // declare attribute ID required in order to receive transferred tokens
  uint256 validRecipientAttributeId;

  // initialize token with a jurisdiction address and a valid attribute ID
  function initialize(
    AttributeRegistryInterface _jurisdictionAddress,
    uint256 _validRecipientAttributeId
  )
    initializer
    public
  {
    registry = _jurisdictionAddress;
    validRecipientAttributeId = _validRecipientAttributeId;
  }

  // provide getter function for finding the registry address the token is using
  function getRegistryAddress() external view returns (address) {
    return address(registry);
  }

  // in order to transfer tokens, the receiver must be valid
  // NOTE: consider returning an additional status code, e.g. EIP 1066
  function canTransfer(address _to, uint256 _value) external view returns (bool) {
    return (
      super.balanceOf(msg.sender) >= _value && 
      registry.hasAttribute(_to, validRecipientAttributeId)
    );
  }

  // in order to transfer tokens via transferFrom, the receiver must be valid
  // NOTE: consider returning an additional status code, e.g. EIP 1066
  function canTransferFrom(
    address _from,
    address _to,
    uint256 _value
  ) external view returns (bool) {
    _from;
    return (
      super.balanceOf(_from) >= _value &&
      super.allowance(_from, msg.sender) >= _value &&
      registry.hasAttribute(_to, validRecipientAttributeId)
    );
  }

  // check that target is allowed to receive tokens before enabling the transfer
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(
      registry.hasAttribute(_to, validRecipientAttributeId),
      "Transfer failed - recipient is not approved."
    );
    return(super.transfer(_to, _value));
  }

  // check that the transfer is valid before enabling approved transfers as well
  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  ) public returns (bool) {
    require(
      registry.hasAttribute(_to, validRecipientAttributeId),
      "Transfer failed - recipient is not approved."
    );
    return(super.transferFrom(_from, _to, _value));
  }

}