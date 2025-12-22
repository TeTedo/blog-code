
struct Book<'a> {
    name: &'a str
}

fn main() {
    let my_book = Book {
        name: "my_book"
    };
}