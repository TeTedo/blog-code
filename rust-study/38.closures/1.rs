fn main() {
    let my_number = 10;
    let my_closure = |x: i32| println!("This is a closure: {}", x + my_number);

    my_closure(10);
}