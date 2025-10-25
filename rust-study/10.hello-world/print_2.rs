fn main () {
    let my_name = "TeTedo";
    println!("Hello, {}!", my_name);

    let my_age = get_age();
    println!("My age is {my_age}!");
}

fn get_age() -> i32 {
    50
}