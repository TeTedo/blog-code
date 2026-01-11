# 48. Closures in functions

Rust에서 클로저는 세 가지 트레이트로 분류됩니다: `Fn()`, `FnMut()`, `FnOnce()`. 이들은 클로저가 환경(외부 변수)을 어떻게 캡처하는지에 따라 구분됩니다.

## 클로저 트레이트 계층 구조

```
FnOnce()  ← 가장 제한적 (한 번만 호출 가능)
   ↑
FnMut()   ← 가변 참조로 환경 캡처 (여러 번 호출 가능)
   ↑
Fn()      ← 불변 참조로 환경 캡처 (여러 번 호출 가능, 가장 유연함)
```

## 1. `FnOnce()` - 소유권을 가져가는 클로저

**특징:**

- 클로저를 **한 번만** 호출할 수 있습니다.
- 환경 변수의 **소유권을 가져갑니다** (`move`).
- 클로저가 소비(consume)되므로 재사용할 수 없습니다.

**언제 사용되는가:**

- 클로저 내부에서 값을 소비하는 경우 (예: `drop`, `move`)
- `Option::map`, `Result::map` 등에서 값의 소유권을 가져가는 경우

**예시:**

```rs
fn main() {
    let my_string = String::from("Hello");

    // move 클로저: my_string의 소유권을 가져감
    let my_closure = move || {
        println!("{}", my_string);
        // my_string이 여기서 소비됨
    };

    my_closure();  // OK: 첫 번째 호출

    // my_closure();  // ❌ 에러: 이미 소비됨
    // println!("{}", my_string);  // ❌ 에러: 소유권이 클로저로 이동됨
}
```

**함수 파라미터로 사용:**

```rs
fn call_once<F>(closure: F)
where
    F: FnOnce() -> String,  // 한 번만 호출 가능
{
    let result = closure();
    println!("Result: {}", result);
    // closure();  // ❌ 에러: FnOnce는 한 번만 호출 가능
}

fn main() {
    let my_string = String::from("Hello");

    call_once(move || {
        my_string  // 소유권을 반환
    });
}
```

## 2. `FnMut()` - 가변 참조로 환경을 빌리는 클로저

**특징:**

- 클로저를 **여러 번** 호출할 수 있습니다.
- 환경 변수를 **가변 참조(`&mut`)**로 빌립니다.
- 클로저 내부에서 환경 변수를 수정할 수 있습니다.

**언제 사용되는가:**

- 클로저 내부에서 외부 변수를 수정해야 하는 경우
- `Iterator::for_each`, `Iterator::map` 등에서 상태를 변경하는 경우

**예시:**

```rs
fn main() {
    let mut counter = 0;

    // 가변 참조로 counter를 빌림
    let mut increment = || {
        counter += 1;  // counter를 수정
        println!("Counter: {}", counter);
    };

    increment();  // Counter: 1
    increment();  // Counter: 2
    increment();  // Counter: 3

    println!("Final counter: {}", counter);  // Final counter: 3
}
```

**함수 파라미터로 사용:**

```rs
fn call_mut<F>(mut closure: F)
where
    F: FnMut() -> i32,  // 여러 번 호출 가능, 가변 참조 필요
{
    println!("First call: {}", closure());
    println!("Second call: {}", closure());
    println!("Third call: {}", closure());
}

fn main() {
    let mut count = 0;

    call_mut(|| {
        count += 1;
        count
    });

    // 출력:
    // First call: 1
    // Second call: 2
    // Third call: 3
}
```

**`FnMut`이 필요한 경우:**

```rs
fn main() {
    let mut vec = vec![1, 2, 3, 4, 5];

    // for_each는 FnMut을 요구함 (각 요소를 처리하면서 상태 변경 가능)
    vec.iter_mut().for_each(|x| {
        *x *= 2;  // 각 요소를 2배로 증가
    });

    println!("{:?}", vec);  // [2, 4, 6, 8, 10]
}
```

## 3. `Fn()` - 불변 참조로 환경을 빌리는 클로저

**특징:**

- 클로저를 **여러 번** 호출할 수 있습니다.
- 환경 변수를 **불변 참조(`&`)**로 빌립니다.
- 클로저 내부에서 환경 변수를 읽기만 할 수 있습니다 (수정 불가).

**언제 사용되는가:**

- 클로저가 환경 변수를 읽기만 하는 경우
- 가장 일반적이고 유연한 클로저 타입

**예시:**

```rs
fn main() {
    let name = String::from("Rust");

    // 불변 참조로 name을 빌림
    let greet = || {
        println!("Hello, {}!", name);  // 읽기만 함
    };

    greet();  // Hello, Rust!
    greet();  // Hello, Rust!
    greet();  // Hello, Rust!

    println!("Name is still available: {}", name);  // OK: 소유권 유지
}
```

**함수 파라미터로 사용:**

