# PNKSTR 토큰 분석

uniswap v4 hook 을 사용한 아주 재밌는 토큰을 봐서 분석을 해보려고 한다.

토큰을 사면 수수료 10프로를 때고 그중 8프로를 모아 크립토펑크 nft를 산 후 1.2배로 다시 리스팅 후 팔리면 토큰을 바이백 소각 하는것이다.

토큰 구매 -> 수수료 10% -> 수수료 8% 모음 -> 크립토 펑크 nft 구매 -> 구매한 가격의 1.2배로 다시 리스팅 -> 팔리면 토큰 바이백 후 소각

contract address : 0xc50673EDb3A7b94E8CAD8a7d4E0cD68864E33eDF

## 1. constructor

```solidity
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
```

params

```
Arg [0] : _owner (address): 0xA679eBF81b9C90a07A0dFE5A4014ad2bbF10d81C
Arg [1] : _posm (address): 0xbD216513d74C8cf14cf4747E6AaA6420FF64ee9e
Arg [2] : _permit2 (address): 0x000000000022D473030F116dDEE9F6B43aC78BA3
Arg [3] : _router (address): 0x00000000000044a361Ae3cAc094c9D1b14Eece97
```

생성자에선 기본적인 설정들을 세팅해준다.

[유니스왑 v4 프로젝트 설정 공식문서](https://docs.uniswap.org/contracts/v4/quickstart/swap#step-1-set-up-the-project) 참고

## 2. loadLiquidity

컨트랙트가 생성된 후 제일먼저 호출된 함수이다.

초기에 유동성을 공급하는 함수다.

```solidity
/// @notice Loads initial liquidity into the pool and starts the game
/// @param _hook Address of the PunkStrategyHook contract
/// @dev Must send exactly 2 wei. Can only be called once by owner.
function loadLiquidity(address _hook) external payable onlyOwner {
    if (msg.value != 2 wei) revert WrongEthAmount();
    hookAddress = _hook;
    _loadLiquidity(_hook);
}

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
```

params

```
Function: loadLiquidity(address _hook)

MethodID: 0xcc8c4fa7
[0]:  000000000000000000000000faaad5b731f52cdc9746f2414c823eca9b06e844
```

유니스왑 v4 의 pool 을 만들고 유동성을 공급하는 코드이다.

특별히 하드코딩된 값들이 보이긴 하지만 일단 넘긴다. 잘 모르겠다...

gpt는 1wei 와 10억 토큰 사이의 유동성 관련된 값이라고 설명해준다.

여기서 [훅 컨트랙트](https://etherscan.io/address/0xfaaad5b731f52cdc9746f2414c823eca9b06e844)의 코드는 정확히 찾지 못했다.

## 3. addFees

이 토큰을 구매할때마다 10%의 수수료가 든다. 이 수수료는 8:2 비율로 나눠서 보내진다.

[참고 트랜잭션](https://etherscan.io/tx/0xfd29de5940f094df3bf40a3ac5b164295dc1dd47b86f0d681f404affe19904e4)

(1) uniswap v4 router -> uniswap v4 pool manager

(2) uniswap v4 pool manager -> 훅

(3-1) 훅 -> PNKSTR (AddFees)

(3-2) 훅 -> [다른 컨트랙트](https://etherscan.io/address/0x16c3c5670a64223e48b9932fd971eeaaa5613548) (Process Deposit)

훅에서 8 : 2 비율로 PNKSTR의 AddFees 를 호출하고 [다른 컨트랙트](https://etherscan.io/address/0x16c3c5670a64223e48b9932fd971eeaaa5613548)의 Process Deposit 함수를 호출한다.

이 컨트랙트의 훅은 못찾았지만 다른 nft strategy 토큰의 훅은 [훅랭크](https://hookrank.io/1/0xe3c63a9813ac03be0e8618b627cb8170cfa468c4/liquidity-pools)에 등록되어있었다.

## 4. buyPunkAndRelist

```solidity
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
```

[크립토 펑크 컨트랙트](https://etherscan.io/address/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb)는 특이하게 erc20 으로 되어있다.

buyPunkAndRelist 로직을 보면 크립토 펑크를 사서 priceMultiplier 배수 만큼 리스팅을 다시 올린다.

그리고 재밌는건 이 함수를 호출한 사람에게 reward(0.01eth)를 챙겨주는데 스케줄러를 쓰지 않고 리워드를 먹고 싶으면 호출해라 라고 보인다.

하지만 실제로 이 컨트랙트의 이 함수가 쓰이지 않는걸로 보인다.

[최근 펑크를 구매한 트랜잭션](https://etherscan.io/tx/0xd6a7f155f4fb5ac37d390a2fbdf46c9b6df76a0554d2985f0fe356342c3a8613)을 보면 [특정 컨트랙트](https://etherscan.io/address/0x6ec1b656f9ea50c89827c7e820c303a6039550e3)에서 어떤 함수를 실행하면 PNKSTR 컨트랙트에서 비용을 지불하고  
[크립토 펑크를 가지고 있는 컨트랙트](https://etherscan.io/address/0x1244eae9fa2c064453b5f605d708c0a0bfba4838)로 크립토 펑크가 이동된다.

트랜잭션 기록을 살펴보면 buyPunkAndRelist 호출이 실패한 트랜잭션을 볼수 있다.

그래서 다른 컨트랙트를 이용해서 디버깅을 한것으로 생각된다.

개인적인 추측으론

```solidity
if (lastPunkSalePrice == 0) {
    IPunkStrategyHook(hookAddress).punksAreAccumulating();
}
```

이 부분에서 훅에 문제가 있지 않을까 추측된다.

## 5. processPunkSale

```solidity
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
```

바이백을 하는 코드로 보이는데 이 코드를 보면 의아한 부분이 있다.

왜 실제 팔린 펑크의 가격이 아니라 lastPunkSalePrice를 이용해서 바이백을 하는건지가 물음표다.

실제론 buyPunkAndRelist 함수가 실행되지 않아서 lastPunkSalePrice 는 0이기 때문에 실행되지 않긴 한다.

실제 [바이백 트랜잭션](https://etherscan.io/tx/0x8625888f5e018a62e2b5e0e4bd32cb0477213e409f27184f40c21cd447589bd0)을 보면 크립토 펑크를 가지고 있는 컨트랙트에서 호출하는데 거의 1블록 주기마다 1이더씩 바이백을 한다.

그럼 바이백을 시작하기전에 토큰을 구매해놓고 바이백이 끝나면 팔면 되지 않을까 라는 생각도 해보지만 사고 팔때 수수료가 10%이기 때문에 계산을 잘해야 될듯 싶다.

## 6. 후기

어떤 컨트랙트를 이더스캔까지 뒤져보며 본건 거의 처음이다.

재밌는 메커니즘을 보면서 인사이트도 얻었고 다른 컨트랙트 분석도 계속 해보려고 한다.

실제 컨트랙트의 코드가 쓰이지 않고 다른 비공개 코드의 컨트랙트가 쓰이고 있어서 분석하기 어려웠다.

다음은 nft strategy 를 분석해보려고 한다. 이건 hook 코드도 공개되어있기 때문에 훨씬 분석하기 편하겠지라는 생각이다.
