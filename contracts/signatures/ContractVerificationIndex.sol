// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract ContractVerificationIndex is OwnableUpgradeable {
    /// @notice Current verification index at a contract level. Only updatable by the owner of the contract.
    /// Updating it will invalidate all signatures created with the previous value on a contract level.
    uint256 private contractVerificationIndex;

    event ContractVerificationIndexUpdated(uint256 _newIndex, address _sender);

    function __ContractVerificationIndex_init() internal onlyInitializing {
        __Ownable_init();
    }

    function __ContractVerificationIndex_init_unchained() internal onlyInitializing {}

    /// @notice Get the current contract verification index.
    /// @return The current contract verification index.
    function getContractVerificationIndex() external view returns (uint256) {
        return contractVerificationIndex;
    }

    /// @notice As the owner of the contract, increase the contract verification index by 1.
    function bumpContractVerificationIndex() external onlyOwner {
        _bumpContractVerificationIndex();
    }

    /// @dev Increase the contract verification index by 1
    function _bumpContractVerificationIndex() internal {
        emit ContractVerificationIndexUpdated(++contractVerificationIndex, _msgSender());
    }

    /// @dev Reverts if the provided verification index does not match the current one.
    function _verifyContractVerificationIndex(uint256 _index) internal view {
        require(
            _index == contractVerificationIndex,
            "ContractVerificationIndex#_verifyContractVerificationIndex: CONTRACT_VERIFICATION_INDEX_MISMATCH"
        );
    }
}
