// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Calldata {
    function calldataParameter(uint256[] calldata a) public pure returns (uint256[] calldata) {
        return a;
    }

    function memoryParameter(uint256[] memory a) public pure returns (uint256[] memory) {
        return a;
    }
}