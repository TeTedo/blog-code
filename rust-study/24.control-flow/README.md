# 24. control flow

if 문 조건에 () 를 안써줘도된다.

```rs
fn main() {
    let my_number = 8;
    if my_number < 5 {
        println!("my_number is less than 5");
    } else {
        println!("my_number is greater than or equal to 5");
    }
}
```

switch 랑 비슷한 match 라는게 있다.

```rs
fn main() {
    let my_number: u8 = 5;
    match my_number {
        0 => println!("it's zero"),
        1 => println!("it's one"),
        2 => println!("it's two"),
        _ => println!("It's some other number"),
    }
}

It's some other number
```

rust스럽게 표현할수도 있다.

```rs
fn main() {
    let my_number = 5;
    let second_number = match my_number {
        0 => 0,
        5 => 10,
        _ => 2,
    };
}
```

match에 2가지 이상의 조건도 사용할 수 있다.

```rs
fn main() {
    let sky = "cloudy";
    let temperature = "warm";

    match (sky, temperature) {
        ("cloudy", "cold") => println!("It's dark and unpleasant today"),
        ("clear", "warm") => println!("It's a nice day"),
        ("cloudy", "warm") => println!("It's dark but not bad"),
        _ => println!("Not sure what the weather is."),
    }
}
```

match guard 라는것도 있다.

match 안에 if 문을 쓰면 매치가드 라고 한다.

```rs
fn main() {
    let children = 5;
    let married = true;

    match (children, married) {
        (children, married) if children > 0 && married => println!("You have {} children and you are married", children),
        (children, married) if children > 0 && !married => println!("You have {} children and you are not married", children),
        (c, m) if c == 0 && m => println!("You are married but you don't have children"),
        (children, married) if children == 0 && !married => println!("You are not married and you don't have children"),
        _ => println!("You are not married and you don't have children"),
    }
}
```

조건에 있는 튜플은 아무 이름으로 지정해도 된다.

---

좀 더 복잡한 match 문을 작성할 수도 있다.

```rs
fn match_colors(rbg: (i32, i32, i32)) {
    match rbg {
        (r, _, _) if r < 10 => println!("Not much red"),
        (_, g, _) if g < 10 => println!("Not much green"),
        (_, _, b) if b < 10 => println!("Not much blue"),
        _ => println!("A lot of color"),
    }
}

fn main() {
    let first_color = (10, 10, 10);
    let second_color = (1, 2, 3);
    match_colors(first_color);
    match_colors(second_color);
}

A lot of color
Not much red
```

if문과 match는 하나의 타입만 return 할수 있다.

```rs
fn main() {
    let my_number = 5;
    match my_number {
        1 => 1,
        2 => 2,
        3 => println!("Three"),
        _ => "Not 1, 2, or 3",
    }
}


| /     match my_number {
4 | |         1 => 1,
  | |              - this is found to be of type `{integer}`
5 | |         2 => 2,
  | |              - this is found to be of type `{integer}`
6 | |         3 => println!("Three"),
  | |              ^^^^^^^^^^^^^^^^^ expected integer, found `()`
7 | |         _ => "Not 1, 2, or 3",
8 | |     }
  | |_____- `match` arms have incompatible types
```

`@`를 사용해서 if문 처럼 사용할 수 있다.

```rs
fn match_number(my_number: i32) {
    match my_number {
        number @ 0..=10 => println!("number is between 0 and 10: {}", number),
        number @ 11..=20 => println!("number is between 11 and 20: {}", number),
        number @ 21..=30 => println!("number is between 21 and 30: {}", number),
        _ => println!("number is greater than 30"),
    }
}

fn main() {
    match_number(5);
    match_number(15);
    match_number(25);
    match_number(35);
}

number is between 0 and 10: 5
number is between 11 and 20: 15
number is between 21 and 30: 25
number is greater than 30
```
