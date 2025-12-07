use std::fmt;

#[derive(Debug)]
struct Cat {
    name: String,
    age: u8,
}

impl fmt::Display for Cat {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let name = &self.name;
        let age = &self.age;
        write!(f, "My cat's name is {name} and age is {age} years old")
    }
}

fn main() {
    let mr_mantle = Cat {
        name: String::from("Reggie Mantle"),
        age: 10,
    };

    println!("{}", mr_mantle);
}