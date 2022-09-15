// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "../signatures/ContractIndexVerifiable.sol";
import "../signatures/SignerIndexVerifiable.sol";
import "../signatures/AssetIndexVerifiable.sol";

contract DummyIndexVerifiableImplementor is ContractIndexVerifiable, SignerIndexVerifiable, AssetIndexVerifiable {
    function initialize() external initializer {
        __ContractIndexVerifiable_init();
    }

    function test__ContractIndexVerifiable_init() external {
        __ContractIndexVerifiable_init();
    }

    function verifyContractIndex(uint256 _index) external view {
        _verifyContractIndex(_index);
    }

    function verifySignerIndex(address _signer, uint256 _index) external view {
        _verifySignerIndex(_signer, _index);
    }

    function bumpAll(
        address _contractAddress,
        uint256 _tokenId,
        address _signer
    ) external {
        _bumpContractIndex();
        _bumpSignerIndex(_signer);
        _bumpAssetIndex(_contractAddress, _tokenId, _signer);
    }

    function verifyAssetIndex(
        address _contractAddress,
        uint256 _tokenId,
        address _signer,
        uint256 _index
    ) external view {
        _verifyAssetIndex(_contractAddress, _tokenId, _signer, _index);
    }
}
