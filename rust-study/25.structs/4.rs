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