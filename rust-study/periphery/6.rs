use anyhow::anyhow;
use std::error::Error;

fn try_to_make_numbers(int: &str, float: &str) -> Result<(), Box<dyn Error>> {
    let my_integer = int.parse::<i32>()?;
    let my_float = float.parse::<f64>()?;
    Ok(())
}

fn main() {
    let first_try = try_to_make_numbers("10", "hnohenhtho");
    let second_try = try_to_make_numbers("twelve", "4.0");
}