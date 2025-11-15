enum Number {
    U32(u32),
    I32(i32),
}

fn get_number(input: i32) -> Number {
    let number = match input.is_positive() {
        true => Number::U32(input as u32),
        false => Number::I32(input as i32),
    };
    number
}

fn main() {
    let numbers = vec![get_number(10), get_number(-10), get_number(0)];
    for number in numbers {
        match number {
            Number::U32(n) => println!("U32: {}", n),
            Number::I32(n) => println!("I32: {}", n),
        }
    }
}