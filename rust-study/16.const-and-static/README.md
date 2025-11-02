# Const and Static

const를 만들때는 타입을 명시해줘야 한다.

```rs
const NUMBER= 10;

fn main() {
    println!("NUMBER: {}", NUMBER);
}


error: missing type for `const` item
 --> 1.rs:1:13
  |
1 | const NUMBER= 10;
  |             ^ help: provide a type for the constant: `: i32`
```

그리고 대문자로 안쓰면 에러는 안뜨지만 대문자로 쓰라고 경고한다.

```rs
const number: i32 = 10;

fn main() {
    println!("NUMBER: {}", NUMBER);
}

warning: constant `number` should have an upper case name
 --> 1.rs:1:7
  |
1 | const number: i32 = 10;
  |       ^^^^^^
  |
  = note: `#[warn(non_upper_case_globals)]` on by default
help: convert the identifier to upper case
  |
1 - const number: i32 = 10;
1 + const NUMBER: i32 = 10;
```

static 이라는것도 있는데 const와 조금 다르다

const 는 값이 직접 복사되서 사용되고 static 은 고정된 메모리 주소에 값이 저장된다.

const는 값을 못바꾸지만 static 은 값을 바꿀수 있다.

```rs
static mut NUMBER: i32 = 10;

fn main () {
    unsafe {
        NUMBER = 20;
        println!("NUMBER: {}", NUMBER);
    }
}
```
