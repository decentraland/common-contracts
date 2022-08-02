// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "../signatures/NonceVerifiable.sol";

contract DummyNonceVerifiableImplementator is NonceVerifiable {
    function initialize() external initializer {
        __NonceVerifiable_init();
    }

    function test__NonceVerifiable_init() external {
        __NonceVerifiable_init();
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
