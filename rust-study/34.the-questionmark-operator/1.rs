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