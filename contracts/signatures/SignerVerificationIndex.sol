// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

abstract contract SignerVerificationIndex is ContextUpgradeable {
    /// @notice Current verification index per signer.
    /// Updating it will invalidate all signatures created with the previous value on a signer level.
    /// @custom:schema (signer address -> verification index)
    mapping(address => uint256) private signerVerificationIndex;

    event SignerVerificationIndexUpdated(address indexed _signer, uint256 _newIndex, address _sender);

    function __SignerVerificationIndex_init() internal onlyInitializing {}

    function __SignerVerificationIndex_init_unchained() internal onlyInitializing {}

    /// @notice Get the current signer verification index.
    /// @param _signer The address of the signer.
    /// @return The verification index of the given signer.
    function getSignerVerificationIndex(address _signer) external view returns (uint256) {
        return signerVerificationIndex[_signer];
    }

    /// @notice Increase the signer verification index of the sender by 1.
    function bumpSignerVerificationIndex() external {
        _bumpSignerVerificationIndex(_msgSender());
    }

    /// @dev Increase the signer verification index by 1
    function _bumpSignerVerificationIndex(address _signer) internal {
        emit SignerVerificationIndexUpdated(_signer, ++signerVerificationIndex[_signer], _msgSender());
    }

    /// @dev Reverts if the provided verification index does not match the current one.
    function _verifySignerVerificationIndex(address _signer, uint256 _index) internal view {
        require(
            _index == signerVerificationIndex[_signer],
            "SignerVerificationIndex#_verifySignerVerificationIndex: SIGNER_VERIFICATION_INDEX_MISMATCH"
        );
    }
}
