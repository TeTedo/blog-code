# 54. Box

Box 란 타입은 stack 대신에 바로 heap 에 저장할 수 있게 해준다.

Box 는 smart pointer 이다.

```rs
struct SomeStruct {
    name: String,
    number: u8,
    data: Box<[u8; 1000]>
}

fn take_thing<T>(thing: T) {

}

fn main() {
    let my_struct = SomeStruct {
        name: String::from("my_name"),
        number: 10,
        data: Box::new([0; 1000])
    };

    println!("The struct is {} bytes", std::mem::size_of_val(&my_struct));
}
```

```
// struct data 에 Box 를 안썼을때
The struct is 1032 bytes

// Box 썼을때
The struct is 40 bytes
```

recursive 컴팡리 문제도 Box로 해결할 수 있다.

```rs
enum List {
    Content(i32, Box<List>),
    NoContent
}

fn main() {
    let my_list = List::Content(1, Box::new(List::NoContent));
}
```

## 트레이트 객체 (Trait Objects)와 `dyn`

서로 다른 타입을 하나의 컬렉션에 저장하려고 할 때, 트레이트 객체를 사용할 수 있습니다.

### 왜 `Vec<Booky>`가 작동하지 않는가?

```rs
trait Booky {}

struct Book;
struct BigBook;

impl Booky for Book {}
impl Booky for BigBook {}

fn main() {
    let vec_of_booky_things: Vec<Booky> = vec![Book, BigBook];
}
```

**컴파일 에러:**

```
error[E0277]: the size for values of type `dyn Booky` cannot be known at compilation time
```

**에러 발생 이유:**

1. **DST (Dynamically Sized Type)**: `Booky`는 트레이트이므로 크기를 알 수 없는 타입입니다.

   - `Book`과 `BigBook`은 서로 다른 크기를 가질 수 있습니다.
   - 컴파일 타임에 정확한 크기를 결정할 수 없습니다.

2. **`Vec`의 요구사항**: `Vec<T>`는 `T`가 `Sized` 트레이트를 구현해야 합니다.

   - 모든 요소가 같은 크기여야 합니다.
   - 스택에 얼마나 많은 메모리가 필요한지 알아야 합니다.

3. **메모리 레이아웃 문제**:
   ```
   Vec는 연속된 메모리 공간에 요소를 저장합니다:
   [Book][BigBook][Book]...
   ↑
   각 요소의 크기가 다르면 불가능!
   ```

### 해결책: `Box<dyn Trait>`

```rs
trait Booky {}

struct Book;
struct BigBook;

impl Booky for Book {}
impl Booky for BigBook {}

fn main() {
    let vec_of_booky_things: Vec<Box<dyn Booky>> = vec![
        Box::new(Book),
        Box::new(BigBook)
    ];
}
```

**왜 작동하는가?**

1. **`Box`는 포인터**: `Box<dyn Booky>`는 힙에 할당된 객체를 가리키는 포인터입니다.

   - 포인터의 크기는 항상 같습니다 (64비트 시스템에서 8바이트).
   - `Vec`는 포인터들의 배열을 저장합니다.

2. **`dyn` 키워드**: "dynamic"의 약자로, 동적 디스패치를 사용함을 나타냅니다.

   - 런타임에 어떤 구현체의 메서드를 호출할지 결정합니다.
   - vtable (가상 함수 테이블)을 통해 메서드를 호출합니다.

3. **메모리 레이아웃**:
   ```
   스택 (Vec):
   [ptr1][ptr2][ptr3]...  (각각 8바이트)
    │     │     │
    ▼     ▼     ▼
   힙:   힙:   힙:
   [Book][BigBook][Book]...  (크기가 달라도 OK)
   ```

### 트레이트 객체의 작동 원리

```rs
trait Booky {
    fn read(&self);
}

struct Book;
struct BigBook;

impl Booky for Book {
    fn read(&self) {
        println!("Reading a book");
    }
}

impl Booky for BigBook {
    fn read(&self) {
        println!("Reading a big book");
    }
}

fn main() {
    let books: Vec<Box<dyn Booky>> = vec![
        Box::new(Book),
        Box::new(BigBook),
    ];

    for book in books {
        book.read();  // 런타임에 어떤 read()를 호출할지 결정
    }
}
```

**동적 디스패치 과정:**

1. `Box<dyn Booky>`는 두 개의 포인터를 포함합니다:

   - **데이터 포인터**: 실제 객체 (`Book` 또는 `BigBook`)를 가리킴
   - **vtable 포인터**: 메서드 포인터들의 테이블을 가리킴

2. `book.read()` 호출 시:
   - vtable을 조회하여 올바른 `read()` 메서드를 찾습니다.
   - 데이터 포인터를 통해 실제 객체에 접근합니다.
   - 해당 타입의 `read()` 메서드를 호출합니다.

### `dyn` vs 제네릭

**제네릭 (정적 디스패치):**

```rs
fn process<T: Booky>(item: T) {
    // 컴파일 타임에 T의 타입을 알 수 있음
    // 각 타입마다 별도의 함수가 생성됨
    // 빠르지만 코드 크기 증가
}
```

**트레이트 객체 (동적 디스패치):**

```rs
fn process(item: Box<dyn Booky>) {
    // 런타임에 타입 결정
    // 하나의 함수만 생성됨
    // 약간 느리지만 코드 크기 작음
}
```

### 다른 포인터 타입 사용하기

`Box` 외에도 다른 포인터 타입을 사용할 수 있습니다:

```rs
// 참조 사용 (수명이 보장되는 경우)
fn process_books(books: &[&dyn Booky]) {
    for book in books {
        book.read();
    }
}

// Rc 사용 (여러 소유자 필요)
use std::rc::Rc;
let books: Vec<Rc<dyn Booky>> = vec![
    Rc::new(Book),
    Rc::new(BigBook),
];

// Arc 사용 (멀티스레드 환경)
use std::sync::Arc;
let books: Vec<Arc<dyn Booky>> = vec![
    Arc::new(Book),
    Arc::new(BigBook),
];
```

### 요약

- **`dyn Trait`**: 크기를 알 수 없는 트레이트 객체 타입
- **`Box<dyn Trait>`**: 힙에 할당된 트레이트 객체를 가리키는 포인터
- **동적 디스패치**: 런타임에 메서드 호출 결정 (vtable 사용)
- **사용 이유**: 서로 다른 타입을 하나의 컬렉션에 저장하거나, 런타임에 타입을 결정해야 할 때

---

```rs
use std::fmt::Display;

// concrete
fn print<T: Display>(input: T) {
    println!("Hi, I'm a: {input}");
}

// concrete
fn print_2(input: impl Display) {
    println!("Hi, I'm a: {input}");
}

// dynamic
fn print_3(input: Box<dyn Display>) {
    println!("Hi, I'm a: {input}");
}

fn main() {
    print(8);
    print_2(8);
    print_3(Box::new(8));
}
```

generic 에서의 작동방식은 compile 할때 새로운 function 더 만든다.
여기선 i32를 받기 때문에 input 에 i32가 들어오는 function 을 새로 만든다.

```rs
fn print_i32(input: i32)
```
