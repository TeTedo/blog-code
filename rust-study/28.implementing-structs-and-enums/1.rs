#[derive(Debug)]
struct Animal {
    age: u8,
    animal_type: AnimalType
}

#[derive(Debug)]
enum AnimalType {
    Cat,
    Dog
}

impl Animal {
    fn new() -> Self {
        Self {
            age: 0,
            animal_type: AnimalType::Cat
        }
    }
}

fn main() {
    let my_animal = Animal::new();
    println!("my_animal: {:?}", my_animal);
}