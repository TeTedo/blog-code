use std::fmt::Display;

fn print_and_give_item<T: Display>(input: T) -> T {
    println!("the item is : {}", input);
    input
}

fn main() {
    let x = print_and_give_item(9);
    let y = print_and_give_item("hello");
    println!("the number is : {}", x);
    println!("the string is : {}", y);
}