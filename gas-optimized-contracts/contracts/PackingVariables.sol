// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract PackedVariables {
    uint128 a; // ┐
    uint128 b; // ┴─ Slot 0

    function readA() public view returns (uint256) {
        return a;
    }
}

contract NoPackedVariables {
    uint256 a; // └─ Slot 0
    uint256 b; // └─ Slot 1

    function readA() public view returns (uint256) {
        return a;
    }
}

