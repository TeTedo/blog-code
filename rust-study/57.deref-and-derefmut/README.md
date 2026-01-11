# 57. Deref and DerefMut

`Deref`와 `DerefMut`는 스마트 포인터가 내부 값을 참조할 수 있게 해주는 트레이트입니다. 이를 구현하면 `*` 연산자로 역참조할 수 있고, 자동 역참조(deref coercion)를 통해 메서드를 직접 호출할 수 있습니다.

## Deref란?

`Deref`는 **역참조(dereference)** 를 의미합니다. `*` 연산자를 사용할 때 호출되는 트레이트입니다.

**기본 개념:**

- `*my_pointer` → `Deref::deref(&my_pointer)` 호출
- 내부 값을 참조로 반환

## 기본 예시 1: 간단한 래퍼 타입

```rs
use std::ops::{Deref, DerefMut};

struct HoldsANumber(u8);

impl Deref for HoldsANumber {
    type Target = u8;

    fn deref(&self) -> &Self::Target {
        &self.0  // 내부 u8 값의 참조 반환
    }
}

impl DerefMut for HoldsANumber {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0  // 내부 u8 값의 가변 참조 반환
    }
}

fn main() {
    let my_number = HoldsANumber(20);

    // * 연산자로 역참조
    println!("{}", *my_number + 20);  // 40

    // 자동 역참조: u8의 메서드를 직접 호출 가능
    println!("{}", my_number.checked_add(20).unwrap() + 10);  // 50
}
```

**설명:**

1. `*my_number`: `Deref::deref()`를 호출하여 `&u8`을 얻고, 이를 역참조하여 `u8` 값을 가져옴
2. `my_number.checked_add(20)`: 자동 역참조가 발생하여 `u8`의 메서드를 직접 호출 가능

## 기본 예시 2: 복잡한 구조체

```rs
use std::ops::Deref;

struct Character {
    name: String,
    strength: u8,
    dexterity: u8,
    health: u8,
    intelligence: u8,
    wisdom: u8,
    charm: u8,
    hit_points: i8,
    alignment: Alignment,
}

impl Character {
    fn new(
        name: String,
        strength: u8,
        dexterity: u8,
        health: u8,
        intelligence: u8,
        wisdom: u8,
        charm: u8,
        hit_points: i8,
        alignment: Alignment,
    ) -> Self {
        Self {
            name,
            strength,
            dexterity,
            health,
            intelligence,
            wisdom,
            charm,
            hit_points,
            alignment,
        }
    }
}

enum Alignment {
    Good,
    Neutral,
    Evil,
}

// Character를 i8(hit_points)로 역참조 가능하게 만듦
// impl Deref for Character. Now we can do any integer math we want!
impl Deref for Character {
    type Target = i8;

    fn deref(&self) -> &Self::Target {
        &self.hit_points  // hit_points 필드의 참조 반환
    }
}

fn main() {
    let billy = Character::new("Billy".to_string(), 9, 8, 7, 10, 19, 19, 5, Alignment::Good); // Create two characters, billy and brandy
    let brandy = Character::new("Brandy".to_string(), 9, 8, 7, 10, 19, 19, 5, Alignment::Good);

    // 자동 역참조: Character가 i8로 자동 변환되어 i8의 메서드 호출 가능
    println!("Now Billy has {} hit points", billy.checked_add(20).unwrap());

    let mut hit_points_vec = vec![]; // Put our hit points data in here

    // *billy로 hit_points 값을 직접 가져올 수 있음
    hit_points_vec.push(*billy);     // Push *billy?
    hit_points_vec.push(*brandy);    // Push *brandy?

    println!("{:?}", hit_points_vec);
}
```

**설명:**

- `Character` 구조체를 `i8`로 역참조할 수 있게 만듦
- `*billy`는 `billy.hit_points`와 동일한 효과
- `billy.checked_add(20)`: 자동 역참조로 `i8`의 메서드를 직접 호출 가능
- 복잡한 구조체에서 특정 필드에 쉽게 접근 가능

## Deref vs DerefMut

### Deref

- 불변 참조(`&T`)를 반환
- 읽기 전용 작업에 사용

### DerefMut

- 가변 참조(`&mut T`)를 반환
- 수정 작업에 사용
- `Deref`를 구현한 타입에만 구현 가능

**예시:**

