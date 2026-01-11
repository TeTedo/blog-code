# 49. Impl Trait

`impl Trait`은 제네릭과 비슷하지만 몇 가지 중요한 차이점이 있습니다. 함수 파라미터와 반환 타입에서 사용할 수 있으며, 타입을 추상화하는 더 간결한 방법을 제공합니다.

## `impl Trait` vs 제네릭

### 제네릭 함수

```rs
use std::fmt::Display;

// function 호출자가 정함
fn generic_function<T: Display>(input: T) {
    println!("{input}");
}

fn main() {
    generic_function::<i32>(10);  // 호출자가 타입을 명시적으로 지정 가능
    generic_function("Hello");    // 타입 추론도 가능
}
```

**특징:**

- 호출자가 타입을 명시적으로 지정할 수 있습니다 (`generic_function::<i32>(10)`)
- 각 타입마다 별도의 함수가 생성됩니다 (monomorphization)
- 함수 시그니처에 타입 파라미터가 노출됩니다

### `impl Trait` 함수

```rs
use std::fmt::Display;

// function 에 정의한 trait 만 가능
fn impl_function(input: impl Display) {
    println!("{input}");
}

fn main() {
    impl_function(10);      // OK
    impl_function("Hello"); // OK
    // impl_function::<i32>(10);  // ❌ 에러: 타입을 명시할 수 없음
}
```

**특징:**

- 호출자가 타입을 명시적으로 지정할 수 없습니다
- 함수 정의에서만 트레이트를 지정합니다
- 더 간결한 문법을 제공합니다
- 제네릭과 동일하게 정적 디스패치를 사용합니다

## 주요 차이점

### 1. 타입 명시 가능 여부

```rs
fn generic<T: Display>(x: T) -> T { x }
fn impl_trait(x: impl Display) -> impl Display { x }

fn main() {
    // 제네릭: 타입 명시 가능
    let a = generic::<i32>(10);

    // impl Trait: 타입 명시 불가능
    let b = impl_trait(10);
    // let c = impl_trait::<i32>(10);  // ❌ 에러
}
```

### 2. 여러 파라미터에서의 동작

```rs
use std::fmt::Display;

// 제네릭: 두 파라미터가 같은 타입이어야 함
fn generic_same<T: Display>(a: T, b: T) {
    println!("{a} and {b}");
}

// impl Trait: 두 파라미터가 다른 타입일 수 있음
fn impl_different(a: impl Display, b: impl Display) {
    println!("{a} and {b}");
}

fn main() {
    generic_same(10, 20);           // OK: 둘 다 i32
    // generic_same(10, "Hello");    // ❌ 에러: 타입이 다름

    impl_different(10, "Hello");     // OK: 다른 타입 가능
    impl_different(10, 20);         // OK: 같은 타입도 가능
}
```

**핵심 차이:**

- 제네릭: 같은 타입 파라미터는 같은 타입을 의미
- `impl Trait`: 각 파라미터가 독립적으로 타입을 추론

### 3. 반환 타입으로 사용

`impl Trait`의 가장 강력한 용도는 **반환 타입**으로 사용하는 것입니다. 특히 클로저나 복잡한 반환 타입을 간결하게 표현할 수 있습니다.

```rs
fn returns_a_closure() -> impl Fn(i32) {
    |x| println!("{x}")
}

fn main() {
    let closure = returns_a_closure();
    closure(10);
}
```

**왜 유용한가?**

제네릭으로는 표현하기 어려운 경우:

```rs
// ❌ 이렇게 할 수 없음 (클로저는 각각 고유한 타입을 가짐)
fn returns_closure<T>() -> T
where
    T: Fn(i32),
{
    |x| println!("{x}")  // 에러: 타입을 추론할 수 없음
}

// ✅ impl Trait 사용
fn returns_closure() -> impl Fn(i32) {
    |x| println!("{x}")  // OK: 구체적인 타입을 숨김
}
```

### 4. 복잡한 반환 타입 숨기기

```rs
use std::iter;

fn make_iterator() -> impl Iterator<Item = i32> {
    iter::once(1)
        .chain(iter::once(2))
        .chain(iter::once(3))
        .map(|x| x * 2)
        .filter(|&x| x > 2)
}

fn main() {
    for num in make_iterator() {
        println!("{}", num);  // 4, 6
    }
}
```

**제네릭으로는 불가능:**

