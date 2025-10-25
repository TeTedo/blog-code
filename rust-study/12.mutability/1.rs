fn give_number(one: i32, two: i32) -> i32 {
    one + two
}

fn main () {
    let my_number = give_number(1, 2);
    println!("my_number: {}", my_number);
}