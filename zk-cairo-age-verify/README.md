# ZK [Cairo] - 나이 인증 회로 구현

모든 코드는 [깃허브](https://github.com/TeTedo/blog-code/tree/main/zk-cairo-age-verify)에서 볼수 있습니다.

## (0) 흐름

zk 에서 핵심은 내 나이를 밝히지 않고 20세 이상인걸 만족하는지 증명하는 것이다.

먼저 나이와 nonce(랜덤값)을 받아서 해시값(commitment)을 만든다.

이 해시값을 조건(20세)과 함께 해시값(zk-proof)을 만든다.

컨트랙트에서 commitment 와 조건(20) 으로 해시값을 만들어서 zk-proof와 비교한다.

- commitment는 공개될 값이므로 nonce가 없다면 dictionary attack 으로 내 나이를 알수 있다.

## (1) 세팅

```
scarb new prover
scarb new verfier
```

이제는 scarb new 가 어느정도 자연스러워졌다.

의도는 prover 에서 age, nonce, min_age를 받아 zk-proof, commitment를 만든다.

그 zk-proof, commitment를 verifier에서 검증하도록 하는것이다.

해시를 만드는 과정은 오프체인에서 이루어지고 검증은 온체인에서 하도록 하는것이 목표이다.

원래는 2개의 기능을 하나의 프로젝트에 담고 싶었지만 prover 는 오프체인에서 gas가 필요없고 verifier는 온체인으로 gas 가 필요하다.

아직 이러한 방법들이 생소해서 두개로 나누어서 진행했다. 하나의 프로젝트로 가능한지는 모르겠음

## (2) prover

prover 프로젝트 생성 후 모든 명령어는 prover 경로에서 실행한다.

```bash
cd prover
```

lib.cairo

```rust
use core::poseidon::PoseidonTrait;
use core::hash::HashStateTrait;

pub fn create_commitment(age: u32, nonce: felt252) -> felt252 {
    let mut state = PoseidonTrait::new();
    state = state.update(age.into());
    state = state.update(nonce);
    let commitment = state.finalize();

    commitment
}

pub fn generate_zk_proof(age: u32, nonce: felt252, min_age: u32, commitment: felt252) -> felt252 {
    if age < min_age {
        panic!("Age condition not satisfied");
    }

    let mut proof_state = PoseidonTrait::new();
    proof_state = proof_state.update(commitment);
    proof_state = proof_state.update(min_age.into());
    let zk_proof = proof_state.finalize();

    zk_proof
}

#[executable]
fn main(age: u32, min_age: u32, nonce: felt252) -> (felt252, felt252) {
    let commitment = create_commitment(age, nonce);
    let zk_proof = generate_zk_proof(age, nonce, min_age, commitment);

    println!("commitment: {}", commitment);
    println!("zk_proof: {}", zk_proof);

    (commitment, zk_proof)
}
```

Scarb.toml 은 로컬에서 오프체인으로 실행할것이므로 전에만든 prime number 의 toml 파일을 참고했다.

```toml
[package]
name = "prover"
version = "0.1.0"
edition = "2024_07"

[dependencies]
cairo_execute = "2.11.4"

[cairo]
enable-gas = false

[[target.executable]]
name = "main"
function = "prover::main"
```

build

```bash
scarb build
```

execute

```bash
scarb execute --print-program-output --arguments 25,20,12345
```

result

```bash
commitment: 2773162440671216239964217308338671978964196128669216495597811269554466628943
zk_proof: 3405247300715218403610915007102205477473161431843118660413475459999249699169
Program output:
-845340347994914973733105474756398126658911086662380204375280786581405391538
-213255487950912810086407775992864628149945783488478039559616596136622321312
Saving output to: target/execute/prover/execution1
```

print랑 output 이 달라도 당황하면 안된다. 난 매우 당황함

찾아보니 felt252 타입은 부호없는 unsigned 값이고 output 은 부호있는 signed integer 로 해석해서 그런다고 한다.

만약 나이가 최소나이보다 작다면 아예 실패한다.

```bash
scarb execute --print-program-output --arguments 18,20,54321
```

result

```bash
error: Panicked with "Age condition not satisfied".
```

## (3) verifier

verifier는 컨트랙트로 작성할거고 위에서 만든 zk_proof, commitment, age를 받아서 검증한다.

```
cd ../verifier
```

lib.cairo

```rust
#[starknet::interface]
pub trait IAgeVerifier<TContractState> {
    fn verify_zk_proof(
        ref self: TContractState,
        commitment: felt252,
        zk_proof: felt252,
        min_age: u32
    ) -> bool;
}

#[starknet::contract]
mod AgeVerifier {
    use core::poseidon::PoseidonTrait;
    use core::hash::HashStateTrait;

    #[storage]
    struct Storage {
    }

    #[abi(embed_v0)]
    impl AgeVerifierImpl of super::IAgeVerifier<ContractState> {
        fn verify_zk_proof(
            ref self: ContractState,
            commitment: felt252,
            zk_proof: felt252,
            min_age: u32
        ) -> bool {
            let mut proof_state = PoseidonTrait::new();
            proof_state = proof_state.update(commitment);
            proof_state = proof_state.update(min_age.into());
            let calculated_proof = proof_state.finalize();

            zk_proof == calculated_proof
        }
    }
}
```

### Local 배포

account 세팅 해주고 sncast.devnet 추가

declare (class hash 생성)

```bash
sncast --profile=devnet declare \
    --contract-name=AgeVerifier
```

result

```bash
[WARNING] Profile devnet does not exist in scarb, using 'release' profile.
command: declare
class_hash: 0x07889dd197fa9f08a61d5e7923d7d2d3fa3e6dda790055cc17665b4485ddd1ff
transaction_hash: 0x0584a3502bc2b44b0a28e2ce1654fe95bd2f3ed2bf092141a0197770b6d69153

To see declaration details, visit:
class: https://sepolia.starkscan.co/class/0x07889dd197fa9f08a61d5e7923d7d2d3fa3e6dda790055cc17665b4485ddd1ff
transaction: https://sepolia.starkscan.co/tx/0x0584a3502bc2b44b0a28e2ce1654fe95bd2f3ed2bf092141a0197770b6d69153
```

deploy

```bash
sncast --profile=devnet deploy \
    --class-hash=0x07889dd197fa9f08a61d5e7923d7d2d3fa3e6dda790055cc17665b4485ddd1ff \
    --salt=0
```

log

```bash
command: deploy
contract_address: 0x02b71035806970d86283b587ee1d614046d75895061a44d32785a1c26afb99e5
transaction_hash: 0x02a57fd86dfb4646107c71e68db35eeaf174764e4b9d4741c292c53621e1f5b1

To see deployment details, visit:
contract: https://sepolia.starkscan.co/contract/0x02b71035806970d86283b587ee1d614046d75895061a44d32785a1c26afb99e5
transaction: https://sepolia.starkscan.co/tx/0x02a57fd86dfb4646107c71e68db35eeaf174764e4b9d4741c292c53621e1f5b1
```

proof 검증 - 위에서 만든 commitment,zk-proof,나이조건(20) 을 넣어본다.

```bash
sncast --profile=devnet call \
    --contract-address=0x02b71035806970d86283b587ee1d614046d75895061a44d32785a1c26afb99e5 \
    --function=verify_zk_proof \
    --arguments 2773162440671216239964217308338671978964196128669216495597811269554466628943,3405247300715218403610915007102205477473161431843118660413475459999249699169,20
```

result

```bash
command: call
response: true
response_raw: [0x1]
```

그럼 나이조건을 19로 넣으면 어떻게 되나?

```bash
command: call
response: false
response_raw: [0x0]
```

20세 이상은 당연히 19세 이상인데 실패한다.

이것까지 만족시키게 짤수 있을까 고민해봐야겠다..

## 레퍼런스

- [포세이돈 해시](https://docs.cairo-lang.org/core/tmp/core-poseidon.html)

- [starknet cairo book](https://www.starknet.io/cairo-book/)
