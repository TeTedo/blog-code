// Collection types
// Array

fn main() {
    let array = ["One", "Two"]; // [&str; 2]
    let array2 = ["One", "Two", "Three"]; // [&str; 3]

    println!("Is array the same as array2? {}", array == array2);
}