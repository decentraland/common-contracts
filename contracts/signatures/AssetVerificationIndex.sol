// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

abstract contract AssetVerificationIndex is ContextUpgradeable {
    /// @notice Current verification index per asset per signer.
    /// Updating it will invalidate all signatures created with the previous value on an asset level.
    /// @custom:schema (contract address -> token id -> signer address -> verification index)
    mapping(address => mapping(uint256 => mapping(address => uint256))) private assetVerificationIndex;

    event AssetVerificationIndexUpdated(
        address indexed _signer,
        address indexed _contractAddress,
        uint256 indexed _tokenId,
        uint256 _newIndex,
        address _sender
    );

    function __AssetVerificationIndex_init() internal onlyInitializing {}

    function __AssetVerificationIndex_init_unchained() internal onlyInitializing {}

    /// @notice Get the signer verification index for a given ERC721 token.
    /// @param _contractAddress The address of the ERC721 contract.
    /// @param _tokenId The id of the ERC721 token.
    /// @param _signer The address of the signer.
    /// @return The verification index of the given signer for the provided asset.
    function getAssetVerificationIndex(
        address _contractAddress,
        uint256 _tokenId,
        address _signer
    ) external view returns (uint256) {
        return assetVerificationIndex[_contractAddress][_tokenId][_signer];
    }

    /// @notice Increase the asset verification index of the sender by 1.
    /// @param _contractAddress The contract address of the asset.
    /// @param _tokenId The token id of the asset.
    function bumpAssetVerificationIndex(address _contractAddress, uint256 _tokenId) external {
        _bumpAssetVerificationIndex(_contractAddress, _tokenId, _msgSender());
    }

    /// @dev Increase the asset verification index by 1
    function _bumpAssetVerificationIndex(
        address _contractAddress,
        uint256 _tokenId,
        address _signer
    ) internal {
        emit AssetVerificationIndexUpdated(
            _signer,
            _contractAddress,
            _tokenId,
            ++assetVerificationIndex[_contractAddress][_tokenId][_signer],
            _msgSender()
        );
    }

    /// @dev Reverts if the provided verification index does not match the current.
    function _verifyAssetVerificationIndex(
        address _contractAddress,
        uint256 _tokenId,
        address _signer,
        uint256 _index
    ) internal view {
        require(
            _index == assetVerificationIndex[_contractAddress][_tokenId][_signer],
            "AssetVerificationIndex#_verifyAssetVerificationIndex: ASSET_VERIFICATION_INDEX_MISMATCH"
        );
    }
}
