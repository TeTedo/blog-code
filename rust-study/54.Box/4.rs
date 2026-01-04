use std::fmt::Display;

// concrete
fn print<T: Display>(input: T) {
    println!("Hi, I'm a: {input}");
}

// concrete
fn print_2(input: impl Display) {
    println!("Hi, I'm a: {input}");
}

// dynamic
fn print_3(input: Box<dyn Display>) {
    println!("Hi, I'm a: {input}");
}

fn main() {
    print(8);
    print_2(8);
    print_3(Box::new(8));
}