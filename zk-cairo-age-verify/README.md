# ZK [Cairo] - 나이 인증 회로 구현

모든 코드는 [깃허브](https://github.com/TeTedo/blog-code/tree/main/zk-cairo-age-verify)에서 볼수 있습니다.

## (1) 세팅

```
scarb new prover
scarb new verfier
```

이제는 scarb new 가 어느정도 자연스러워졌다.

의도는 prover 에서 age를 받아 해시를 만든다.

그 hash로 verifier 에서 검증하도록 하는것이다.

해시를 만드는 과정은 오프체인에서 이루어지고 검증은 온체인에서 하도록 하는것이 목표이다.

## (2) prover

prover 프로젝트 생성 후 모든 명령어는 prover 경로에서 실행한다.

lib.cairo

```rust
use core::hash::HashStateTrait;
use core::poseidon::PoseidonTrait;

fn hash_age(age: u32) -> felt252 {
    // Poseidon 해시 상태 생성
    let mut state = PoseidonTrait::new();

    // 입력값 업데이트 (여러 값도 가능)
    state = state.update(age.into());

    // 해시 결과 반환
    let hash = state.finalize();
    hash
}

#[executable]
fn main(age: u32) -> felt252 {
    let hash = hash_age(age);
    hash
}
```

Scarb.toml 은 로컬에서 오프체인으로 실행할것이므로 전에만든 prime number 의 toml 파일을 참고했다.

```toml
[package]
name = "prover"
version = "0.1.0"
edition = "2024_07"

[cairo]
enable-gas = false

[dependencies]
cairo_execute = "2.11.4"


[[target.executable]]
name = "main"
function = "prover::main"
```

build

```bash
scarb build
```

execute

20세이상을 검증할거라서 실패용, 성공용 두개를 뽑아놓자

```bash
scarb execute -p prover --print-program-output --arguments 17
scarb execute -p prover --print-program-output --arguments 25
```

result

```bash
Program output:
232028468659893328431530431200123794567556816519640147837747388392904102871
Saving output to: target/execute/prover/execution1

Program output:
1703974484303975850947838405686730269492888917288131882454909053058937709240
Saving output to: target/execute/prover/execution2
```

## (3) verfier

해시와 최소나이를 온체인에 넣으면 그 해시로 최소나이를 만족하는지가 필요하다.
