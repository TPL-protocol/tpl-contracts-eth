pragma solidity ^0.4.24;

import "openzeppelin-zos/contracts/token/ERC20/ERC20.sol";
import "./TPLRestrictedReceiverTokenInterface.sol";
import "../AttributeRegistryInterface.sol";


/**
 * @title Permissioned ERC20 token: transfers are restricted to valid receivers.
 */
contract TPLRestrictedReceiverToken is Initializable, ERC20, TPLRestrictedReceiverTokenInterface {

  // declare registry interface, used to request attributes from a jurisdiction
  AttributeRegistryInterface private _registry;

  // declare attribute ID required in order to receive transferred tokens
  uint256 private _validAttributeTypeID;

  /**
   * @notice Check if an account is approved to receive token transfers at
   * account `receiver`.
   * @param receiver address The account of the recipient.
   * @return True if the receiver is valid, false otherwise.
   */
  function canReceive(address receiver) external view returns (bool) {
    return _registry.hasAttribute(receiver, _validAttributeTypeID);
  }

  /**
   * @notice Get the account of the utilized attribute registry.
   * @return The account of the registry.
   */
  function getRegistry() external view returns (address) {
    return address(_registry);
  }

  /**
   * @notice Get the ID of the attribute type required to receive tokens.
   * @return The ID of the required attribute type.
   */
  function getValidAttributeID() external view returns (uint256) {
    return _validAttributeTypeID;
  }

  /**
  * @notice The initializer function, with an associated attribute registry at
  * `registry` and an assignable attribute type with ID `validAttributeTypeID`.
  * @param registry address The account of the associated attribute registry.  
  * @param validAttributeTypeID uint256 The ID of the required attribute type.
  * @dev Note that it may be appropriate to require that the referenced
  * attribute registry supports the correct interface via EIP-165.
  */
  function initialize(
    AttributeRegistryInterface registry,
    uint256 validAttributeTypeID
  )
    public
    initializer
  {
    _registry = AttributeRegistryInterface(registry);
    _validAttributeTypeID = validAttributeTypeID;
  }

  /**
   * @notice Transfer an amount of `value` to a receiver at account `to`.
   * @param to address The account of the receiver.
   * @param value uint256 the amount to be transferred.
   * @return True if the transfer was successful.
   */
  function transfer(address to, uint256 value) public returns (bool) {
    require(
      _registry.hasAttribute(to, _validAttributeTypeID),
      "Transfer failed - receiver is not approved."
    );
    return super.transfer(to, value);
  }

  /**
   * @notice Transfer an amount of `value` to a receiver at account `to` on
   * behalf of a sender at account `from`.
   * @param to address The account of the receiver.
   * @param from address The account of the sender.
   * @param value uint256 the amount to be transferred.
   * @return True if the transfer was successful.
   */
  function transferFrom(
    address from,
    address to,
    uint256 value
  ) public returns (bool) {
    require(
      _registry.hasAttribute(to, _validAttributeTypeID),
      "Transfer failed - receiver is not approved."
    );
    return super.transferFrom(from, to, value);
  }
}
