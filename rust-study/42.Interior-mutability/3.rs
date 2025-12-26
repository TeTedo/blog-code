use std::cell::RefCell;

#[derive(Debug)]
struct User {
    id: u32,
    year_registered: u32,
    username: String,
    active: RefCell<bool>,
    // Many other fields
}

fn main() {
    let user_1 = User {
        id: 1,
        year_registered: 2020,
        username: "User 1".to_string(),
        active: RefCell::new(true),
    };

    println!("user_1: {:?}", user_1);
    {
        let mut first_reference = user_1.active.borrow_mut();
        *first_reference = false;
        println!("user_1: {:?}", user_1);
    }
    println!("user_1: {:?}", user_1);
}