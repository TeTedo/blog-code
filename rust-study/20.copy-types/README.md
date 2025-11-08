# Copy types

copy types 라고 하는 것들은 매우 간단하다.

integers, floats, booleans, char 가 여기에 속하는데 이 타입들은 소유권 생각안하고 그냥 복사할수 있다.

```rs
fn prints_number(number: i32) {
    println!("number: {}", number);
}

fn main() {
    let number = 10;
    prints_number(number);
    prints_number(number);
}

```

String은 clone 함수로 값을 복사해서 넘길수가 있다.

```rs
fn prints_country(country_name: String) {
    println!("country_name: {}", country_name);
}

fn main() {
    let my_country = String::from("대한민국");
    prints_country(my_country.clone());
    prints_country(my_country);
}
```

첫번째 프린트에서는 값을 복사하고 두번째 프린트는 아예 소유권을 넘기는 것이다.

변수를 선언할때 타입을 안쓰면 컴파일이 안된다.

```rs
fn main() {
    let my_number;
}

error[E0282]: type annotations needed
 --> ./3.rs:2:9
  |
2 |     let my_number;
  |         ^^^^^^^^^
  |
help: consider giving `my_number` an explicit type
  |
2 |     let my_number: /* Type */;
  |                  ++++++++++++
```

그리고 할당하지 않은 변수는 사용하지 못한다.

```rs
fn main() {
    let my_number : i32;
    println!("my_number: {}", my_number);
}

error[E0381]: used binding `my_number` isn't initialized
 --> ./3.rs:3:31
  |
2 |     let my_number : i32;
  |         --------- binding declared here but left uninitialized
3 |     println!("my_number: {}", my_number);
  |                               ^^^^^^^^^ `my_number` used here but it isn't initialized
  |
  = note: this error originates in the macro `$crate::format_args_nl` which comes from the expansion of the macro `println` (in Nightly builds, run with -Z macro-backtrace for more info)
help: consider assigning a value
  |
2 |     let my_number : i32 = 42;
  |                         ++++
```
