fn add_is_great(mut country_name: String) {
    country_name.push_str(" is great!");
    println!("{}", country_name);
}

fn main() {
    let country = String::from("대한민국");
    add_is_great(country);
}