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

## 레퍼런스

- [Noir Verifier](https://garaga.gitbook.io/garaga/smart-contract-generators/noir)

- [BBup README](https://github.com/AztecProtocol/aztec-packages/blob/master/barretenberg/bbup/README.md)
