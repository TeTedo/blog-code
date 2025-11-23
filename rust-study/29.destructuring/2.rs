
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