fn main() {
    let my_string = "Hello there".to_owned();

    let string_1 = String::from("Hello there");
    let string_2 = "Hello there".to_string(); // Display trait
    let string_3: String = "hello there".into(); // From trait
    let string_4 = "Hello there".to_owned(); // ToOwned trait
}