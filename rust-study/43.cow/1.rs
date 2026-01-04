use std::borrow::Cow;

fn module_3(input: u8) -> Cow<'static, str> {
    match input % 3 {
        0 => "Remainder is 0".into(),
        1 => "Remainder is 1".into(),
        remainder => format!("Remainder is {remainder}").into()
    }
}

fn main() {
    for number in 1..=6 {
        match module_3(number) {
            Cow::Borrowed(s) => println!("Borrowed: {s}"),
            Cow::Owned(s) => println!("Owned: {s}"),
        }
    }
}