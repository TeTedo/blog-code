# 43. Cow

**Cow**는 "Clone on Write"의 약자로, 필요할 때만 복사하는 스마트 포인터입니다.

## Cow란?

`Cow<'a, B>`는 두 가지 상태를 가질 수 있는 열거형입니다:

- **`Borrowed(&'a B)`**: 빌린 데이터 (참조)
- **`Owned(B::Owned)`**: 소유한 데이터 (복사본)

**핵심 아이디어:**

- 읽기만 하면 빌린 데이터를 사용 (복사 없음)
- 수정이 필요하면 그때 복사 (lazy cloning)

## 기본 사용법

### 예시 1: Borrowed vs Owned

```rs
use std::borrow::Cow;

fn module_3(input: u8) -> Cow<'static, str> {
    match input % 3 {
        0 => "Remainder is 0".into(),  // Borrowed: 정적 문자열
        1 => "Remainder is 1".into(),  // Borrowed: 정적 문자열
        remainder => format!("Remainder is {remainder}").into()  // Owned: 새로 생성
    }
}

fn main() {
    for number in 1..=6 {
        match module_3(number) {
            Cow::Borrowed(s) => println!("Borrowed: {s}"),  // 복사 없음
            Cow::Owned(s) => println!("Owned: {s}"),       // 복사 발생
        }
    }
}
```

**출력:**

```
Borrowed: Remainder is 1
Borrowed: Remainder is 2
Owned: Remainder is 0
Borrowed: Remainder is 1
Borrowed: Remainder is 2
Owned: Remainder is 0
```

**설명:**

- `"Remainder is 0"` 같은 정적 문자열은 `Borrowed`로 반환 (복사 없음)
- `format!()`로 생성한 문자열은 `Owned`로 반환 (새로운 `String` 생성)
- 불필요한 복사를 피할 수 있음

### 예시 2: `to_owned()` 메서드

```rs
fn main() {
    let my_string = "Hello there".to_owned();

    let string_1 = String::from("Hello there");
    let string_2 = "Hello there".to_string(); // Display trait
    let string_3: String = "hello there".into(); // From trait
    let string_4 = "Hello there".to_owned(); // ToOwned trait
}
```

**`to_owned()`의 의미:**

- `&str` → `String`으로 변환 (빌린 데이터 → 소유한 데이터)
- `ToOwned` 트레이트의 메서드
- `Cow`에서 `Borrowed`를 `Owned`로 변환할 때 사용

**다양한 문자열 생성 방법:**

- `String::from()`: `From` 트레이트 사용
- `to_string()`: `Display` 트레이트 사용
- `into()`: `From` 트레이트 사용 (타입 추론 필요)
- `to_owned()`: `ToOwned` 트레이트 사용

## Cow를 사용하지 않는 경우

```rs
struct User {
    name: String
}

impl User {
    fn new(input: &str) -> Self {
        Self {
            name: input.to_string()  // 항상 복사 발생
        }
    }
}

fn main() {
    let name_1 = "User 1";
    let name_2 = "User 2".to_string();

    let my_user = User::new(name_1);      // 복사 발생
    let my_user_2 = User::new(&name_2);   // 복사 발생
}
```

**문제점:**

- 정적 문자열(`&str`)을 받아도 항상 `String`으로 복사
- 이미 `String`을 가지고 있어도 다시 복사
- 불필요한 메모리 할당 발생

## Cow를 사용하는 경우

```rs
use std::borrow::Cow;

#[derive(Debug)]
struct User<'a> {
    name: Cow<'a, str>
}

impl<'a> User<'a> {
    fn is_borrowed(&self) {
        match &self.name {
            Cow::Borrowed(name) => println!("User name is borrowed: {name}"),
            Cow::Owned(name) => println!("User name is owned: {name}"),
        }
    }
}

fn main() {
    // 정적 문자열: Borrowed (복사 없음)
    let user_1 = User {
        name: "User 1".into()  // reference를 그대로 사용
    };

    // String: Owned (소유권 가져옴)
    let user_2 = User {
        name: "User 2".to_string().into()  // String의 소유권을 가져옴
    };

    let mut user_3 = User {
        name: "User 3".into()
    };

    println!("User 1 is {user_1:?} and User 2 is {user_2:?}");

    user_1.is_borrowed();  // User name is borrowed: User 1
    user_2.is_borrowed();  // User name is owned: User 2
    user_3.is_borrowed();  // User name is borrowed: User 3

    // 수정이 필요하면 자동으로 복사 (Clone on Write)
    user_3.name.to_mut().push_str(" is a user");
    user_3.is_borrowed();  // User name is owned: User 3 is a user

    // Cow = Clone on write
}
```

**장점:**

