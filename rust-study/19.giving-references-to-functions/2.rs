fn print_country(country_name: &String) {
    println!("My country is {}", country_name);
}

fn main() {
    let country = String::from("대한민국");
    print_country(&country);
    print_country(&country);
}