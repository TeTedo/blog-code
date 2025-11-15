# 25. Structs

빈 struct 는 크기가 없다.

```rs
struct FileDirectory;

fn main() {
    let file_directory = FileDirectory;

    println!("The size is {}", std::mem::size_of_val(&file_directory));
}

The size is 0
```

튜플을 사용해서 struct를 만들수도 있다.

```rs
#[derive(Debug)]
struct Color(i32, i32, Vec<String>);

fn main() {
    let color = Color(10, 10, vec![String::from("Red"), String::from("Green"), String::from("Blue")]);
    println!("The color is {:?}", color);
    println!("The size is {}", std::mem::size_of_val(&color));
}

The color is Color(10, 10, ["Red", "Green", "Blue"])
The size is 32
```

i32 : 4byte, Vec : 24byte (fat pointer) - ptr : 8, len : 8, capacity : 8

```
스택 (구조체):
┌─────────┬─────────┬──────────────────────────────┐
│ i32 (4) │ i32 (4) │ Vec<String> 메타데이터 (24)  │
│   10    │   10    │ [ptr, len, capacity]         │
└─────────┴─────────┴──────────────────────────────┘
                    │
                    ▼
힙 (실제 데이터):
┌─────────────────────────────────────────┐
│ Vec의 버퍼 (String 포인터들)             │
│ [String1_ptr, String2_ptr, String3_ptr]│
└─────────────────────────────────────────┘
         │         │         │
         ▼         ▼         ▼
    "Red"      "Green"    "Blue"
```

derive 로 debug를 찍게 할수 있다.

안쓰면 안찍힘 -> 나중에 배운다고 함

다른 struct를 만들어보자

```rs
#[derive(Debug)]
struct Country {
    name: String,
    population: i32,
    capital: String,
}

fn main() {
    let country = Country {
        name: String::from("Korea"),
        population: 50000000,
        capital: String::from("Seoul"),
    };
    println!("The country name is {}", country.name);
    println!("The country population is {}", country.population);
    println!("The country capital is {}", country.capital);
    println!("The country is {:?}", country);
}

The country name is Korea
The country population is 50000000
The country capital is Seoul
The country is Country { name: "Korea", population: 50000000, capital: "Seoul" }
```

struct 의 크기는 빈 공간이 있을수 있다.

```rs
use std::mem::size_of_val;

struct Number {
    one: i8,
    two: i8,
    three: i32,
}

struct Number2 {
    one: i8,
    two: i32,
    three: i32,
}

struct Number3 {
    one: i32,
    two: i32,
    three: i32,
}
fn main() {
    let number = Number {
        one: 1,
        two: 2,
        three: 3,
    };
    let number2 = Number2 {
        one: 1,
        two: 2,
        three: 3,
    };
    let number3 = Number3 {
        one: 1,
        two: 2,
        three: 3,
    };
    println!("The size is {}", size_of_val(&number));
    println!("The size is {}", size_of_val(&number2));
    println!("The size is {}", size_of_val(&number3));
}

The size is 8
The size is 12
The size is 12
```

너무 큰 사이즈의 배열을 만들면 스택오버플로우 발생

```rs
use std::mem::size_of_val;

struct BigSize {
    infinite: [i32; 1000000000],
}

fn main() {
    let big_size = BigSize {
        infinite: [0; 1000000000],
    };
    println!("The size is {}", size_of_val(&big_size));
}

thread 'main' has overflowed its stack
fatal runtime error: stack overflow, aborting
[1]    1340 abort      ./5
```
