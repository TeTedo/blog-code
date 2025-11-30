struct Animal {
    name: String
}

trait Canine {
    fn bark(&self) {
        println!("Woof woof!");
    }
    fn run(&self) {
        println!("The animal is running!");
    }
}

impl Canine for Animal {
    fn bark(&self) {
        println!("멍멍 멍멍!");
    }
    fn run(&self) {
        println!("뛰는중!");
    }
}

fn main() {
    let my_animal = Animal { name: String::from("Dog") };
    my_animal.bark();
    my_animal.run();
}