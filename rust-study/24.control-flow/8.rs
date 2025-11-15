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