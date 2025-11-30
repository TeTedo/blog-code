use std::ops::Add;

#[derive(Debug)]
struct ThingsToAdd {
    first_thing: u32,
    second_thing: f32
}

impl Add for ThingsToAdd {
    type Output = ThingsToAdd;
    fn add(self, other: ThingsToAdd) -> ThingsToAdd {
        ThingsToAdd {
            first_thing: self.first_thing + other.first_thing,
            second_thing: self.second_thing + other.second_thing
        }
    }
}

fn main() {
    let my_thing = ThingsToAdd {
        first_thing: 10,
        second_thing: 10.0
    };

    let second_thing = ThingsToAdd{
        first_thing: 20,
        second_thing: 20.0
    };

    let sum = my_thing + second_thing;
    println!("sum: {:?}", sum);
}