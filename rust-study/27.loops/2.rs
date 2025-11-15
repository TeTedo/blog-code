fn main() {
    let mut counter = 0;
    let mut counter2 = 0;

    'first_loop: loop {
        println!("counter: {}", counter);
        counter += 1;
        if counter == 10 {
            'second_loop: loop {
                println!("counter2: {}", counter2);
                counter2 += 1;
                if counter2 == 10 {
                    break 'first_loop;
                }
            }
        }
    }
}