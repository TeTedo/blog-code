fn main() {
    let my_number = 10;
    let reference = &my_number;

    println!("Are they the same? {}", my_number == *reference);
}