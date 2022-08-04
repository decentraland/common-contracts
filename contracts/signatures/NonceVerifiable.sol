// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "../signatures/ContractNonceVerifiable.sol";
import "../signatures/SignerNonceVerifiable.sol";
import "../signatures/AssetNonceVerifiable.sol";

abstract contract NonceVerifiable is ContractNonceVerifiable, SignerNonceVerifiable, AssetNonceVerifiable {
    function __NonceVerifiable_init() internal onlyInitializing {
        __ContractNonceVerifiable_init();
    }

    function __NonceVerifiable_init_unchained() internal onlyInitializing {}
}
