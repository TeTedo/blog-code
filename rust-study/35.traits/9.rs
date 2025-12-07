use std::fmt::Display;

fn print_it<T: Display + AsRef<str>>(input: T) {
    println!("{input}")
}

fn main() {
    print_it("Hello, world!");
    print_it(String::from("Hello, world!"));
}