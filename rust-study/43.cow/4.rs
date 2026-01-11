use std::borrow::Cow;

#[derive(Debug)]
struct User<'a> {
    name: Cow<'a, str>
}

impl<'a> User<'a> {
    fn is_borrowed(&self) {
        match &self.name {
            Cow::Borrowed(name) => println!("User name is borrowed: {name}"),
            Cow::Owned(name) => println!("User name is owned: {name}"),
        }
    }
}

fn main() {

    let user_1 = User {
        name: "User 1".into() // reference 를 그대로 사용
    };
    let user_2 = User {
        name: "User 2".to_string().into() // String 을 소유권을 가져옴
    };

    let mut user_3 = User {
        name: "User 3".into()
    };

    println!("User 1 is {user_1:?} and User 2 is {user_2:?}");

    user_1.is_borrowed();
    user_2.is_borrowed();
    user_3.is_borrowed();

    user_3.name.to_mut().push_str(" is a user");
    user_3.is_borrowed();

    // Cow = Clone on write
}