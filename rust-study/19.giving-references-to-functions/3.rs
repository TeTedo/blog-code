fn add_is_great(country_name: &mut String) {
    country_name.push_str(" is great!");
    println!("{}", country_name);
}

fn main() {
    let mut country = String::from("대한민국");
    add_is_great(&mut country);
    add_is_great(&mut country);
}