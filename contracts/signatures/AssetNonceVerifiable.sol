// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

abstract contract AssetNonceVerifiable is ContextUpgradeable {
    /// @notice Current nonce per asset per signer.
    /// Updating it will invalidate all signatures created with the previous value on an asset level.
    /// @custom:schema (contract address -> token id -> signer address -> nonce)
    mapping(address => mapping(uint256 => mapping(address => uint256))) private assetNonce;

    event AssetNonceUpdated(address indexed _signer, address indexed _contractAddress, uint256 indexed _tokenId, uint256 _newNonce, address _sender);

    function __AssetNonceVerifiable_init() internal onlyInitializing {}

    function __AssetNonceVerifiable_init_unchained() internal onlyInitializing {}

    /// @notice Get the signer nonce for a given ERC721 token.
    /// @param _contractAddress The address of the ERC721 contract.
    /// @param _tokenId The id of the ERC721 token.
    /// @param _signer The address of the signer.
    /// @return The nonce of the given signer for the provided asset.
    function getAssetNonce(
        address _contractAddress,
        uint256 _tokenId,
        address _signer
    ) external view returns (uint256) {
        return assetNonce[_contractAddress][_tokenId][_signer];
    }

    /// @notice Increase the asset nonce of the sender by 1.
    /// @param _contractAddress The contract address of the asset.
    /// @param _tokenId The token id of the asset.
    function bumpAssetNonce(address _contractAddress, uint256 _tokenId) external {
        _bumpAssetNonce(_contractAddress, _tokenId, _msgSender());
    }

    /// @dev Increase the asset nonce by 1
    function _bumpAssetNonce(
        address _contractAddress,
        uint256 _tokenId,
        address _signer
    ) internal {
        emit AssetNonceUpdated(_signer, _contractAddress, _tokenId, ++assetNonce[_contractAddress][_tokenId][_signer], _msgSender());
    }

    /// @dev Reverts if the provided nonce does not match the asset nonce.
    function _verifyAssetNonce(
        address _contractAddress,
        uint256 _tokenId,
        address _signer,
        uint256 _nonce
    ) internal view {
        require(_nonce == assetNonce[_contractAddress][_tokenId][_signer], "AssetNonceVerifiable#_verifyAssetNonce: ASSET_NONCE_MISMATCH");
    }
}
