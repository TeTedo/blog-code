fn main() {
    let big_string = "Hello there, I am a &str";

    println!("big_string: {}", big_string.chars().count());

    big_string.char_indices().for_each(|(index, char)| {
        println!("index: {index}, char: {char}");
    });

    println!("big_string.char_indices().count(): {}", big_string.char_indices().count());
}