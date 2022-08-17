// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

abstract contract SignerNonceVerifiable is ContextUpgradeable {
    /// @notice Current nonce per signer.
    /// Updating it will invalidate all signatures created with the previous value on a signer level.
    /// @custom:schema (signer address -> nonce)
    mapping(address => uint256) private signerNonce;

    event SignerNonceUpdated(address indexed _signer, uint256 _newNonce, address _sender);

    function __SignerNonceVerifiable_init() internal onlyInitializing {}

    function __SignerNonceVerifiable_init_unchained() internal onlyInitializing {}

    /// @notice Get the current signer nonce.
    /// @param _signer The address of the signer.
    /// @return The nonce of the given signer.
    function getSignerNonce(address _signer) public view returns (uint256) {
        return signerNonce[_signer];
    }

    /// @notice Increase the signer nonce of the sender by 1.
    function bumpSignerNonce() external {
        _bumpSignerNonce(_msgSender());
    }

    /// @dev Increase the signer nonce by 1
    function _bumpSignerNonce(address _signer) internal {
        emit SignerNonceUpdated(_signer, ++signerNonce[_signer], _msgSender());
    }

    /// @dev Reverts if the provided nonce does not match the signer nonce.
    function _verifySignerNonce(address _signer, uint256 _nonce) internal view {
        require(_nonce == signerNonce[_signer], "SignerNonceVerifiable#_verifySignerNonce: SIGNER_NONCE_MISMATCH");
    }
}
