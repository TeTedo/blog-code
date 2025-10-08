# PNKSTR 토큰 분석

uniswap v4 hook 을 사용한 아주 재밌는 토큰을 봐서 분석을 해보려고 한다.

토큰을 사면 수수료 10프로를 때고 그중 8프로를 모아 크립토펑크 nft를 산 후 1.2배로 다시 리스팅 후 팔리면 토큰을 바이백 소각 하는것이다.

토큰 구매 -> 수수료 10% -> 수수료 8% 모음 -> 크립토 펑크 nft 구매 -> 구매한 가격의 1.2배로 다시 리스팅 -> 팔리면 토큰 바이백 후 소각

contract address : 0xc50673EDb3A7b94E8CAD8a7d4E0cD68864E33eDF

## 1. constructor

```solidity
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
