fn times_tow(number: i32) -> i32 {
    number * 2
}

fn main () {

    let final_number = {
        let first_number = 1;
        let second_number = 2;
        times_tow(first_number + second_number)
    };

    println!("final_number: {}", final_number)
}