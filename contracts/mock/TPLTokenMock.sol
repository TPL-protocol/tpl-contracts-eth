pragma solidity ^0.4.24;

import "../token/TPLRestrictedReceiverToken.sol";
import "../AttributeRegistryInterface.sol";


/**
 * @title An instance of TPLRestrictedReceiverToken with an initial balance.
 */
contract TPLTokenMock is Initializable, TPLRestrictedReceiverToken {
  /**
  * @notice The initializer function, with an associated attribute registry at
  * `registry`, an assignable attribute type with ID `validAttributeTypeID`, and
  * an initial balance of `initialBalance`.
  * @param initialBalance uint256 The initial balance assigned to the deployer.  
  * @param registry address The account of the associated attribute registry.  
  * @param validAttributeTypeID uint256 The ID of the required attribute type.
  * @dev Note that it may be appropriate to require that the referenced
  * attribute registry supports the correct interface via EIP-165.
  */
  function initialize(
    uint256 initialBalance,
    AttributeRegistryInterface registry,
    uint256 validAttributeTypeID
  )
    public
    initializer
  {
    TPLRestrictedReceiverToken.initialize(registry, validAttributeTypeID);
    _mint(msg.sender, initialBalance);
  }
}