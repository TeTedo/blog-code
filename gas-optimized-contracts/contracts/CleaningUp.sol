// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CreateContract {
    constructor() {
    }
}

contract CleaningUpContract {
    constructor(address _owner) {
        selfdestruct(payable(_owner));
    }
}

contract CleaningUpStorage {
    mapping(uint256 => address) kittenOwner;
    mapping(uint256 => string) kittenName;

    mapping(uint256 => address) catOwner;
    mapping(uint256 => string) catName;

    function setKitten(uint256 id, address owner, string memory name) public {
        kittenOwner[id] = owner;
        kittenName[id] = name;
    }

    function evolveKitten(uint256 id) public {
        catOwner[id] = kittenOwner[id];
        catName[id] = kittenName[id]; // Accessing storage incurs X gas
        delete kittenOwner[id];
        delete kittenName[id]; // Deleting storage refunds Y gas
    }

    function evolveKitten2(uint256 id) public {
        catOwner[id] = kittenOwner[id];
        catName[id] = kittenName[id]; // Accessing storage incurs X gas
        delete kittenOwner[id];
    }
}

contract CleaningUpStorage2 {
    mapping(uint256 => address) kittenOwner;
    mapping(uint256 => string) kittenName;

    mapping(uint256 => address) catOwner;
    mapping(uint256 => string) catName;

    function setKitten(uint256 id, address owner, string memory name) public {
        kittenOwner[id] = owner;
        kittenName[id] = name;
    }

    function evolveKitten(uint256 id) public {
        catOwner[id] = kittenOwner[id];
        catName[id] = kittenName[id]; // Accessing storage incurs X gas
        delete kittenOwner[id];
        delete kittenName[id]; // Deleting storage refunds Y gas
    }

    function evolveKitten2(uint256 id) public {
        catOwner[id] = kittenOwner[id];
        delete kittenOwner[id];
    }
}