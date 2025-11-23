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
    numbers.asdjfiasdjfoasd();
}