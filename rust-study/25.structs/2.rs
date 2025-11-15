#[derive(Debug)]
struct Color(i32, i32, Vec<String>);

fn main() {
    let color = Color(10, 10, vec![String::from("Red"), String::from("Green"), String::from("Blue")]);
    println!("The color is {:?}", color);
    println!("The size is {}", std::mem::size_of_val(&color));
}