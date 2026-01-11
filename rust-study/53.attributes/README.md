# 53. Attributes

attribute - hints to the compiler

```rs
struct JustAStruct {}

fn main() {
    let some_char = 'a';
}
```

이걸 컴파일 하면 안쓰는 변수가 있다면서 waning이 뜬다.

```rs
#![allow(dead_code)]
#![allow(unused_variables)]

struct JustAStruct {}

fn main() {
    let some_char = 'a';
}
```

이렇게 하면 warning 이 사라진다. 느낌표는 전체에 적용한다는 의미이다.

cfg 를 이용해서 config 를 알려줄수도 있다.

```rs
#[cfg(target_os = "linux")]
fn do_something() {
    println!("I am running on Linux");
}

#[cfg(target_os = "windows")]
fn do_something() {
    println!("I am running on Windows");
}

#[cfg(target_os = "macos")]
fn do_something() {
    println!("I am running on macOS");
}

fn main() {
    do_something();
}
```

여기서 macos cfg가 없는데 macos 에서 빌드하면 컴파일 에러가 떴다.

#[test] attribute가 달린 function은 input, output 에 아무것도 들어가면 안된다.

```rs
#[test]
fn test_something() {
    assert!(true);
}

#[test]
#[should_panic]
fn test_something_should_panic() {
    assert!(false);
}

fn main() {
}
```

C 같이 만들어달라

## FFI (Foreign Function Interface)란?

**FFI**는 서로 다른 프로그래밍 언어 간에 함수를 호출할 수 있게 해주는 메커니즘입니다.

**용도:**

- Rust에서 C/C++ 라이브러리 사용
- C/C++에서 Rust 함수 호출
- 다른 언어와 상호 운용

**예시:**

```rs
// Rust에서 C 함수 호출
extern "C" {
    fn printf(format: *const u8, ...);
}

// C에서 Rust 함수 호출
#[no_mangle]
pub extern "C" fn rust_function(x: i32) -> i32 {
    x * 2
}
```

**필요한 속성들:**

- `#[repr(C)]`: 메모리 레이아웃을 C와 호환되게
- `#[no_mangle]`: 함수 이름을 그대로 유지
- `extern "C"`: C 호출 규약 사용

---

`#[repr(C)]`는 구조체의 메모리 레이아웃을 C 언어와 호환되도록 만듭니다.

**용도:**

- C 라이브러리와 상호 운용할 때
- FFI (Foreign Function Interface) 사용 시
- 메모리 레이아웃을 정확히 제어해야 할 때

**차이점:**

- Rust 기본: 필드 순서가 보장되지 않을 수 있음 (최적화)
- `#[repr(C)]`: C 언어처럼 필드가 선언 순서대로 메모리에 배치됨

```rs
#[repr(C)]
struct SomeStruct {
    name: String,
    number: u8,
    data: [u8; 1000]
}

fn main() {
    let my_struct = SomeStruct {
        name: String::from("my_name"),
        number: 10,
        data: [0; 1000]
    };
}
```

**주의:** `String` 같은 Rust 전용 타입은 C와 직접 호환되지 않습니다. FFI에서는 `*const c_char` 같은 C 호환 타입을 사용해야 합니다.

## `#[no_mangle]` - 이름 맹글링 방지

`#[no_mangle]`은 함수나 정적 변수의 이름을 맹글링(mangling)하지 않도록 합니다.

**맹글링이란?**

- 컴파일러가 함수 이름을 변형하는 것 (예: `add` → `_ZN3add17h1a2b3c4d5e6f7g8hE`)
- 오버로딩, 네임스페이스 등을 지원하기 위함
- 하지만 C 코드에서 호출할 수 없게 됨

**용도:**

- C 코드에서 Rust 함수를 호출할 때
- 동적 라이브러리에서 심볼을 노출할 때
- FFI 인터페이스 제공 시

**예시:**

```rs
#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}

// C 코드에서 이렇게 호출 가능:
// extern int add(int a, int b);
// int result = add(5, 3);
```

**`#[repr(C)]`와 함께 사용:**

```rs
#[repr(C)]
pub struct Point {
    x: i32,
    y: i32,
}

#[no_mangle]
pub extern "C" fn create_point(x: i32, y: i32) -> Point {
    Point { x, y }
}
```

**주의:**

- `pub extern "C"`와 함께 사용하는 것이 일반적
- C 호환 타입만 사용해야 함 (`String` 대신 `*const c_char` 등)
