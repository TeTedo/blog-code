use std::mem::{size_of, size_of_val, forget};

struct MyStruct {
    bunch_of_stuff: Box<[u32; 1000]>,
}

fn main() {
    let my_string = String::from("thoethoe");
    forget(my_string.clone());
    println!("{}, {}", size_of::<MyStruct>(), size_of_val("I am a &str"));
    println!("{my_string:?}");
}