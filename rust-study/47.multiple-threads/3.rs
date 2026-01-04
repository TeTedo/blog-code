use std::sync::{Arc, Mutex};
use std::thread;

trait CoolTrait {
    fn cool_function(&self);
}

#[derive(Debug)]
struct OurStruct {
    data: Arc<Mutex<u8>>,
}

impl CoolTrait for OurStruct {
    fn cool_function(&self) {
        *self.data.lock().unwrap() += 1;
    }
}

fn main() {
    let our_struct = OurStruct {
        data: Arc::new(Mutex::new(0)),
    };

    let mut join_vec = vec![];
    for _ in 0..10 {
        let clone = Arc::clone(&our_struct.data);
        let handle = thread::spawn(move || {
            let mut data = clone.lock().unwrap();
            *data += 1;
        });
        join_vec.push(handle);
    }
    join_vec.into_iter().for_each(|handle| handle.join().unwrap());
    println!("our_struct: {:?}", our_struct);
}