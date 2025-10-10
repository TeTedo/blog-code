// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "../solady/src/auth/Ownable.sol";
import {ERC20} from "../solady/src/tokens/ERC20.sol";
import {ReentrancyGuard} from "../solady/src/utils/ReentrancyGuard.sol";
import {SafeTransferLib} from "../solady/src/utils/SafeTransferLib.sol";
import {IPositionManager} from "../v4-periphery/src/interfaces/IPositionManager.sol";
import {IAllowanceTransfer} from "../v4-periphery/lib/permit2/src/interfaces/IAllowanceTransfer.sol";
import {IHooks} from "../v4-core/src/interfaces/IHooks.sol";
import {Currency} from "../v4-core/src/types/Currency.sol";
import {PoolKey} from "../v4-core/src/types/PoolKey.sol";
import {Actions} from "../v4-periphery/src/libraries/Actions.sol";
import {TickMath} from "../v4-core/src/libraries/TickMath.sol";
import {IUniswapV4Router04} from "../v4-router/src/interfaces/IUniswapV4Router04.sol";
import "./Interfaces.sol";

/// @title PunkStrategy - The Perpetual Punk Machine
/// @author TokenWorks (https://token.works/)
contract PunkStrategy is ERC20, Ownable, ReentrancyGuard {
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™                ™™™™™™™™™™™                ™™™™™™™™™™™ */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™               ™™™™™™™™™™™™™              ™™™™™™™™™™  */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™              ™™™™™™™™™™™™™              ™™™™™™™™™™™  */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™             ™™™™™™™™™™™™™™            ™™™™™™™™™™™   */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™            ™™™™™™™™™™™™™™™            ™™™™™™™™™™™   */
    /*                ™™™™™™™™™™™            ™™™™™™™™™™™           ™™™™™™™™™™™™™™™           ™™™™™™™™™™™    */
    /*                ™™™™™™™™™™™             ™™™™™™™™™™          ™™™™™™™™™™™™™™™™™          ™™™™™™™™™™™    */
    /*                ™™™™™™™™™™™             ™™™™™™™™™™          ™™™™™™™™™™™™™™™™™          ™™™™™™™™™™     */
    /*                ™™™™™™™™™™™              ™™™™™™™™™™        ™™™™™™™™™™™™™™™™™™™        ™™™™™™™™™™™     */
    /*                ™™™™™™™™™™™              ™™™™™™™™™™™       ™™™™™™™™™ ™™™™™™™™™       ™™™™™™™™™™™      */
    /*                ™™™™™™™™™™™               ™™™™™™™™™™      ™™™™™™™™™™ ™™™™™™™™™™      ™™™™™™™™™™™      */
    /*                ™™™™™™™™™™™               ™™™™™™™™™™      ™™™™™™™™™   ™™™™™™™™™      ™™™™™™™™™™       */
    /*                ™™™™™™™™™™™                ™™™™™™™™™™    ™™™™™™™™™™    ™™™™™™™™™    ™™™™™™™™™™        */
    /*                ™™™™™™™™™™™                 ™™™™™™™™™™   ™™™™™™™™™     ™™™™™™™™™™  ™™™™™™™™™™™        */
    /*                ™™™™™™™™™™™                 ™™™™™™™™™™  ™™™™™™™™™™     ™™™™™™™™™™  ™™™™™™™™™™         */
    /*                ™™™™™™™™™™™                  ™™™™™™™™™™™™™™™™™™™™       ™™™™™™™™™™™™™™™™™™™™          */
    /*                ™™™™™™™™™™™                   ™™™™™™™™™™™™™™™™™™         ™™™™™™™™™™™™™™™™™™           */
    /*                ™™™™™™™™™™™                   ™™™™™™™™™™™™™™™™™™         ™™™™™™™™™™™™™™™™™™           */
    /*                ™™™™™™™™™™™                    ™™™™™™™™™™™™™™™™           ™™™™™™™™™™™™™™™™            */
    /*                ™™™™™™™™™™™                     ™™™™™™™™™™™™™™             ™™™™™™™™™™™™™™             */
    /*                ™™™™™™™™™™™                     ™™™™™™™™™™™™™™             ™™™™™™™™™™™™™™             */
    /*                ™™™™™™™™™™™                      ™™™™™™™™™™™™               ™™™™™™™™™™™™              */


    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */
    /*                      CONSTANTS                      */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */
    
    IPositionManager private immutable posm;
    IAllowanceTransfer private immutable permit2;
    IUniswapV4Router04 private immutable router;

    address public hookAddress;
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e18;
    address payable constant PUNKS = payable(0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB);
    address public constant DEADADDRESS = 0x000000000000000000000000000000000000dEaD;

    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */
    /*                   STATE VARIABLES                   */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */

    bool public loadingLiquidity;
    uint256 public currentFees;
    uint256 public reward;
    uint256 public lastPunkSalePrice;
    uint256 public priceMultiplier;

    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */
    /*                    CUSTOM EVENTS                    */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */

    event ProtocolFeesFromSales(uint256 ethFees);

    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */
    /*                    CUSTOM ERRORS                    */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */

    error WrongEthAmount();
    error OnlyHook();
    error PunkNotForSale();
    error InsufficientContractBalance();
    error NoSaleToProcess();
    error PunkNotOwned();
    error InvalidMultiplier();
    error NoPunksBoughtYet();

    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */
    /*                     CONSTRUCTOR                     */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */
    /// @notice Initializes the contract with required addresses and permissions
    /// @param _owner Address that becomes the owner of the contract
    /// @param _posm Uniswap V4 position manager address 
    /// @param _permit2 Permit2 contract address
    constructor(
        address _owner,
        address _posm,
        address _permit2,
        address payable _router
    ) {
        permit2 = IAllowanceTransfer(_permit2);
        posm = IPositionManager(_posm);
        router = IUniswapV4Router04(_router);

        _initializeOwner(_owner);
        _mint(address(this), MAX_SUPPLY);
        
        reward = 0.01 ether; // 0.01e prize for calling mechanism functions
        priceMultiplier = 2000; // 2.0x in basis points
    }

    /// @notice Returns the name of the token
    /// @return The token name as a string
    function name() public pure override returns (string memory)   { 
        return "PunkStrategy"; 
    }

    /// @notice Returns the symbol of the token
    /// @return The token symbol as a string
    function symbol() public pure override returns (string memory) { 
        return "PNKSTR";     
    }

    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */
    /*                    ADMIN FUNCTIONS                  */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */

    /// @notice Loads initial liquidity into the pool and starts the game
    /// @param _hook Address of the PunkStrategyHook contract
    /// @dev Must send exactly 2 wei. Can only be called once by owner.
    function loadLiquidity(address _hook) external payable onlyOwner {
        if (msg.value != 2 wei) revert WrongEthAmount();
        hookAddress = _hook;
        _loadLiquidity(_hook);
    }

    /// @notice Emergency function to withdraw ETH
    /// @param _to Address to send ETH to
    /// @param _amount Amount of ETH to send
    /// @dev Only callable by owner
    function transferEther(
        address _to,
        uint256 _amount
    ) external payable onlyOwner {
        SafeTransferLib.forceSafeTransferETH(_to, _amount);
    }

    /// @notice Updates the reward amount for calling buyPunkAndRelist and processPunkSale
    /// @param _newReward New reward amount in wei
    /// @dev Only callable by owner
    function setReward(uint256 _newReward) external onlyOwner {
        reward = _newReward;
    }

    /// @notice Updates the price multiplier for relisting punks
    /// @param _newMultiplier New multiplier in basis points (1100 = 1.1x, 10000 = 10.0x)
    /// @dev Only callable by owner. Must be between 1.1x (1100) and 10.0x (10000)
    function setPriceMultiplier(uint256 _newMultiplier) external onlyOwner {
        if (_newMultiplier < 1100 || _newMultiplier > 10000) revert InvalidMultiplier();
        priceMultiplier = _newMultiplier;
    }

    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */
    /*                 MECHANISM FUNCTIONS                 */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */

    /// @notice Allows the hook (or the Owner) to deposit trading fees into the contract
    /// @dev Only callable by the hook contract or owner
    /// @dev Fees are added to currentFees balance
    function addFees() external payable {
        if (msg.sender != hookAddress && msg.sender != owner()) revert OnlyHook();
        currentFees += msg.value;
    }

    /// @notice Buys a punk from the market and relists it, paying a reward to the caller
    /// @param punkId The ID of the punk to buy and relist
    /// @dev Requires the punk to be for sale to anyone and sufficient fees (price + reward)
    function buyPunkAndRelist(uint256 punkId) external nonReentrant returns (uint256) {
        IPunks punksContract = IPunks(PUNKS);
        
        // Fetch punk offer details
        (bool isForSale, , , uint256 minValue, address onlySellTo) = punksContract.punksOfferedForSale(punkId);
        
        // Validate punk is for sale and available to anyone
        if (!isForSale) revert PunkNotForSale();
        if (onlySellTo != address(0)) revert PunkNotForSale();
        
        // Calculate required ETH (punk price + reward)
        uint256 totalRequired = minValue + reward;
        
        // Check currentFees has sufficient balance
        if (currentFees < totalRequired) revert InsufficientContractBalance();
        
        // Buy the punk
        punksContract.buyPunk{value: minValue}(punkId);

        // Make sure we own it
        if (punksContract.punkIndexToAddress(punkId) != address(this)) revert PunkNotOwned();
        
        // Relist the punk at the configured multiplier price
        punksContract.offerPunkForSale(punkId, minValue * priceMultiplier / 1000);
        
        // Send reward to caller
        SafeTransferLib.forceSafeTransferETH(msg.sender, reward);
        
        // Deduct spent fees from currentFees
        currentFees -= totalRequired;

        // If this is the first punk purchase, update hook state
        if (lastPunkSalePrice == 0) {
            IPunkStrategyHook(hookAddress).punksAreAccumulating();
        }

        // Set last sale price to the punk price
        lastPunkSalePrice = minValue;

        return lastPunkSalePrice;
    }

    /// @notice Processes a punk sale by checking for new ETH, rewarding caller, and burning tokens
    /// @dev Verifies excess ETH above currentFees matches a punk sale, rewards caller, burns tokens with remaining ETH
    /// @return The amount of ETH processed from the sale
    function processPunkSale() external nonReentrant returns (uint256) {
        if (lastPunkSalePrice == 0) revert NoPunksBoughtYet();

        // Calculate excess ETH in contract beyond currentFees
        uint256 excessEth = address(this).balance - currentFees;
        
        // Verify excess matches a punk sale
        if (excessEth <= lastPunkSalePrice) revert NoSaleToProcess();
        
        // Use remaining ETH to buy and burn tokens
        uint256 burnAmount = excessEth - reward;
        _buyAndBurnTokens(burnAmount);

        // Set fee cooldown on hook
        IPunkStrategyHook(hookAddress).feeCooldown();
        
        // Send reward to caller after burn completes
        SafeTransferLib.forceSafeTransferETH(msg.sender, reward);
        
        emit ProtocolFeesFromSales(excessEth);
        return excessEth;
    }

    /// @notice Checks if there is ETH from a punk sale
    /// @dev Returns true if excess ETH is less than or equal to the last punk sale price
    /// @return bool True if there is insufficient ETH, false otherwise
    function canProcessPunkSale() external view returns (bool) {
        uint256 excessEth = address(this).balance - currentFees;
        return excessEth > lastPunkSalePrice;
    }

    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */
    /*                  INTERNAL FUNCTIONS                 */
    /* ™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™™ */

    /// @notice Internal function to load liquidity into the Uniswap V4 pool
    /// @param _hook Address of the CabalcoinHook
    function _loadLiquidity(address _hook) internal {
        loadingLiquidity = true;

        // Create the pool with ETH (currency0) and TOKEN (currency1)
        Currency currency0 = Currency.wrap(address(0)); // ETH
        Currency currency1 = Currency.wrap(address(this)); // TOKEN

        uint24 lpFee = 0;
        int24 tickSpacing = 60;

        uint256 token0Amount = 1; // 1 wei
        uint256 token1Amount = 1_000_000_000 * 10**18; // 1B TOKEN

        // 10e18 ETH = 1_000_000_000e18 TOKEN 
        uint160 startingPrice = 501082896750095888663770159906816;

        int24 tickLower = TickMath.minUsableTick(tickSpacing);
        int24 tickUpper = int24(175020);

        PoolKey memory key = PoolKey(currency0, currency1, lpFee, tickSpacing, IHooks(_hook));
        bytes memory hookData = new bytes(0);

        // Hardcoded from LiquidityAmounts.getLiquidityForAmounts
        uint128 liquidity = 158372218983990412488087;

        uint256 amount0Max = token0Amount + 1 wei;
        uint256 amount1Max = token1Amount + 1 wei;

        (bytes memory actions, bytes[] memory mintParams) =
            _mintLiquidityParams(key, tickLower, tickUpper, liquidity, amount0Max, amount1Max, address(this), hookData);

        bytes[] memory params = new bytes[](2);

        params[0] = abi.encodeWithSelector(posm.initializePool.selector, key, startingPrice, hookData);

        params[1] = abi.encodeWithSelector(
            posm.modifyLiquidities.selector, abi.encode(actions, mintParams), block.timestamp + 60
        );

        uint256 valueToPass = amount0Max;
        permit2.approve(address(this), address(posm), type(uint160).max, type(uint48).max);

        posm.multicall{value: valueToPass}(params);

        loadingLiquidity = false;
    }

    /// @notice Creates parameters for minting liquidity in Uniswap V4
    function _mintLiquidityParams(
        PoolKey memory poolKey,
        int24 _tickLower,
        int24 _tickUpper,
        uint256 liquidity,
        uint256 amount0Max,
        uint256 amount1Max,
        address recipient,
        bytes memory hookData
    ) internal pure returns (bytes memory, bytes[] memory) {
        bytes memory actions = abi.encodePacked(uint8(Actions.MINT_POSITION), uint8(Actions.SETTLE_PAIR));

        bytes[] memory params = new bytes[](2);
        params[0] = abi.encode(poolKey, _tickLower, _tickUpper, liquidity, amount0Max, amount1Max, recipient, hookData);
        params[1] = abi.encode(poolKey.currency0, poolKey.currency1);
        return (actions, params);
    }

    /// @notice Buys tokens with ETH and burns them by sending to dead address
    /// @param amountIn The amount of ETH to spend on tokens that will be burned
    function _buyAndBurnTokens(uint256 amountIn) internal {
        PoolKey memory key = PoolKey(
            Currency.wrap(address(0)),
            Currency.wrap(address(this)),
            0,
            60,
            IHooks(hookAddress)
        );

        router.swapExactTokensForTokens{value: amountIn}(
            amountIn,
            0,
            true,
            key,
            "",
            DEADADDRESS,
            block.timestamp
        );
    }

    /// @notice Allows the contract to receive ETH
    receive() external payable {}
}
