use std::any::{Any, type_name};

struct MyType;

fn do_stuff_depending(input: &dyn Any) {
    if let Some(a_string) = input.downcast_ref::<String>() {
        println!("We got a String!");
    } else if input.is::<i32>() {
        println!("We got an i32!");
    } else if input.is::<MyType>() {
        println!("We got a MyType!");
    } else {
        println!("Don't know what it is");
    }
}

fn main() {
    let my_string = String::from("Hello, world!");
    let my_number = 10;
    do_stuff_depending(&my_string);
    do_stuff_depending(&my_number);
    do_stuff_depending(&MyType);
}