- 반환 타입이 매우 복잡한 경우 (여러 체이닝된 이터레이터)
- 정확한 타입을 명시하기 어려운 경우
- 타입을 숨기고 싶은 경우 (캡슐화)

## 사용 시나리오

### 1. 파라미터에서: 간단한 트레이트 바운드

```rs
use std::fmt::Display;

// 제네릭보다 간결
fn print_item(item: impl Display) {
    println!("{}", item);
}

// 여러 파라미터가 다른 타입일 수 있음
fn print_two(a: impl Display, b: impl Display) {
    println!("{} and {}", a, b);
}

fn main() {
    print_item(10);
    print_item("Hello");
    print_two(10, "World");  // 다른 타입 가능
}
```

### 2. 반환 타입에서: 복잡한 타입 숨기기

```rs
fn get_numbers() -> impl Iterator<Item = i32> {
    (1..=10).filter(|&x| x % 2 == 0)
}

fn main() {
    let evens: Vec<i32> = get_numbers().collect();
    println!("{:?}", evens);  // [2, 4, 6, 8, 10]
}
```

### 3. 클로저 반환

```rs
fn make_adder(x: i32) -> impl Fn(i32) -> i32 {
    move |y| x + y
}

fn main() {
    let add_5 = make_adder(5);
    println!("{}", add_5(10));  // 15
}
```

## 제네릭 vs `impl Trait` 선택 가이드

### 제네릭을 사용해야 하는 경우:

1. **호출자가 타입을 명시해야 하는 경우**

   ```rs
   fn convert<T, U>(x: T) -> U where T: Into<U> {
       x.into()
   }
   ```

2. **여러 곳에서 같은 타입을 사용해야 하는 경우**

   ```rs
   fn process<T: Display>(input: T) -> T {
       println!("{}", input);
       input  // 같은 타입 반환
   }
   ```

3. **타입 파라미터를 다른 곳에서도 사용해야 하는 경우**

   ```rs
   struct Container<T> {
       value: T,
   }

   impl<T: Display> Container<T> {
       fn new(value: T) -> Self {
           Self { value }
       }
   }
   ```

### `impl Trait`을 사용해야 하는 경우:

1. **간단한 트레이트 바운드**

   ```rs
   fn print(x: impl Display) {  // 제네릭보다 간결
       println!("{}", x);
   }
   ```

2. **반환 타입이 복잡한 경우**

   ```rs
   fn get_data() -> impl Iterator<Item = i32> {
       // 복잡한 이터레이터 체인
   }
   ```

3. **클로저를 반환하는 경우**

   ```rs
   fn make_closure() -> impl Fn(i32) -> i32 {
       |x| x * 2
   }
   ```

4. **타입을 숨기고 싶은 경우 (캡슐화)**
   ```rs
   // 내부 구현을 숨기고 인터페이스만 노출
   pub fn create_processor() -> impl Processor {
       // 복잡한 내부 타입
   }
   ```

## 성능

**중요:** `impl Trait`과 제네릭은 모두 **정적 디스패치**를 사용합니다.

- 컴파일 타임에 타입이 결정됩니다
- 각 타입마다 별도의 함수가 생성됩니다 (monomorphization)
- 런타임 오버헤드가 없습니다
- `Box<dyn Trait>`와 달리 동적 디스패치를 사용하지 않습니다

```rs
// 정적 디스패치 (빠름)
fn static_dispatch(x: impl Display) {
    println!("{}", x);
}

// 동적 디스패치 (느림, 하지만 유연함)
fn dynamic_dispatch(x: Box<dyn Display>) {
    println!("{}", x);
}
```

## 요약

| 특징          | 제네릭               | `impl Trait`       |
| ------------- | -------------------- | ------------------ |
| 타입 명시     | 가능 (`func::<T>()`) | 불가능             |
| 여러 파라미터 | 같은 타입 강제       | 독립적인 타입      |
| 반환 타입     | 제한적               | 매우 유용          |
| 문법          | 더 명시적            | 더 간결            |
| 성능          | 정적 디스패치        | 정적 디스패치      |
| 사용 시기     | 타입 제어 필요       | 간결함/캡슐화 필요 |

**핵심 포인트:**

- `impl Trait`은 제네릭의 간결한 대안입니다
- 반환 타입에서 특히 유용합니다
- 둘 다 정적 디스패치를 사용합니다 (성능 동일)
- 상황에 따라 적절한 것을 선택하세요
