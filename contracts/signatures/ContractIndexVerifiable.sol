// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract ContractIndexVerifiable is OwnableUpgradeable {
    /// @notice Current verification index at a contract level. Only updatable by the owner of the contract.
    /// Updating it will invalidate all signatures created with the previous value on a contract level.
    uint256 private contractIndex;

    event ContractIndexUpdated(uint256 _newIndex, address _sender);

    function __ContractIndexVerifiable_init() internal onlyInitializing {
        __Ownable_init();
    }

    function __ContractIndexVerifiable_init_unchained() internal onlyInitializing {}

    /// @notice Get the current contract verification index.
    /// @return The current contract verification index.
    function getContractIndex() external view returns (uint256) {
        return contractIndex;
    }

    /// @notice As the owner of the contract, increase the contract verification index by 1.
    function bumpContractIndex() external onlyOwner {
        _bumpContractIndex();
    }

    /// @dev Increase the contract verification index by 1
    function _bumpContractIndex() internal {
        emit ContractIndexUpdated(++contractIndex, _msgSender());
    }

    /// @dev Reverts if the provided verification index does not match the contract verification index.
    function _verifyContractIndex(uint256 _index) internal view {
        require(_index == contractIndex, "ContractIndexVerifiable#_verifyContractIndex: CONTRACT_INDEX_MISMATCH");
    }
}
