# kaiascan은 token transfer 를 어떻게 처리할까

예시로 만든 컨트랙트는 [깃허브](https://github.com/TeTedo/blog-code/tree/main/kaia-token-transfer)에 있습니다.

메인넷 익스플로러에서 token에 대한 전송과정은 db에 저장해놓고 보여줘야 한다.

하지만 트랜잭션만 보고 토큰을 전송한건지 뭐한건지는 정확히 알수 없다. 추측은 가능할뿐..

카이아 코인도 몇개 있고 해서 카이아에서 테스트해보기로 결정했다.

그래서 카이아에서 토큰 트랜스퍼를 어떻게 감지하는가에 대한 테스트를 해보고 뇌피셜로 정리해보려고 한다.

여러가지 컨트랙트를 erc20에 기반하여 배포해보고 실제로 전송해보며 테스트를 진행했다.

## 1. Transfer event 다 제거해보고 배포

token 으로 아예 인식 안함

토큰전송을 해봐도 token transfer 에 기록이 안남는다.  
물론 balance 도 안찍힘

[https://kaiascan.io/address/0xa1e58444fa16cd98dad75e0dda8408f27a795090?tabId=txList&page=1](https://kaiascan.io/address/0xa1e58444fa16cd98dad75e0dda8408f27a795090?tabId=txList&page=1)

eip 20 에 대한 규격 참고링크

[https://eips.ethereum.org/EIPS/eip-20](https://eips.ethereum.org/EIPS/eip-20)

eip20 에서는 transfer 이벤트가 필수다.

그렇기 때문에 receipt 에서 구분할 수 있는 Transfer 이벤트를 활용하면 토큰인지 구분할수 있다.

## 2. Token Transfer Event 개떡같이 설정하고 배포

실제 토큰을 전송한 value \* 2 로 이벤트 생성

결과

token transfer 는 event 에 발생한 양으로 된다.  
근데 token balance 는 진짜 balance 로 찍힌다.

\-> token transfer 와 balance 의 연관관계는 없는듯 하다.

[https://kaiascan.io/token/0x900efd7a984ad25312866a3125e8e52965b5cfa2?tabId=tokenTransfer&page=1](https://kaiascan.io/token/0x900efd7a984ad25312866a3125e8e52965b5cfa2?tabId=tokenTransfer&page=1)

## 3. Fake Token Transfer

tranfer 이벤트만 발생시키고 실제론 balance 안바꿔주기

token transfer 는 나오지만 balance는 0으로 찍힌다.

\-> 2번과 마찬가지로 둘사이의 연관성은 없다.

[https://kaiascan.io/token/0x3a2f0d3195b61b7cb2556de2486d5692a700a4ba?tabId=tokenTransfer&page=1](https://kaiascan.io/token/0x3a2f0d3195b61b7cb2556de2486d5692a700a4ba?tabId=tokenTransfer&page=1)

## 4. 그럼 transfer 이벤트를 배포할때 감지가능??

배포할때 생기는 바이트코드에서 transfer 이벤트가 있는지 감지가능한가?

transfer 이벤트를 keccak 으로 해시후 바이트코드에 포함되어있는지 확인??

가능하다.

그럼 erc20에서 필수로 만들어야하는 메소드, 이벤트들은 컨트랙트가 배포될때 확인해볼수 있다.

## 5. ERC20 규격은 안따르지만 토큰처럼 생겼다면?

Transfer(address,address,uint256) 이벤트를 발생시키면서 totalSupply, balanceOf 함수가 있다면 토큰으로 간주한다.

대표적인 예시가 WKaia 이다.

Dex 에서 Wrapped coin 은 erc20 규격에 따르진 않지만 totalSupply 와 BalanceOf 를 가지고있다.

kaia -> Wkaia 로 바꿀때는 Transfer 이벤트가 발생되지 않는다. deposit 이벤트만 발생한다.

실제론 Wkaia의 balance가 올라갔지만 Transfer 이벤트는 발생하지 않기 때문에 erc20 규격은 만족하지 않는다.

하지만 Wkaia 로 다른 토큰과 스왑을 한다면 그때는 Transfer 이벤트를 발생시킨다.

이때 토큰으로 감지해서 Balance도 생긴다.

## 결론

- Transfer(address,address,uint256) 이벤트를 발생시키면서 totalSupply, balanceOf 함수가 있다면 토큰으로 간주한다.
- token transfer 는 이벤트에 의존한다. (이벤트의 값을 그대로 저장)
- token balance는 실제 컨트랙트에서 balanceOf 를 호출해온다.
