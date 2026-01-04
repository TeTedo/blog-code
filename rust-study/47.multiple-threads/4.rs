use std::sync::{Mutex, RwLock};

fn main() {
    let my_mutex = Mutex::new(5);

    let mut mutex_changer = my_mutex.lock().unwrap();
    let mut other_mutex_changer = my_mutex.try_lock();

    if let Ok(value) = other_mutex_changer {
        println!("other_mutex_changer: {value:?}");
    } else {
        println!("other_mutex_changer: locked");
    }
    *mutex_changer = 6;
    drop(mutex_changer);
    println!("{my_mutex:?}");
}