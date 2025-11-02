fn return_str() -> &str {
    let country = String::from("대한민국");
    &country
}

fn main () {
    let my_country = return_str();
    println!("my_country: {}", my_country);
}