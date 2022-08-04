// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract ContractNonceVerifiable is OwnableUpgradeable {
    /// @notice Current nonce at a contract level. Only updatable by the owner of the contract.
    /// Updating it will invalidate all signatures created with the previous value on a contract level.
    uint256 private contractNonce;

    event ContractNonceUpdated(uint256 _from, uint256 _to, address _sender);

    function __ContractNonceVerifiable_init() internal onlyInitializing {
        __Ownable_init();
    }

    function __ContractNonceVerifiable_init_unchained() internal onlyInitializing {}

    /// @notice Get the current contract nonce.
    /// @return The current contract nonce.
    function getContractNonce() external view returns (uint256) {
        return contractNonce;
    }

    /// @notice As the owner of the contract, increase the contract nonce by 1.
    function bumpContractNonce() external onlyOwner {
        _bumpContractNonce();
    }

    /// @dev Increase the contract nonce by 1
    function _bumpContractNonce() internal {
        emit ContractNonceUpdated(contractNonce, ++contractNonce, _msgSender());
    }

    /// @dev Reverts if the provided nonce does not match the contract nonce.
    function _verifyContractNonce(uint256 _nonce) internal view {
        require(_nonce == contractNonce, "ContractNonceVerifiable#_verifyContractNonce: CONTRACT_NONCE_MISMATCH");
    }
}
