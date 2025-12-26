use std::cell::RefCell;

fn main() {
    let my_cell = RefCell::new(String::from("I am a String"));
    *my_cell.borrow_mut() = String::from("I am a new String");
    println!("my_cell: {:?}", my_cell);
    match my_cell.try_borrow_mut() {
        Ok(mut value) => {
            *value = String::from("I am a super new String");
            println!("my_cell: {:?}", my_cell);
        }
        Err(_) => {
            println!("Error: RefCell already borrowed");
        }
    }
    println!("my_cell: {:?}", my_cell);
}