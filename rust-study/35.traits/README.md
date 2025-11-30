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
