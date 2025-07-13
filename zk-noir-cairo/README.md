# ZK - noir, cairo 섞어쓰기

모든 코드는 [깃허브](https://github.com/TeTedo/blog-code/tree/main/zk-noir-cairo)에서 볼수 있습니다.

이전에 [ZK [Cairo] - 나이 인증 회로 구현](https://github.com/TeTedo/blog-code/tree/main/zk-cairo-age-verify) 에서 나이 인증 회로를 만들어봤다.

위 과정에선 굉장한 문제점이 있다.

zk proof 를 만들때 포세이돈 해시로 만드는데 이 과정만 알아버리면 누구든지 verify를 통과하는 proof를 만들수 있다는 것이다.

그래서 이 부분을 숨기고싶었다.

굉장히 많이 찾아봤지만 cairo 에서 proof를 만들고 온체인에서 verify를 하는걸 못 찾았다.

그래서 noir로 circuit을 짜고 proof를 만들어서 noir가 제공해주는 verifier를 통해서 구현해보고 싶었다.

## (1) Noir circuit

다시 보니 vscode 에는 noir 하이라이팅 익스텐션이 있는데 cursor 에는 없다.

예전에 했던 [ZK - Noir 시작해보기](https://github.com/TeTedo/blog-code/tree/main/zk-start-noir)를 참고해서 기억을 더듬어 해보기로 했다.

```bash
mkdir -p circuit/src
touch circuit/src/main.nr circuit/Nargo.toml
```

main.nr

```nr
fn main(age: u32, nonce: u32, min_age: pub u32) {
  assert(age >= min_age);
}
```

Nargo.toml

```
[package]
name = "circuit"
type = "bin"
```

circuit 폴더 들어가서 compile

```bash
cd circuit
nargo compile
```

## (2) verifier 만들기

먼저 [developer 환경설정](https://garaga.gitbook.io/garaga/installation) 에서 필요한 이것저것 설치해준다. python scarb 등등

그다음 bbup라는 cli를 설치해야 한다.

Barretenberg은 Aztec을 위한 ZK prover backend 라고 하는데 이걸위한 cli 라고한다. 나도 잘 모름

```bash
curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/refs/heads/master/barretenberg/bbup/install | bash
```

garaga 설치

```
pip3 install garaga==0.18.1
```

bb 설치

```
bbup --version 0.87.4-starknet.1
```

먼저 verify key 를 만든다.

```bash
bb write_vk --scheme ultra_honk --oracle_hash keccak -b target/circuit.json -o target
```

verifier 생성

```bash
garaga gen --system ultra_starknet_zk_honk --vk target/vk
```

프로젝트 이름을 넣으면 cairo로 된 코드가 자동 생성된다.

## (3) verifier 배포

### Local 배포

```bash
starknet-devnet --seed=0
```

verifier 경로로 이동 후 sfoundry.toml 에다가 계정정보 넣어두고

declare

```bash
sncast --profile=devnet declare \
    --contract-name=UltraStarknetZKHonkVerifier
```

result

```bash
command: declare
class_hash: 0x056792130b48aef444ce7c422421fec1299e5be2d4bc5460e62b8fe6c53dbced
transaction_hash: 0x03ed22efba77549ed3fb941fd511e36c5c62036f95c7d07dbafa5b556d56b3c2
```

deploy

```bash
sncast --profile=devnet deploy \
    --class-hash=0x056792130b48aef444ce7c422421fec1299e5be2d4bc5460e62b8fe6c53dbced \
    --salt=0
```

result

```bash
command: deploy
contract_address: 0x008e314294aa3362b8d8add557e95e93b28513c4f904a87cab4c25497f843576
transaction_hash: 0x01aaa33c8001d94971cf8908ec0e5566b0cf0a374ef2cb7d9fa84dad45f6ff27
```

## (4) proof 만들기

circuit 폴더로 돌아가서 Prover.toml 파일을 만들어서 witness 를 만들고 witness로 proof를 만들어줄것이다.

Prover.toml

```toml
age = 25
min_age = 20
```

witness 생성

```bash
nargo execute witness
```

proof 생성

```bash
bb prove -s ultra_honk --oracle_hash starknet --zk -b target/circuit.json -w target/witness.gz -o target/
```

## (5) proof 검증

cli 검증

call data 생성

```bash
garaga calldata --system ultra_starknet_zk_honk --proof target/proof --vk target/vk --public-inputs target/public_inputs > ../verifier/calldata.text
```

매우긴 call data 가 생성된다.

contract 검증

verifier 쪽으로 폴더 이동후 실행한다.

```bash
sncast --profile=devnet call \
    --contract-address=0x008e314294aa3362b8d8add557e95e93b28513c4f904a87cab4c25497f843576 \
    --function=verify_ultra_starknet_zk_honk_proof \
    --calldata $(cat calldata.txt)
```

result

```bash
command: call
response: [0x0, 0x1, 0x14, 0x0]
```

contract 에 있는 주석을 보면 성공했을때 public input 을 return 한다고 한다. 실패시 반환 안한다고함.

3번째 인자로 public input인 20이 나왔다.

```rust
// This function returns an Option for the public inputs if the proof is valid.
// If the proof is invalid, the execution will either fail or return None.
0x0 (0): 첫 번째 public input (시작 인덱스)
0x1 (1): 성공 플래그 또는 상태 값
0x14 (20): min_age = 20 - 우리가 설정한 최소 나이
0x0 (0): 마지막 public input (종료 인덱스)
```

번외로 circuit 에 만족하지 않으면 witness 가 생성이 안된다.

```bash
error: Failed constraint
  ┌─ src/main.nr:2:10
  │
2 │   assert(age >= min_age);
  │          --------------
  │
  = Call stack:
    1. src/main.nr:2:10

Failed to solve program: 'Cannot satisfy constraint'
```

## 레퍼런스

- [Noir Verifier](https://garaga.gitbook.io/garaga/smart-contract-generators/noir)

- [BBup README](https://github.com/AztecProtocol/aztec-packages/blob/master/barretenberg/bbup/README.md)
