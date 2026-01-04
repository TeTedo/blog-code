use std::thread;

fn main() {
    thread::spawn(|| {
        println!("Hello from the thread!");
    });

    for _ in 1..100000 {
        let x = 2;
    }
}