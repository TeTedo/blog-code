// SPDX-License-Identifier: MIT

pragma solidity >=0.7.5;

import {PoolKey} from "../v4-core/src/types/PoolKey.sol";

interface IUniversalRouter {
    /// @notice Thrown when a required command has failed
    error ExecutionFailed(uint256 commandIndex, bytes message);

    /// @notice Thrown when attempting to send ETH directly to the contract
    error ETHNotAccepted();

    /// @notice Thrown when executing commands with an expired deadline
    error TransactionDeadlinePassed();

    /// @notice Thrown when attempting to execute commands and an incorrect number of inputs are provided
    error LengthMismatch();

    // @notice Thrown when an address that isn't WETH tries to send ETH to the router without calldata
    error InvalidEthSender();

    /// @notice Executes encoded commands along with provided inputs. Reverts if deadline has expired.
    /// @param commands A set of concatenated commands, each 1 byte in length
    /// @param inputs An array of byte strings containing abi encoded inputs for each command
    /// @param deadline The deadline by which the transaction must be executed
    function execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline) external payable;
}

struct ExactInputSingleParams {
    PoolKey poolKey;
    bool zeroForOne;
    uint128 amountIn;
    uint128 amountOutMinimum;
    bytes hookData;
}

interface IPunkStrategy {
    function loadingLiquidity() external view returns (bool);
    function owner() external view returns (address);
    function addFees() external payable;
}
interface IPunkStrategyHook {
    function feeCooldown() external;
    function punksAreAccumulating() external;
}

interface IFeeSplit { 
    function processDeposit() external payable;
}

struct Offer {
    bool isForSale;
    uint punkIndex;
    address seller;
    uint minValue;
    address onlySellTo;
}

interface IPunks {
    function buyPunk(uint punkIndex) external payable;
    function offerPunkForSale(uint punkIndex, uint minSalePriceInWei) external;
    function punksOfferedForSale(uint punkId) external view returns (bool isForSale, uint punkIndex, address seller, uint minValue, address onlySellTo);
    function balanceOf(address owner) external view returns (uint256);
    function punkIndexToAddress(uint punkIndex) external view returns (address);
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IValidRouter {
    function msgSender() external view returns (address);
}