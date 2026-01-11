use std::fmt::Display;

// function 호출자가 정함
fn generic_function<T: Display>(input: T) {
    println!("{input}");
}

// function 에 정의한 trait 만 가능
fn impl_function(input: impl Display) {
    println!("{input}");
}

fn main() {
    generic_function::<i32>(10);
    impl_function("Hello");
}