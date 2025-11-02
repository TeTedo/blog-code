fn main () {
    let mut number = 10;
    let number_change = &mut number;
    *number_change = 11;
    let number_ref = &number;
    println!("number: {}", number_ref);
}