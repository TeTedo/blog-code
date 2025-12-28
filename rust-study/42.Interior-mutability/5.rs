use std::cell::{Cell, RefCell};

trait SuperCoolTrait {
    fn cool_function(&self);
}

#[derive(Debug)]
struct User {
    id: u32,
    times_used: Cell<u32>
}

impl SuperCoolTrait for User {
    fn cool_function(&self) {
        println!("Now using the cool function");
        let times_used = self.times_used.get();
        self.times_used.set(times_used + 1);
    }
}

fn main() {
    let user = User {
        id: 89723,
        times_used: Cell::new(0),
    };

    for _ in 0..20 {
        user.cool_function();
    }

    println!("user: {:?}", user);
}