```rs
use std::ops::{Deref, DerefMut};

struct MyBox<T>(T);

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T> DerefMut for MyBox<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

fn main() {
    let mut my_box = MyBox(5);

    // Deref 사용 (읽기)
    println!("{}", *my_box);  // 5

    // DerefMut 사용 (쓰기)
    *my_box = 10;
    println!("{}", *my_box);  // 10
}
```

## 자동 역참조 (Deref Coercion)

Rust는 자동으로 역참조를 수행하여 타입을 맞춰줍니다.

**규칙:**

1. `T: Deref<Target = U>`이면 `&T` → `&U`로 자동 변환
2. `T: DerefMut<Target = U>`이면 `&mut T` → `&mut U`로 자동 변환

**예시:**

```rs
use std::ops::Deref;

struct MyString(String);

impl Deref for MyString {
    type Target = String;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

fn print_string(s: &str) {
    println!("{}", s);
}

fn main() {
    let my_string = MyString(String::from("Hello"));

    // 자동 역참조: &MyString → &String → &str
    print_string(&my_string);  // OK!

    // 명시적 역참조도 가능
    print_string(&*my_string);  // OK!

    // String의 메서드도 직접 호출 가능
    println!("{}", my_string.len());  // 5
}
```

## 실제 사용 사례

### 1. 스마트 포인터

```rs
use std::ops::Deref;

struct MyBox<T> {
    value: T,
}

impl<T> MyBox<T> {
    fn new(value: T) -> Self {
        MyBox { value }
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.value
    }
}

fn main() {
    let my_box = MyBox::new(5);
    println!("{}", *my_box);  // 5
}
```

### 2. 래퍼 타입

```rs
use std::ops::Deref;

struct Meters(f64);

impl Deref for Meters {
    type Target = f64;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

fn calculate_distance(distance: &f64) -> f64 {
    distance * 2.0
}

fn main() {
    let distance = Meters(10.0);

    // 자동 역참조로 f64 함수에 전달 가능
    let result = calculate_distance(&distance);
    println!("{}", result);  // 20.0
}
```

## Deref 강제 변환 체인

자동 역참조는 여러 단계로 체인될 수 있습니다:

```rs
use std::ops::Deref;

struct A(String);
struct B(A);
struct C(B);

impl Deref for A {
    type Target = String;
    fn deref(&self) -> &Self::Target { &self.0 }
}

impl Deref for B {
    type Target = A;
    fn deref(&self) -> &Self::Target { &self.0 }
}

impl Deref for C {
    type Target = B;
    fn deref(&self) -> &Self::Target { &self.0 }
}

fn print_str(s: &str) {
    println!("{}", s);
}

fn main() {
    let c = C(B(A(String::from("Hello"))));

    // C → B → A → String → &str 자동 변환
    print_str(&c);  // OK!
}
```

## 주의사항

### 1. Deref는 한 번만 구현

```rs
// ❌ 에러: 여러 개의 Target을 가질 수 없음
impl Deref for MyType {
    type Target = u8;  // 첫 번째
    // ...
}

impl Deref for MyType {
    type Target = i32;  // ❌ 에러!
    // ...
}
```

### 2. 무한 루프 주의

```rs
// ❌ 위험: 자기 자신을 반환하면 무한 루프
impl Deref for BadType {
    type Target = BadType;

    fn deref(&self) -> &Self::Target {
        self  // 무한 루프 위험!
    }
}
```

### 3. 성능 고려

자동 역참조는 편리하지만, 여러 단계의 체인은 약간의 오버헤드가 있을 수 있습니다. 하지만 컴파일 타임에 해결되므로 런타임 비용은 없습니다.

## 요약

| 개념          | 설명                              |
| ------------- | --------------------------------- |
| `Deref`       | `*` 연산자로 역참조 가능하게 만듦 |
| `DerefMut`    | 가변 참조로 역참조 가능하게 만듦  |
| 자동 역참조   | 함수 호출 시 자동으로 타입 변환   |
| `type Target` | 역참조 결과 타입 지정             |

**핵심 포인트:**

- `Deref`는 스마트 포인터를 일반 값처럼 사용하게 해줌
- 자동 역참조로 메서드 체이닝이 자연스러움
- `Box<T>`, `Rc<T>`, `String` 등이 모두 `Deref`를 구현
- `DerefMut`는 `Deref`를 구현한 타입에만 구현 가능
