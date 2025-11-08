fn prints_country(country_name: String) {
    println!("country_name: {}", country_name);
}

fn main() {
    let my_country = String::from("대한민국");
    prints_country(my_country.clone());
    prints_country(my_country);
}