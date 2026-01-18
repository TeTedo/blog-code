#[derive(Debug)]
struct Character {
    name: String,
    age: u8,
    height: u32,
    weight: u32,
    lifestate: LifeState,
}

#[derive(Debug)]
enum LifeState {
    Alive,
    Dead,
    NeverAlive,
    Uncertain
}

impl Character {
    fn new(name: String, age: u8, height: u32, weight: u32, alive: bool) -> Self {
        Self { 
            name, 
            age, 
            height, 
            weight, 
            lifestate: if alive { LifeState::Alive } else { LifeState::Dead } 
        }
    }
}

impl Default for Character {
    fn default() -> Self {
        Self {
            name: String::from("Default Name"),
            age: 18,
            height: 180,
            weight: 70,
            lifestate: LifeState::Uncertain
        }
    }
}


fn main() {
    let character_1 = Character::new(String::from("John"), 20, 180, 70, true);
    let character_2 = Character::default();
    println!("character_1: {:?}", character_1);
    println!("character_2: {:?}", character_2);
}