struct Book<'a, 'b> {
    name: &'a str,
    second_name: &'b str
}

fn main() {

    let my_string = "my_book_title".to_string();
    let my_second_string = "my_book_second_title".to_string();
    
    let my_book = Book {
        name: &my_string,
        second_name: &my_second_string
    };
}