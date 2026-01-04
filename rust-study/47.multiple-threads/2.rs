use std::thread;

fn main() {
    let mut join_vec = vec![];
    for _ in 1..10 {
        let handle = thread::spawn(|| {
            println!("Hello from the thread!");
        });

        join_vec.push(handle);
    }

    join_vec.into_iter().for_each(|handle| handle.join().unwrap());

    println!("Hello from the main thread!");
}