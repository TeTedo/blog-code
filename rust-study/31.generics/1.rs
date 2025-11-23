fn print_and_give_item<T>(input: T) -> T {
    input
}

fn main() {
    let x = print_and_give_item(9);
    let y = print_and_give_item("hello");
    println!("the number is : {}", x);
    println!("the string is : {}", y);
}