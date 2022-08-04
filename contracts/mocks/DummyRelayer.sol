// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./DummyNativeMetaTransactionImplementor.sol";

contract DummyRelayer {
    DummyNativeMetaTransactionImplementor nmtImplementor;

    bytes public data;

    constructor(DummyNativeMetaTransactionImplementor _nmtImplementor) {
        nmtImplementor = _nmtImplementor;
    }

    function executeAndStoreMetaTransactionResult(
        address _userAddress,
        bytes memory _functionData,
        bytes memory _signature
    ) external {
        data = nmtImplementor.executeMetaTransaction(_userAddress, _functionData, _signature);
    }
}
