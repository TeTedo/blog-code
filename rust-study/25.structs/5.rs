use std::mem::size_of_val;

struct BigSize {
    infinite: [i32; 1000000000],
}

fn main() {
    let big_size = BigSize {
        infinite: [0; 1000000000],
    };
    println!("The size is {}", size_of_val(&big_size));
}