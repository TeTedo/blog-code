struct User {
    name: String
}

impl User {
    fn new(input: &str) -> Self {
        Self {
            name: input.to_string()
        }
    }
}

fn main() {
    let name_1 = "User 1";
    let name_2 = "User 2".to_string();

    let my_user = User::new(name_1);

    let my_user_2 = User::new(&name_2);
}