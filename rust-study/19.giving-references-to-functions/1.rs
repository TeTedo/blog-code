fn print_country(country_name: String) -> String {
    println!("My country is {}", country_name);
    country_name
}

fn main() {
    let country = String::from("대한민국");
    let country_print = print_country(country);
    print_country(country_print);
}