use std::sync::{Mutex, RwLock};

fn main() {
    let my_rwlock = RwLock::new(5);

    let read1 = my_rwlock.read().unwrap();
    let read2 = my_rwlock.read().unwrap();
    println!("read1: {read1:?}");
    println!("read2: {read2:?}");

}