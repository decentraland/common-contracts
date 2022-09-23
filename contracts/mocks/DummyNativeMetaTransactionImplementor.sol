// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "../meta-transactions/NativeMetaTransaction.sol";

contract DummyNativeMetaTransactionImplementor is NativeMetaTransaction {
    uint256 public counter;
    address public increaseCounterCaller;

    function initialize() external initializer {
        __NativeMetaTransaction_init("DummyNativeMetaTransactionImplementor", "1");
    }

    function test__NativeMetaTransaction_init() external {
        __NativeMetaTransaction_init("DummyNativeMetaTransactionImplementor", "1");
    }

    function getNameAndVersionHash() external view returns (bytes32, bytes32) {
        return (_EIP712NameHash(), _EIP712VersionHash());
    }

    function increaseCounter(uint256 _amount) external {
        increaseCounterCaller = _getMsgSender();
        counter += _amount;
    }

    function sum(uint256 _a, uint256 _b) external pure returns (uint256) {
        return _a + _b;
    }

    function functionThatReverts() external pure {
        revert("ALWAYS_REVERTING_NEVER_INREVERTING");
    }

    function functionThatRevertsSilently() external pure {
        revert();
    }
}
