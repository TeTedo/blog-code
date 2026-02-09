# 61. A Tour Of The Standard Library

sort

```rs
fn main() {
    let mut my_vec = vec![100, 90, 80, 0, 0, 0];
    my_vec.sort();
    println!("{my_vec:?}");
}

[0, 0, 0, 80, 90, 100]
```

sort_unstable은 더 빠르다. -> 같은 값의 원래 순서를 보장하지 않는 대신, 추가 메모리 없이 정렬

```rs
fn main() {
    let mut my_vec = vec![100, 90, 80, 0, 0, 0];
    my_vec.sort_unstable();
    println!("{my_vec:?}");
}

[0, 0, 0, 80, 90, 100] -> 어떤 0이 어느자리로 가는지는 보장되지 않는다.
```

dedup()은 연속된 중복만 제거하기 때문에 반드시 먼저 정렬해야한다.

```rs
fn main() {
    let mut my_vec = vec!["sun", "moon", "sun", "moon", "moon", "sun"];
    my_vec.sort_unstable();
    my_vec.dedup();
    println!("{my_vec:?}");
}

["moon", "sun"]
```

---

shrink_to_fit

```rs
fn main() {
    let mut my_vec = vec![10; 10000];
    println!("{}", my_vec.capacity());
    my_vec.push(9);
    println!("{}", my_vec.capacity());
}

10000
20000
```

```rs
fn main() {
    let mut my_vec = vec![10; 10000];
    println!("{}", my_vec.capacity());
    my_vec.push(9);
    my_vec.shrink_to_fit();
    println!("{}", my_vec.capacity());
}

10000
10001
```

첫 번째: capacity 10000인데 push하면 공간이 부족해서 2배로 재할당 → 20000
두 번째: shrink_to_fit()으로 실제 길이(10001)에 맞게 여분 메모리를 해제 → 10001

---

retain

```rs
fn main() {
    let mut my_vec = vec![8, 9, 10, 11]; // .iter().filter()
    my_vec.retain(|number| number > &9);
    println!("{my_vec:?}");
}
```

---

#![no_implicit_prelude]은 Rust가 자동으로 가져오는 prelude를 비활성화합니다.

extern crate std; → std 크레이트를 명시적으로 연결

```rs
#![no_implicit_prelude]
extern crate std;

use std::{convert::From, println, vec, string::String};

fn main() {
    let my_vec = vec![8, 9, 10];
    let my_string = String::from("This won't work");
    println!("{my_vec:?}, {my_string:?}");
}
```

---

forget - 값의 소유권을 가져간 뒤 drop을 실행하지 않고 메모리에서 잊어버림

```rs
use std::mem::{size_of, size_of_val, forget};

struct MyStruct {
    bunch_of_stuff: Box<[u32; 1000]>,
}

fn main() {
    let my_string = String::from("thoethoe");
    forget(my_string.clone());
    println!("{}, {}", size_of::<MyStruct>(), size_of_val("I am a &str"));
    println!("{my_string:?}");
}
```

forget(my_string.clone())은 복사본의 힙 메모리("thoethoe")가 해제되지 않아 메모리 누수가 발생합니다.

---

align_of

```rs
use std::mem::{size_of, align_of};

struct MyStruct {
    bunch_of_stuff: u8, // 1 byte
    more_stuff: u64,
}

fn main() {
    println!("Alignment of MyStruct: {}", align_of::<MyStruct>());
    println!("Size of MyStruct: {}", size_of::<MyStruct>());
}

Alignment of MyStruct: 8
Size of MyStruct: 16
```

Alignment 8: 구조체에서 가장 큰 필드(u64 = 8바이트)에 맞춰 정렬
Size 16: u8(1바이트) + 패딩 7바이트 + u64(8바이트) = 16바이트

---

swap

```rs
use std::mem::{replace, swap, take, transmute};

fn main() {
    let mut string_1 = String::from("Hello");
    let mut string_2 = String::from("There");

    swap(&mut string_1, &mut string_2);
    println!("{}, {}", string_1, string_2);
}
```

replace

```rs
use std::mem::{replace, swap, take, transmute};

fn main() {
    let mut data_1 = 60_000_000;
    let old_mut = replace(&mut data_1, 70_000_000);

    println!("Old value: {}, New value: {}", old_mut, data_1);
}
```

take

```rs
use std::mem::{replace, swap, take, transmute};

fn main() {
    let mut my_string = "I am a String".to_string();
    let taking_thing = take(&mut my_string);
    println!("{taking_thing}, old String : {my_string:?}");
}

I am a String, old String : ""
```

transmute - cast 같은느낌

```rs
use std::mem::{replace, swap, take, transmute};

#[derive(Debug)]
struct MyStruct {
    number: i32
}

fn main() {
    let my_numbers = [8u8, 9, 10, 11]; // [u8; 4]
    let new_number = unsafe {
        transmute::<[u8; 4], MyStruct>(my_numbers)
    };

    println!("{new_number:?}");
}

MyStruct { number: 185207048 }
```
