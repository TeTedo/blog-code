# 32. Option and Result

rust 에선 npe 를 방지하기 위해 Option 이라는게 있다.

만약 panic 이 발생하면 프로그램이 종료가 되는데 아래 예시가 있다.

```rs
fn take_fifth(value: Vec<i32>) -> i32 {
    value[4]
}

fn main() {
    let new_vec = vec![1,2];
    let index = take_fifth(new_vec);
}

thread 'main' panicked at 1.rs:2:10:
index out of bounds: the len is 2 but the index is 4
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

위 코드는 컴파일까진 되지만 실행시키면 panic이 뜨면서 종료된다.

안전한 코드로 바꾸면 아래와 같이 된다.

```rs
fn take_fifth(value: Vec<i32>) -> Option<i32> {
    if value.len() < 5 {
        None
    } else {
        Some(value[4])
    }
}

fn main() {
    let new_vec = vec![1,2];
    let index = take_fifth(new_vec);
    println!("index: {:?}", index);
}
```

Option 은 prelude 로 자동으로 프로그램에 삽입한다고한다.

```rs
use std::prelude::v1::*;
```

None 을 unwrap 하면 panic 이 뜬다. -> cloudflare 장애 코드에서 unwrap 이 쓰인걸로 얘기도 나왔다..

```rs
fn take_fifth(value: Vec<i32>) -> Option<i32> {
    if value.len() < 5 {
        None
    } else {
        Some(value[4])
    }
}

fn main() {
    let new_vec = vec![1,2];
    let index = take_fifth(new_vec);
    println!("index: {:?}", index.unwrap());
}

thread 'main' panicked at 2.rs:13:35:
called `Option::unwrap()` on a `None` value
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

match를 이용하면 좀 더 안전하게 코드를 짤수 있다.

```rs
fn take_fifth(value: Vec<i32>) -> Option<i32> {
    if value.len() < 5 {
        None
    } else {
        Some(value[4])
    }
}

fn main() {
    let new_vec = vec![1,2];
    let index = take_fifth(new_vec);

    match index {
        Some(index) => println!("index: {}", index),
        None => println!("No index found"),
    }
}
```

is_some 으로 값이 들어있는지를 확인할수도 있다.

```rs
fn take_fifth(value: Vec<i32>) -> Option<i32> {
    if value.len() < 5 {
        None
    } else {
        Some(value[4])
    }
}

fn main() {
    let new_vec = vec![1,2];
    let index = take_fifth(new_vec);

    if index.is_some() {
        println!("index: {}", index.unwrap());
    } else {
        println!("No index found");
    }
}
```

expect 를 사용해서 에러메시지를 원하는걸로 나타낼수 있다.

```rs
fn take_fifth(value: Vec<i32>) -> Option<i32> {
    if value.len() < 5 {
        None
    } else {
        Some(value[4])
    }
}

fn main() {
    let new_vec = vec![1,2];
    let index = take_fifth(new_vec);

    index.expect("Needed a index, but got None");
}

thread 'main' panicked at 4.rs:13:11:
Needed a index, but got None
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

---

## Result

Option 은 None이면 아무것도 안가지고 있고 Some 이면 그 타입을 가지고 있다.

Result 는 Ok, Err 에서 타입이나 에러를 가지고 있다.

```rs
enum Option<T> {
    None,
    Some(T),
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}

fn main() {
    let result = Result::Ok(5);
    let result = Result::Err("Error");
}
```

예시코드는 아래와 같다.

```rs
fn check_error(input: i32) -> Result<(), ()> {
    if input % 2 == 0 {
        Ok(())
    } else {
        Err(())
    }
}

fn main() {
    if check_error(3).is_err() {
        println!("Error");
    } else {
        println!("No error");
    }
}
```

result도 Option과 똑같이 Err.unwrap 을 하게 되면 panic이 된다.

Result 에 타입을 넣어서 해보자.

```rs
fn check_if_five(number: i32) -> Result<i32, String> {
    if number == 5 {
        Ok(number)
    } else {
        Err(format!("{} is not 5", number))
    }
}

fn main() {
    let mut numbers = vec![];

    for number in 2..=7 {
        numbers.push(check_if_five(number));
    }

    println!("numbers: {:?}", numbers);
}

numbers: [Err("2 is not 5"), Err("3 is not 5"), Err("4 is not 5"), Ok(5), Err("6 is not 5"), Err("7 is not 5")]
```

여기서 numbers의 타입은 `Vec<Result<i32, String>>` 이다.

에러를 조금더 맛있게 에러타입을 이용해서 짜보면 아래와 같이 할수 있다.

```rs
use std::num::ParseIntError;

fn parse_number(number: &str) -> Result<i32, ParseIntError> {
    number.parse()
}

fn main() {
    let mut result_vec = vec![];
    result_vec.push(parse_number("8"));
    result_vec.push(parse_number("Hi"));
    result_vec.push(parse_number("10"));

    for number in result_vec {
        println!("number: {:?}", number);
    }
}

number: Ok(8)
number: Err(ParseIntError { kind: InvalidDigit })
number: Ok(10)
```

---

Option과 Result를 너무 많이 써서 편리한 syntax 가 있다.

먼저 vec의 get은 Option 을 반환한다.

```rs
fn main() {
    let my_vec = vec![2,3,4];
    let get_one = my_vec.get(0);
    let get_two = my_vec.get(10);

    println!("get_one: {:?}", get_one);
    println!("get_two: {:?}", get_two);
}

get_one: Some(2)
get_two: None
```

if let 을 사용해서 조건을 걸수도 있다.

```rs
fn main() {
    let my_vec = vec![2,3,4];

    for index in 0..10 {
        if let Some(number) = my_vec.get(index) {
            println!("value: {}", number);
        }
    }
}

value: 2
value: 3
value: 4
```

while let 도 사용할수 있고 이를 응용하면 다음과 같이 할수 있다.

```rs
fn main() {
    let weather_vec = vec![
        vec!["Berlin", "cloudy", "5", "-7", "78"],
        vec!["Athens", "sunny", "not humid", "20", "10", "50"],
    ];
    for mut city in weather_vec {
        println!("For the city of {}:", city[0]); // In our data, every first item is the city name
        while let Some(information) = city.pop() {
            // This means: keep going until you can't pop anymore
            // When the vector reaches 0 items, it will return None
            // and it will stop.
            if let Ok(number) = information.parse::<i32>() {
                // Try to parse the variable we called information
                // This returns a result. If it's Ok(number), it will print it
                println!("The number is: {}", number);
            }  // We don't write anything here because we do nothing if we get an error. Throw them all away
        }
    }
}

For the city of Berlin:
The number is: 78
The number is: -7
The number is: 5
For the city of Athens:
The number is: 50
The number is: 10
The number is: 20
```
