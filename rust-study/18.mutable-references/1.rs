fn main () {
    let mut my_number = 9;
    let num_ref = &mut &mut my_number;

    **num_ref = 10;
    println!("my_number: {}", my_number);
}