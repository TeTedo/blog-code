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