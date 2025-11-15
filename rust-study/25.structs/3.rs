#[derive(Debug)]
struct Country {
    name: String,
    population: i32,
    capital: String,
}

fn main() {
    let country = Country {
        name: String::from("Korea"),
        population: 50000000,
        capital: String::from("Seoul"),
    };
    println!("The country name is {}", country.name);
    println!("The country population is {}", country.population);
    println!("The country capital is {}", country.capital);
    println!("The country is {:?}", country);
}