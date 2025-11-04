// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ArithmeticTrick {
    function bitwiseAdd(uint256 a) public pure returns (uint256) {
        return a << 1;
    }

    function arithmeticAdd(uint256 a) public pure returns (uint256) {
        return a * 2;
    }
}