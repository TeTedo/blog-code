use std::mem::{size_of, align_of};

struct MyStruct {
    bunch_of_stuff: u8, // 1 byte
    more_stuff: u64,
}

fn main() {
    println!("Alignment of MyStruct: {}", align_of::<MyStruct>());
    println!("Size of MyStruct: {}", size_of::<MyStruct>());
}