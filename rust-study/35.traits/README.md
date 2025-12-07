# Traits

다른 언어의 interface와 비슷하다.

trait는 일반적으로 동사라고 생각하면 된다.

struct의 debug 프린트를 찍기 위해서 `#[derive(Debug)]` 를 struct 위에 써줬다.

여기서 Debug 가 trait 에 해당되는데 struct 에 기능을 추가해준다라고 이해했다.

trait의 예시는 아래와 같다.

```rs
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

impl Canine for Animal {}

fn main() {
    let my_animal = Animal { name: String::from("Dog") };
    my_animal.bark();
    my_animal.run();
}

Woof woof!
The animal is running!
```

impl 쪽에 함수를 구현하면 덮어씌울수 있다.

```rs
impl Canine for Animal {
    fn bark(&self) {
        println!("멍멍 멍멍!");
    }
    fn run(&self) {
        println!("뛰는중!");
    }
}
```

trait을 이용하면 struct 의 더하기도 구현해볼수 있다.

```rs
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

sum: ThingsToAdd { first_thing: 30, second_thing: 30.0 }
```

---

Display trait 을 적용시켜서 print를 커스텀 할수 있다.

```rs
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
```

trait 을 사용해서 게임로직을 상상한다고 하면 아래와 같이 쓸수 있다.

```rs
struct Monster {
    health: i32
}

struct Wizard {}
struct Ranger {}

trait FightClose {
    fn attack_with_sword(&self, opponent: &mut Monster) {
        opponent.health -= 10;
        println!("You strike with your sword! Your opponent's health is now {}", opponent.health);
    }
    fn attack_with_hand(&self, opponent: &mut Monster) {
        opponent.health -= 2;
        println!("You attack with your first! Your opponent's health is now {}", opponent.health);
    }
}

impl FightClose for Wizard {}
impl FightClose for Ranger {}

trait FightFromDistance {
    fn attack_with_bow(&self, opponent: &mut Monster, distance: u32) {
        if distance < 10 {
            opponent.health -= 10;
            println!("You attack with your bow! Your opponent's health is now {}", opponent.health);
        }
    }
    fn attack_with_rock(&self, opponent: &mut Monster, distance: u32) {
        if distance < 3 {
            opponent.health -= 4;
            println!("You attack with a rock! Your opponent's health is now {}", opponent.health);
        }
    }
}

impl FightFromDistance for Ranger {}

fn main() {
    let radagast = Wizard {};
    let aragorn = Ranger {};

    let mut uruk_hai = Monster { health: 40 };

    radagast.attack_with_sword(&mut uruk_hai);
    aragorn.attack_with_bow(&mut uruk_hai, 8);
}
```

위는 struct 가 trait 에 있는 함수를 쓸수 있게끔 했다.

다음은 fn 에 trait 을 제한시키도록 할 수 있다. (trait bounds)

```rs
use std::fmt::Debug;

struct Monster {
    health: i32
}

#[derive(Debug)]
struct Wizard {
    health: i32
}

#[derive(Debug)]
struct Ranger {
    health: i32
}

trait Magic {}
trait FightClose {}
trait FightFromDistance {}

impl FightClose for Ranger{} // Each type gets FightClose,
impl FightClose for Wizard {}
impl FightFromDistance for Ranger{} // but only Ranger gets FightFromDistance
impl Magic for Wizard{}  // and only Wizard gets Magic

fn attack_with_bow<T>(character: &T, opponent: &mut Monster, distance: u32)
where T: FightFromDistance + Debug {
    if distance < 10 {
        opponent.health -= 10;
        println!(
            "You attack with your bow. Your opponent now has {} health left.  You are now at: {:?}",
            opponent.health, character
        );
    }
}

fn attack_with_sword<T>(character: &T, opponent: &mut Monster)
where T: FightClose + Debug {
    opponent.health -= 10;
    println!(
        "You attack with your sword. Your opponent now has {} health left. You are now at: {:?}",
        opponent.health, character
    );
}

fn fireball<T>(character: &T, opponent: &mut Monster, distance: u32)
where T: Magic + Debug {
    if distance < 15 {
        opponent.health -= 20;
        println!("You raise your hands and cast a fireball! Your opponent now has {} health left. You are now at: {:?}",
    opponent.health, character);
    }
}

fn main() {
    let radagast = Wizard { health: 60 };
    let aragorn = Ranger { health: 80 };

    let mut uruk_hai = Monster { health: 40 };

    attack_with_sword(&radagast, &mut uruk_hai);
    attack_with_bow(&aragorn, &mut uruk_hai, 8);
    fireball(&radagast, &mut uruk_hai, 8);
}
```

---

From trait 을 이용하기

```rs
use std::fmt::Display;

fn print_vec<T: Display>(input: &Vec<T>) {
    for item in input {
        print!("{item}");
    }
    println!();
}

fn main() {
    let array_vec = Vec::from([8, 9, 10]);
    print_vec(&array_vec);

    let str_vec = Vec::from("What kind of vec is this?");
    print_vec(&str_vec);

    let string_vec = Vec::from(String::from("What kind of vec is this?"));
    print_vec(&string_vec);
}
8910
871049711632107105110100321111023211810199321051153211610410511563
871049711632107105110100321111023211810199321051153211610410511563
```

From trait 을 확장해서 쓸수도 있다.

이때는 From 의 required method 인 from 을 구현해줘야 한다.

```rs
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
    let finland = Country::from(finland_cities);
    finland.print_cities();
}
```

From trait 을 구현하면 자동으로 into 도 구현이 된다.

그래서 from 을 into 로 바꿔서 쓸수 있다. 대신 타입을 꼭 명시해줘야 한다.

```rs
let finland_cities = vec![helsinki, turku];
let finland : Country = finland_cities.into();
```

generic 을 이용해서 모든 타입에 trait 을 사용할 수 있다.

```rs
trait Prints {
    fn prints_something(&self) {
        println!("I like to print things");
    }
}

struct Person;
struct Building;

impl<T> Prints for T {}

fn main() {
    let my_person = Person;
    let my_building = Building;
    my_person.prints_something();
}
```

Debug 나 Display trait 을 가지고 있어야 한다는 조건을 걸수도 있다.

```rs
use std::fmt::Debug;
use std::fmt::Display;

trait Prints {
    fn debug_print(&self) where Self: Debug {
        println!("I am {:?}", self);
    }

    fn display_print(&self) where Self: Display {
        println!("I am {}", self);
    }
}

#[derive(Debug)]
struct Person;
struct Building;

impl<T> Prints for T {}

fn main() {
    let my_person = Person;
    let my_building = Building;
    my_person.debug_print();
}
```

---

AsRef trait

AsRef 는
