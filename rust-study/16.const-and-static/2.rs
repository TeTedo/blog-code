static mut NUMBER: i32 = 10;

fn main () {
    unsafe {
        NUMBER = 20;
        println!("NUMBER: {}", NUMBER);
    }
}