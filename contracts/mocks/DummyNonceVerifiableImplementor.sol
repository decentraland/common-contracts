// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "../signatures/ContractVerificationIndex.sol";
import "../signatures/SignerVerificationIndex.sol";
import "../signatures/AssetVerificationIndex.sol";

contract DummyIndexVerificationImplementor is ContractVerificationIndex, SignerVerificationIndex, AssetVerificationIndex {
    function initialize() external initializer {
        __ContractVerificationIndex_init();
    }

    function test__ContractVerificationIndex_init() external {
        __ContractVerificationIndex_init();
    }

    function verifyContractVerificationIndex(uint256 _index) external view {
        _verifyContractVerificationIndex(_index);
    }

    function verifySignerVerificationIndex(address _signer, uint256 _index) external view {
        _verifySignerVerificationIndex(_signer, _index);
    }

    function bumpAll(
        address _contractAddress,
        uint256 _tokenId,
        address _signer
    ) external {
        _bumpContractVerificationIndex();
        _bumpSignerVerificationIndex(_signer);
        _bumpAssetVerificationIndex(_contractAddress, _tokenId, _signer);
    }

    function verifyAssetVerificationIndex(
        address _contractAddress,
        uint256 _tokenId,
        address _signer,
        uint256 _index
    ) external view {
        _verifyAssetVerificationIndex(_contractAddress, _tokenId, _signer, _index);
    }
}
