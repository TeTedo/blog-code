# cairo 시작해보기

모든 코드는 [깃허브](https://github.com/TeTedo/blog-code/tree/main/zk-start-cairo)에서 볼수 있습니다.

## 1. 설치

### starkup 설치 (Linux or MacOs)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.starkup.dev | sh
```

설치 후 확인

```bash
scarb --version
snforge --version
```

scarb 는 cairo 의 패키지 매니저라고 생각하면 된다.

## 2. Hello World

```bash
mkdir ./cairo_projects
cd ./cairo_projects
scarb new hello_world
```

Starknet Foundry (default) 선택

그러면 여러개의 파일이 설치된다.

그중 Scarb.toml 파일에 들어가보면 아래와 같다.

```toml
[package]
name = "hello_world"
version = "0.1.0"
edition = "2024_07"

# See more keys and their definitions at https://docs.swmansion.com/scarb/docs/reference/manifest.html

[dependencies]
starknet = "2.11.4"

[dev-dependencies]
snforge_std = "0.43.1"
assert_macros = "2.11.4"

[[target.starknet-contract]]
sierra = true

[scripts]
test = "snforge test"

[tool.scarb]
allow-prebuilt-plugins = ["snforge_std"]
```

```toml
[package]
name = "hello_world"
version = "0.1.0"
edition = "2024_07"
```

패키지에 대한 정보를 나타낸다.

패키지 이름, 사용할 Scarb의 버전, 프렐류드의 에디션이다.

프렐류드는 cairo 프로그램에 자동으로 임포트되는 가장 일반적으로 사용되는 것들의 모음이다. java의 starter 같은??

```toml
[dependencies]
starknet = "2.11.4"
```

의존성을 나열하는 섹션이다. cairo 에서는 크레이트(crate) 라고 부른다.

```toml
[dev-dependencies]
snforge_std = "0.43.1"
assert_macros = "2.11.4"
```

개발환경에서만 사용되는 의존성이다. nodejs 써본 사람이면 바로 이해 할듯.

```toml
[[target.starknet-contract]]
sierra = true
```

스마트 컨트랙트를 빌드하기 위한 설정

```toml
[scripts]
test = "snforge test"
```

[script] 섹션은 사용자 정의 스크립트를 정의할 수 있도록 한다.

다음과 같이 파일들을 바꿔주면 된다.

Scarb.toml

```toml
[package]
name = "hello_world"
version = "0.1.0"
edition = "2024_07"

[cairo]
enable-gas = false

[dependencies]
cairo_execute = "2.11.4"


[[target.executable]]
name = "hello_world_main"
function = "hello_world::hello_world::main"
```

src/lib.cairo

```cairo
mod hello_world;
```

```
touch ./src/hello_world.cairo
```

src/hello_world.cairo

```cairo
#[executable]
fn main() {
    println!("Hello, World!");
}
```

lib.cairo 안에 hell_world module 을 넣어준거라 생각하면 된다.

cairo 는 기본적으로 src 폴더 안에서 작성해야한다.

hello_world 경로로가서 빌드하면 target 폴더가 생성된다.

```bash
scarb build
```

실행해보면 execute 폴더가 생성된다.

```bash
scarb execute
```

터미널에 Hello World 가 프린트 된다. - 이력서에 기술스택 cairo 추가완

```bash
Hello, World!
```

## 3. 뜯어보기

터미널에 찍힌 Hello World 는 hell_world.cairo 에 있는 main fn 이다.

executable cairo program 에서는 main 함수를 실행한다고 한다.

main 함수는 파라미터도 없고 아무것도 반환하지 않는다.

그래서 최상단에 있는 #[executable] 이걸 지워봤는데 build 가 안된다.

다음은 macros 에 대해서 알아보자

```cairo
#[executable]
fn main() {
    println!("Hello, World!");
}
```

main 함수를 다시보면 println! 함수가 있다.

느낌표가 붙으면 일반함수가 아닌 inline macros 를 사용한다고 한다. - [매크로 종류 보러 가기](https://book.cairo-lang.org/ch12-05-macros.html)

추가로 마지막에 세미콜론(;) 찍는다고 한다.

## 4. 결론

```
scarb new
scarb build
scarb execute
```

언제나 그랬듯이 일단 코드부터 짜보고 이론적인걸 공부할거다..

## 레퍼런스

- [cairo start docs](https://book.cairo-lang.org/ch01-01-installation.html#installing-starkup-on-linux-or-macos)
