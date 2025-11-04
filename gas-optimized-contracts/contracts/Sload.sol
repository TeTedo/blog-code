// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Sload {
    uint256 public stateVariable;

    function unoptimized(uint256 interation) public {
        for (uint256 i = 0; i < interation; i++) {
            stateVariable += i;
        }
    }

    function optimized(uint256 interation) public {
        uint256 cache = stateVariable;
        for (uint256 i = 0; i < interation; i++) {
            cache += i;
        }

        stateVariable = cache;
    }
}