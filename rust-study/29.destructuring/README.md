# 29. Destructuring

struct 를 destructuring 할수 있다.

```rs

struct Person {
    name: String,
    real_name: String,
    height: u8,
    happiness: bool
}

fn main() {
    let papa_doc = Person {
        name: "Papa Doc".to_string(),
        real_name: "Clarence".to_string(),
        height: 179,
        happiness: false
    };

    let Person {
        name,
        real_name,
        height,
        happiness
    } = papa_doc;

    println!("they call him {} but his real name is {}. Hi is {}cm tall and is he happy? {}", name, real_name, height, happiness);
}
```

새로운 struct를 만들때도 활용할수 있다.

```rs

struct Person {
    name: String,
    real_name: String,
    height: u8,
    happiness: bool
}

#[derive(Debug)]
struct Person2 {
    name: String,
    real_name: String
}

impl Person2 {
    fn from_person(person: Person) -> Self {
        let Person { name, real_name, .. } = person;
        Self { name, real_name }
    }
}

fn main() {
    let papa_doc = Person {
        name: "Papa Doc".to_string(),
        real_name: "Clarence".to_string(),
        height: 179,
        happiness: false
    };

    let papa_doc2 = Person2::from_person(papa_doc);
    println!("papa_doc2: {:?}", papa_doc2);

}

papa_doc2: Person2 { name: "Papa Doc", real_name: "Clarence" }
```
