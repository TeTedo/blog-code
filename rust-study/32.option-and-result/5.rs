fn check_error(input: i32) -> Result<(), ()> {
    if input % 2 == 0 {
        Ok(())
    } else {
        Err(())
    }
}

fn main() {
    if check_error(3).is_err() {
        println!("Error");
    } else {
        println!("No error");
    }
}