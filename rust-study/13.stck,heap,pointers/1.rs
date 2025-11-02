fn main() {
    let my_number = 15; // This is an i32
    let single_reference = &my_number; //  This is a &i32
    let double_reference = &single_reference; // This is a &&i32
    let five_references = &&&&&my_number; // This is a &&&&&i32

    println!("my_number: {}", my_number);
    println!("single_reference: {}", single_reference);
    println!("double_reference: {}", double_reference);
    println!("five_references: {}", five_references);
}