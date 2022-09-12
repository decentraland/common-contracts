// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "../signatures/ContractNonceVerifiable.sol";
import "../signatures/SignerNonceVerifiable.sol";
import "../signatures/AssetVerificationIndex.sol";

contract DummyNonceVerifiableImplementor is ContractNonceVerifiable, SignerNonceVerifiable, AssetVerificationIndex {
    function initialize() external initializer {
        __ContractNonceVerifiable_init();
    }

    function test__ContractNonceVerifiable_init() external {
        __ContractNonceVerifiable_init();
    }

    function verifyContractNonce(uint256 _index) external view {
        _verifyContractNonce(_index);
    }

    function verifySignerNonce(address _signer, uint256 _index) external view {
        _verifySignerNonce(_signer, _index);
    }

    function bumpAll(
        address _contractAddress,
        uint256 _tokenId,
        address _signer
    ) external {
        _bumpContractNonce();
        _bumpSignerNonce(_signer);
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
