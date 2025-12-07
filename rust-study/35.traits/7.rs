#[derive(Debug)]
struct City {
    name: String,
    population: u32,
}

#[derive(Debug)]
struct Country {
    cities: Vec<City>,
}

impl City {
    fn new(name: &str, population: u32) -> Self {
        Self {
            name: name.to_string(),
            population,
        }
    }
}

impl From<Vec<City>> for Country {
    fn from(cities: Vec<City>) -> Self {
        Self {
            cities
        }
    }
}

impl Country {
    fn print_cities(&self) {
        for city in &self.cities {
            println!("City: {} has a population of {}", city.name, city.population);
        }
    }
}

fn main() {
    let helsinki = City::new("Helsinki", 631_695);
    let turku = City::new("Turku", 178_333);

    let finland_cities = vec![helsinki, turku];
    let finland : Country = finland_cities.into();
    finland.print_cities();
}