# The question mark operator

?를 이용해서 Result 의 OK, Error 반환을 더 쉽게 구현할수 있다.

```rs
use std::num::ParseIntError;

fn parse_str(input: &str) -> Result<i32, ParseIntError> {
    let parsed_number = input.parse::<i32>()?; // 값이 Ok 면 값을 반환하고 Err 면 에러를 반환한다.
    Ok(parsed_number)
}

fn main() {
    for item in vec!["8", "9", "10", "Hi", "11"] {
        let parsed_number = parse_str(item);
        match parsed_number {
            Ok(number) => println!("number: {}", number),
            Err(error) => println!("error: {}", error),
        }
    }
}

number: 8
number: 9
number: 10
error: invalid digit found in string
number: 11
```

?를 연속으로 쓸수도 있다.

```rs
use std::num::ParseIntError;

fn parse_str(input: &str) -> Result<i32, ParseIntError> {
    let parsed_number = input.parse::<u16>()?.to_string().parse::<u32>()?.to_string().parse::<i32>()?; // Add a ? each time to check and pass it on
    Ok(parsed_number)
}

fn main() {
    for item in vec!["8", "9", "10", "Hi", "11"] {
        let parsed_number = parse_str(item);
        match parsed_number {
            Ok(number) => println!("number: {}", number),
            Err(error) => println!("error: {}", error),
        }
    }
}
```

다른 서버와의 비동기 통신에서 .await? 를 많이 쓴다고 한다.