- 정적 문자열(`&str`)은 `Borrowed`로 저장 (복사 없음)
- 이미 `String`을 가지고 있으면 `Owned`로 저장 (추가 복사 없음)
- 수정이 필요할 때만 복사 (`to_mut()` 호출 시)

## Cow의 메서드

### `to_mut()` - 가변 참조 얻기 (Clone on Write)

```rs
use std::borrow::Cow;

fn main() {
    let mut cow = Cow::Borrowed("hello");

    // 수정이 필요하면 자동으로 복사 (Clone on Write)
    cow.to_mut().push_str(" world");

    // 이제 Owned 상태
    match cow {
        Cow::Borrowed(_) => println!("Still borrowed"),
        Cow::Owned(s) => println!("Now owned: {}", s),  // "hello world"
    }
}
```

**동작 방식:**

- `Borrowed` 상태에서 `to_mut()` 호출 → 자동으로 `Owned`로 변환 (복사 발생)
- `Owned` 상태에서 `to_mut()` 호출 → 복사 없이 가변 참조 반환

### `into_owned()` - 소유권 가져오기

```rs
use std::borrow::Cow;

fn main() {
    let borrowed = Cow::Borrowed("hello");
    let owned: String = borrowed.into_owned();  // 복사 발생

    let already_owned = Cow::Owned(String::from("world"));
    let s: String = already_owned.into_owned();  // 복사 없음 (이미 소유)
}
```

**차이점:**

- `to_mut()`: 가변 참조를 얻고, 필요시 복사 (Cow 유지)
- `into_owned()`: 소유권을 가져오고, Cow를 소비 (String 반환)

## Cow vs 일반 String 비교

### Cow 없이 (3.rs)

```rs
struct User {
    name: String
}

impl User {
    fn new(input: &str) -> Self {
        Self {
            name: input.to_string()  // 항상 복사
        }
    }
}
```

**문제:**

- 정적 문자열도 항상 복사
- 이미 `String`이어도 다시 복사
- 메모리 낭비

### Cow 사용 (4.rs)

```rs
struct User<'a> {
    name: Cow<'a, str>
}

impl<'a> User<'a> {
    fn new(input: impl Into<Cow<'a, str>>) -> Self {
        Self {
            name: input.into()  // 조건부 복사
        }
    }
}
```

**장점:**

- 정적 문자열은 복사 없음 (`Borrowed`)
- 이미 `String`이면 소유권만 가져옴 (`Owned`)
- 수정 시에만 복사 (`to_mut()`)

## 실제 사용 사례

### 1. 문자열 처리

```rs
use std::borrow::Cow;

fn normalize_path(path: Cow<'_, str>) -> Cow<'_, str> {
    if path.contains("//") {
        Cow::Owned(path.replace("//", "/"))  // 수정 필요 시 복사
    } else {
        path  // 변경 불필요하면 복사 없음
    }
}
```

### 2. 설정 값 처리

```rs
use std::borrow::Cow;

struct Config {
    name: Cow<'static, str>,  // 정적 문자열 또는 동적 문자열
}

fn main() {
    // 정적 문자열 사용 (복사 없음)
    let config1 = Config {
        name: Cow::Borrowed("default"),
    };

    // 동적 문자열 사용
    let config2 = Config {
        name: Cow::Owned(String::from("custom")),
    };
}
```

## Cow vs 다른 타입

| 타입           | 설명          | 사용 시기                 |
| -------------- | ------------- | ------------------------- |
| `&str`         | 빌린 문자열   | 항상 읽기만 할 때         |
| `String`       | 소유한 문자열 | 항상 수정이 필요할 때     |
| `Cow<'_, str>` | 빌리거나 소유 | 조건부로 복사가 필요할 때 |

## 요약

- **Cow = Clone on Write**: 필요할 때만 복사
- **두 가지 상태**: `Borrowed` (참조) 또는 `Owned` (소유)
- **성능 최적화**: 불필요한 복사를 피함
- **주로 사용**: 문자열 처리, 설정 값, 조건부 복사가 필요한 경우

**핵심 포인트:**

- 읽기만 하면 `Borrowed` 사용 (복사 없음)
- 수정이 필요하면 `Owned`로 변환 (lazy cloning)
- `to_mut()`을 호출하면 자동으로 복사됨 (Clone on Write)
- 정적 문자열은 `Borrowed`, 동적 문자열은 `Owned`로 자동 선택

**3.rs vs 4.rs 비교:**

| 항목             | 3.rs (String) | 4.rs (Cow)              |
| ---------------- | ------------- | ----------------------- |
| 정적 문자열 처리 | 항상 복사     | 복사 없음 (Borrowed)    |
| 동적 문자열 처리 | 항상 복사     | 소유권만 가져옴 (Owned) |
| 수정 시          | 이미 String   | 필요시 복사 (to_mut)    |
| 메모리 효율      | 낮음          | 높음                    |
