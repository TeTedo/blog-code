# ZK - Cairo 로 Prime Number(소수) 증명하기

[ZK- Cairo 시작해보기](https://github.com/TeTedo/blog-code/tree/main/zk-start-cairo)에 이어 2번째 cairo tutorial 이다.

모든 코드는 [깃허브](https://github.com/TeTedo/blog-code/tree/main/zk-start-cairo)에서 볼수 있습니다.

## 1. 세팅

```bash
scarb new prime_prover
cd prime_prover
```

Scarb.toml

executable 하게 만들어야 증명할수 있으므로 dependency 추가해준다.

```toml
[package]
name = "prime_prover"
version = "0.1.0"
edition = "2024_07"

[cairo]
enable-gas = false

[dependencies]
cairo_execute = "2.11.4"


[[target.executable]]
name = "main"
function = "prime_prover::main"
```

설명

```toml
[cairo]
enable-gas = false
```

Starknet이 아닌 로컬에서 실행할거기 때문에 비활성화

```toml
[[target.executable]]
name = "main"
function = "prime_prover::main"
```

이 설정은 패키지를 실행파일(executable binary)로 컴파일하겠다는 의미이다.

`name = "main"` : 생성되는 실행파일이름이 main 으로 만든다.

`function = "prime_prover::main"` : 프로그램의 진입점(entry point)이 prime_prover 모듈의 main 함수이다.

src/lib.cairo

```rust
/// Checks if a number is prime
///
/// # Arguments
///
/// * `n` - The number to check
///
/// # Returns
///
/// * `true` if the number is prime
/// * `false` if the number is not prime
fn is_prime(n: u32) -> bool {
    if n <= 1 {
        return false;
    }
    if n == 2 {
        return true;
    }
    if n % 2 == 0 {
        return false;
    }
    let mut i = 3;
    let mut is_prime = true;
    loop {
        if i * i > n {
            break;
        }
        if n % i == 0 {
            is_prime = false;
            break;
        }
        i += 2;
    }
    is_prime
}

// Executable entry point
#[executable]
fn main(input: u32) -> bool {
    is_prime(input)
}
```

is_prime function 은 32bit integer를 받아 bool 을 return 하는 함수이다.

제일아래 is_prime 처럼 세미콜론을 붙이지 않으면 그걸 return 한다고 한다. rust 랑 비슷하다고 함.

## 2. 테스트

```bash
scarb execute -p prime_prover --print-program-output --arguments 17
```

-p : 패키지 이름 - main 에서 정한 이름이다.

--print-program-output : 결과를 print 한다는말

--arguments : 17을 input 으로 넣겠다는 말

결과

```
1
```

달랑 1이 찍힌다. true 를 기대한 나에게 실망..

다른것도 테스트 해보자

```bash
scarb execute -p prime_prover --print-program-output --arguments 4
```

```
0
```

예상대로 0이 찍힌다.

## 3. zk-proof 만들기

zk proof를 만드는건 input 을 드러내지 않고 소수가 맞는지 확인하기 위한 방법이다.

아까 테스트를 하면서 2번을 execute 해봤다. 그럼 target/execute/prime_prover/execution1 폴더가 생겨있을것이다.

```bash
scarb prove --execution-id 1
```

log

```bash
warn: soundness of proof is not yet guaranteed by Stwo, use at your own risk
Saving proof to: target/execute/prime_prover/execution1/proof/proof.json
```

cairo 2.1 부터 Stwo prover 랑 통합됐다고 한다.

실행시키면 target/execute/prime_prover/execution1/proof/proof.json 파일이 생긴다.

```json
{"claim":{"public_data":{"public_memory":[[1,0,[2147450879,67600385,0,0,0,0,0,0]],[2,1,[2,0,0,0,0,0,0,0]],[3,2,[2147581952,285507585,0,0,0,0,0,0]],[4,3,[4,0,0,0,0,0,0,0]],[5,4,[2147450879,17268737,0,0,0,0,0,0]],[6,5,[0,0,0,0,0,0,0,0]],[7,6,[2147450880,1208647677,0,0,0,0,0,0]],[8,7,[2147450882,1208647676,0,0,0,0,0,0]],[9,7,[2147450882,1208647676,0,0,0,0,0,0]],[10,0,[2147450879,67600385,0,0,0,0,0,0]],[11,1,[2,0,0,0,0,0,0,0]],[12,2,[2147581952,28550 .........
```

이런식으로 겁나 길다.

증명을 만들었으면 검증을 해봐야지

```bash
scarb verify --execution-id 1
```

log

```bash
scarb verify --execution-id 1
   Verifying prime_prover
    Verified proof successfully
```

증명 성공. 그럼 proof를 안만들었던 2를 검증해보면..?

```bash
error: proof file does not exist at path: {작고 소중한 내 경로}/proof.json
help: run `scarb prove --execution-id=2` first
```

증명을 먼저 만들라고 한다. 증명이 없으니 검증할게 없는게 맞긴 하지.

## 4. 에러 throw?

lib.cairo

```rust
fn is_prime(n: u128) -> bool {
    if n <= 1 {
        return false;
    }
    if n == 2 {
        return true;
    }
    if n % 2 == 0 {
        return false;
    }
    let mut i = 3;
    let mut is_prime = true;
    loop {
        if i * i > n {
            break;
        }
        if n % i == 0 {
            is_prime = false;
            break;
        }
        i += 2;
    }
    is_prime
}

#[executable]
fn main(input: u128) -> bool {
    if input > 1000000 { // Arbitrary limit for demo purposes
        panic!("Input too large, must be <= 1,000,000");
    }
    is_prime(input)
}
```

input 을 u128로 바꾸고 1000000 보다 크다면 panic 이란 macro를 사용했다.

에러를 throw 하는것으로 추측; 백만보다 큰수를 넣어보자

```bash
scarb execute -p prime_prover --print-program-output --arguments 1000001
```

log

```bash
Compiling prime_prover v0.1.0 (경로/blog-code/zk-cairo-prime-number/prime_prover/Scarb.toml)
    Finished `dev` profile target(s) in 4 seconds
   Executing prime_prover
error: Panicked with "Input too large, must be <= 1,000,000".
```

## 결론

일단 cairo 와 rust 문법이 비슷하다고 한다. 본인 rust도 모름

저번엔 그냥 build 하고 execute 해봤다.

이번엔 proof 를 만들고 검증까지 해봤다. 걍 별거 아닌데?? 라는 생각

언어 새로배울때 hello world 찍어보고 음 쉽군 하는거랑 똑같은 느낌인가..

근데 이걸 어떻게 배포하는거지.. 다음에 해볼것
