// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "../signatures/ContractNonceVerifiable.sol";
import "../signatures/SignerNonceVerifiable.sol";
import "../signatures/AssetNonceVerifiable.sol";

contract DummyNonceVerifiableImplementor is ContractNonceVerifiable, SignerNonceVerifiable, AssetNonceVerifiable {
    function initialize() external initializer {
        __ContractNonceVerifiable_init();
    }

    function test__ContractNonceVerifiable_init() external {
        __ContractNonceVerifiable_init();
    }

    function verifyContractNonce(uint256 _nonce) external view {
        _verifyContractNonce(_nonce);
    }

    function verifySignerNonce(address _signer, uint256 _nonce) external view {
        _verifySignerNonce(_signer, _nonce);
    }

    function verifyAssetNonce(
        address _contractAddress,
        uint256 _tokenId,
        address _signer,
        uint256 _nonce
    ) external view {
        _verifyAssetNonce(_contractAddress, _tokenId, _signer, _nonce);
    }
}
