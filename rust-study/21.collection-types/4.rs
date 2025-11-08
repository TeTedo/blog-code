fn main() {
    let array = ["One", "Two", "Three"];

    println!("array[0]: {}", array[0]);
    println!("array[2]: {:?}", array.get(2));
    println!("array[3]: {:?}", array.get(3));
}