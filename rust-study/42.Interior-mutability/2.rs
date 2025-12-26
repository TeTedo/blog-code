use std::cell::Cell;

fn main() {
    let my_cell = Cell::new(String::from("I am a String"));
    my_cell.set(String::from("I am a new String"));
    let my_string = my_cell.get();
}