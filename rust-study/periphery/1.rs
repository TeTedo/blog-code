use std::any::{Any, type_name};

fn get_type_name<T: Any, U: Any>(_: T, _: U) {
    let type_of_t = type_name::<T>();
    let type_of_u = type_name::<U>();
    println!("type of T: {type_of_t}");
    println!("type of U: {type_of_u}");
}

fn main() {
    let my_number = 10;
    let my_string = String::from("Hello, world!");
    get_type_name(my_number, my_string);
    
}