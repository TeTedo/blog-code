# 31. generics

generics <-> concrete

generic을 사용해서 타입을 그때그때 바꿀수 있다.

```rs
fn print_and_give_item<T>(input: T) -> T {
    input
}

fn main() {
    let x = print_and_give_item(9);
    let y = print_and_give_item("hello");
    println!("the number is : {}", x);
    println!("the string is : {}", y);
}

the number is : 9
the string is : hello
```

input 에 들어가는 T라는 타입이 어떤 타입인지 알지 못하기 때문에 print를 찍으려고 하면 컴파일 에러가 난다.

```rs
fn print_and_give_item<T>(input: T) -> T {
    println!("the item is : {}", input);
    input
}

fn main() {
    let x = print_and_give_item(9);
    let y = print_and_give_item("hello");
    println!("the number is : {}", x);
    println!("the string is : {}", y);
}

error[E0277]: `T` doesn't implement `std::fmt::Display`
 --> 2.rs:2:34
  |
2 |     println!("the item is : {}", input);
  |                             --   ^^^^^ `T` cannot be formatted with the default formatter
  |                             |
  |                             required by this formatting parameter
  |
  = note: in format strings you may be able to use `{:?}` (or {:#?} for pretty-print) instead
  = note: this error originates in the macro `$crate::format_args_nl` which comes from the expansion of the macro `println` (in Nightly builds, run with -Z macro-backtrace for more info)
help: consider restricting type parameter `T` with trait `Display`
```

이경우 Display 라는 trait을 타입T가 가지고 있다 라고 해주면 잘 작동한다.

```rs
use std::fmt::Display;

fn print_and_give_item<T: Display>(input: T) -> T {
    println!("the item is : {}", input);
    input
}

fn main() {
    let x = print_and_give_item(9);
    let y = print_and_give_item("hello");
    println!("the number is : {}", x);
    println!("the string is : {}", y);
}
```

그래서 Display trait을 가지고 있지 않으면 에러가 난다.

```rs
use std::fmt::Display;

struct Item {
    number : u8
}

fn print_and_give_item<T: Display>(input: T) -> T {
    println!("the item is : {}", input);
    input
}

fn main() {
    let x = print_and_give_item(9);
    let y = print_and_give_item("hello");
    let z = print_and_give_item(Item { number: 10 });
    println!("the number is : {}", x);
    println!("the string is : {}", y);
}

error[E0277]: `Item` doesn't implement `std::fmt::Display`
  --> 3.rs:21:33
   |
21 |     let z = print_and_give_item(Item { number: 10 });
   |             ------------------- ^^^^^^^^^^^^^^^^^^^ the trait `std::fmt::Display` is not implemented for `Item`
   |             |
   |             required by a bound introduced by this call
   |
note: required by a bound in `print_and_give_item`
  --> 3.rs:13:27
   |
13 | fn print_and_give_item<T: Display>(input: T) -> T {
   |                           ^^^^^^^ required by this bound in `print_and_give_i
```

PartialOrd 를 쓰면 비교할 수 있다.

```rs
use std::fmt::Display;
use std::cmp::PartialOrd;

fn compare_and_display<T: Display, U: Display + PartialOrd>(statement: T, num_1: U, num_2: U) {
    println!("{}! Is {} greater than {}? {}", statement, num_1, num_2, num_1 > num_2);
}

fn main() {
    compare_and_display("Listen up!", 9, 8);
}

Listen up!! Is 9 greater than 8? true
```

where를 써서 더 보기 편하게 할수도 있다.

```rs
use std::cmp::PartialOrd;
use std::fmt::Display;

fn compare_and_display<T, U>(statement: T, num_1: U, num_2: U)
where
    T: Display,
    U: Display + PartialOrd,
{
    println!("{}! Is {} greater than {}? {}", statement, num_1, num_2, num_1 > num_2);
}

fn main() {
    compare_and_display("Listen up!", 9, 8);
}

```
