use std::fmt::Display;

struct Item {
    number : u8
}

fn print_and_give_item<T: Display>(input: T) -> T {
    println!("the item is : {}", input);
    input
}

fn main() {
    let x = print_and_give_item(9);
    let y = print_and_give_item("hello");
    let z = print_and_give_item(Item { number: 10 });
    println!("the number is : {}", x);
    println!("the string is : {}", y);
}