```rs
fn call_multiple<F>(closure: F)
where
    F: Fn() -> (),  // 여러 번 호출 가능, 불변 참조만 필요
{
    closure();
    closure();
    closure();
}

fn main() {
    let message = String::from("Hello");

    call_multiple(|| {
        println!("{}", message);  // 읽기만 함
    });

    // 출력:
    // Hello
    // Hello
    // Hello
}
```

## 트레이트 간 관계

**자동 구현 규칙:**

- `Fn()`을 구현하는 클로저는 자동으로 `FnMut()`도 구현합니다.
- `FnMut()`을 구현하는 클로저는 자동으로 `FnOnce()`도 구현합니다.

```
Fn() → FnMut() → FnOnce()
```

**예시:**

```rs
fn main() {
    let x = 10;

    // Fn() 클로저
    let f = || println!("{}", x);

    // Fn()은 FnMut()도 구현
    fn takes_fnmut<F: FnMut()>(mut f: F) {
        f();
    }
    takes_fnmut(f);  // OK

    // FnMut()은 FnOnce()도 구현
    fn takes_fnonce<F: FnOnce()>(f: F) {
        f();
    }
    takes_fnonce(f);  // OK
}
```

## 실제 사용 예시

### `Option::map` - `FnOnce` 사용

```rs
fn main() {
    let some_string = Some(String::from("Hello"));

    // map은 FnOnce를 요구 (값의 소유권을 가져감)
    let result = some_string.map(|s| {
        s.len()  // s의 소유권을 가져감
    });

    println!("{:?}", result);  // Some(5)
    // println!("{:?}", some_string);  // ❌ 에러: 소유권이 이동됨
}
```

### `Iterator::map` - `FnMut` 사용

```rs
fn main() {
    let mut counter = 0;
    let numbers = vec![1, 2, 3, 4, 5];

    // map은 FnMut을 요구 (각 요소를 변환)
    let doubled: Vec<i32> = numbers
        .iter()
        .map(|&x| {
            counter += 1;  // 상태 변경
            x * 2
        })
        .collect();

    println!("{:?}", doubled);  // [2, 4, 6, 8, 10]
    println!("Counter: {}", counter);  // Counter: 5
}
```

### `Iterator::for_each` - `FnMut` 사용

```rs
fn main() {
    let mut sum = 0;
    let numbers = vec![1, 2, 3, 4, 5];

    // for_each는 FnMut을 요구
    numbers.iter().for_each(|&x| {
        sum += x;  // sum을 수정
    });

    println!("Sum: {}", sum);  // Sum: 15
}
```

### `thread::spawn` - `FnOnce` 사용

```rs
use std::thread;

fn main() {
    let data = vec![1, 2, 3, 4, 5];

    // thread::spawn은 FnOnce를 요구 (소유권을 스레드로 이동)
    let handle = thread::spawn(move || {
        println!("Data in thread: {:?}", data);
        // data의 소유권이 스레드로 이동됨
    });

    handle.join().unwrap();
    // println!("{:?}", data);  // ❌ 에러: 소유권이 스레드로 이동됨
}
```

## 선택 가이드

**어떤 트레이트를 사용해야 할까?**

1. **`Fn()`**:

   - 환경 변수를 읽기만 하는 경우
   - 가장 제한이 적고 유연함
   - 여러 번 호출 가능

2. **`FnMut()`**:

   - 환경 변수를 수정해야 하는 경우
   - 여러 번 호출 가능하지만 가변 참조 필요

3. **`FnOnce()`**:
   - 값을 소비해야 하는 경우
   - 한 번만 호출 가능
   - 가장 제한적이지만 필요할 때 사용

**함수 시그니처 작성 시:**

```rs
// 가능한 한 가장 제한이 적은 트레이트를 사용
fn process<F: Fn()>(f: F) {  // FnMut, FnOnce도 받을 수 있음
    f();
}

// 가변 참조가 필요한 경우에만 FnMut 사용
fn process_mut<F: FnMut()>(mut f: F) {
    f();
}

// 소유권이 필요한 경우에만 FnOnce 사용
fn process_once<F: FnOnce()>(f: F) {
    f();
}
```

## 요약

| 트레이트   | 호출 횟수 | 환경 캡처 방식     | 사용 시기          |
| ---------- | --------- | ------------------ | ------------------ |
| `Fn()`     | 여러 번   | 불변 참조 (`&`)    | 읽기만 하는 경우   |
| `FnMut()`  | 여러 번   | 가변 참조 (`&mut`) | 수정이 필요한 경우 |
| `FnOnce()` | 한 번     | 소유권 (`move`)    | 값을 소비하는 경우 |

**핵심 포인트:**

- `Fn()` ⊂ `FnMut()` ⊂ `FnOnce()` (포함 관계)
- 가능한 한 가장 제한이 적은 트레이트를 사용하세요
- 컴파일러가 자동으로 적절한 트레이트를 추론합니다
