# 28. implementing structs and enums

impl 키워드로 struct에 기능을 넣어줄수있다.

다른 객체지향언어에서 객체의 기능을 만드는 것과 같다.

```rs
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

my_animal: Animal { age: 0, animal_type: Cat }
```

다른 언어는 객체를 만들때 new 객체이름() 으로 만들지만 rust 에서는 정해진 형식이 없기 때문에 정의하기 나름이다.

self 를 이용해서 자기자신의 값을 사용할수 있다. this를 self로 쓰는 느낌

```rs
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
```

change_animal_type 은 새로운 struct를 만드는것이고 change_to_dog 은 기존 struct의 값을 수정하는것이다.

impl은 여러개를 쓸수 있다. override 되지 않고 중첩으로 가능하다.

```rs
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
    fn make_sound(&self) -> &str {
        match self.animal_type {
            AnimalType::Cat => "meow",
            AnimalType::Dog => "woof"
        }
    }
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
    println!("my_animal sound: {}", my_animal.make_sound());
}
```

enum 도 impl 을 사용해서 기능을 만들수가 있다.

```rs
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

name: Whiskers
animal_type sound: meow
```
