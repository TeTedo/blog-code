enum List {
    Content(i32, Box<List>),
    NoContent
}

fn main() {
    let my_list = List::Content(1, Box::new(List::NoContent));
}