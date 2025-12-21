fn main() {
    let my_closure = || {
        let my_number = 7;
        let other_number = 10;
        println!("The two numbers are {my_number} and {other_number}");
        my_number + other_number
    };

    let result = my_closure();
    println!("The result is {result}");
}