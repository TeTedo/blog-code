# More About Printing

```rs
fn main() {
    print!(r#"\t Start with a tab\nand move to a new line"#);
}

\t Start with a tab\nand move to a new line
```

\n 은 줄바꿈이고 \t는 탭이다

근데 "" 앞뒤에 r# # 을 붙여주면 raw text 가 출력된다.

코드블록에서 줄바꿈으로 print를 찍어줄수 있다.

```rs
fn main() {
    // Note: After the first line you have to start on the far left.
    // If you write directly under println!, it will add the spaces
    println!("Inside quotes
you can write over
many lines
and it will print just fine.");

    println!("If you forget to write
    on the left side, the spaces
    will be added when you print.");
}

Inside quotes
you can write over
many lines
and it will print just fine.
If you forget to write
    on the left side, the spaces
    will be added when you print.
```

hex값과 바이트값은 아래와 같이 찍는다.

```rs
fn main () {
    let my_var = 15;
    println!("my_var in hex: {:x}", my_var);
    println!("my_var in bytes: {:b}", my_var);
}

my_var in hex: f
my_var in bytes: 1111
```

좀 복잡하게 할수도 있다

```rs
fn main() {
    let title = "TODAY'S NEWS";
    println!("{:-^30}", title); // no variable name, pad with -, put in centre, 30 characters long
    let bar = "|";
    println!("{: <15}{: >15}", bar, bar); // no variable name, pad with space, 15 characters each, one to the left, one to the right
    let a = "SEOUL";
    let b = "TOKYO";
    println!("{city1:-<15}{city2:->15}", city1 = a, city2 = b); // variable names city1 and city2, pad with -, one to the left, one to the right
}

---------TODAY'S NEWS---------
|                            |
SEOUL--------------------TOKYO
```

[rust module fmt](https://doc.rust-lang.org/std/fmt/) 에서 확인가능
