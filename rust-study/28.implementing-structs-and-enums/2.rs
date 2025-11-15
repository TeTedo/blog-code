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
    fn new(age: u8, animal_type: AnimalType) -> Self {
        Self {
            age,
            animal_type
        }
    }

    fn change_animal_type(self, animal_type: AnimalType) -> Self {
        Self {
            age: self.age,
            animal_type
        }
    }

    fn change_to_dog(&mut self) {
        self.animal_type = AnimalType::Dog;
        println!("changed to dog: {:?}", self);
    }

    fn check_type(&self) -> &str {
        match self.animal_type {
            AnimalType::Cat => "cat",
            AnimalType::Dog => "dog"
        }
    }
}

fn main() {
    let my_animal = Animal::new(10, AnimalType::Cat);
    println!("my_animal: {:?}", my_animal);
    let mut my_animal = my_animal.change_animal_type(AnimalType::Dog);
    println!("my_animal: {:?}", my_animal);

    my_animal.change_to_dog();

    println!("my_animal type: {}", my_animal.check_type());
}