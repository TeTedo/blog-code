enum AnimalType {
    Cat(String),
    Dog(String)
}

impl AnimalType {
    fn make_sound(&self) -> &str {
        match self {
            AnimalType::Cat(name) => {
                println!("name: {}", name);
                "meow"
            },
            AnimalType::Dog(name) => {
                println!("name: {}", name);
                "woof"
            }
        }
    }
}

fn main() {
    let animal_type = AnimalType::Cat(String::from("Whiskers"));
    println!("animal_type sound: {}", animal_type.make_sound());
}