fn main() {
    let some_numbers = vec![9, 6, 9, 10, 11];

    println!("sum: {:?}", some_numbers.iter().fold(0, |sum, number| sum + number));
}