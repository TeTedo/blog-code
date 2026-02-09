use std::mem::{replace, swap, take, transmute};

#[derive(Debug)]
struct MyStruct {
    number: i32
}

fn main() {
    let my_numbers = [8u8, 9, 10, 11]; // [u8; 4]
    let new_number = unsafe {
        transmute::<[u8; 4], MyStruct>(my_numbers)
    };

    println!("{new_number:?}");
}