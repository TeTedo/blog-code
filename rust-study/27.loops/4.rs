fn main() {

    let mut counter = 5;

    let my_number = loop {
        counter += 1;
        if counter == 10 {
            break counter;
        }
    };

    println!("my_number: {}", my_number);
}