use std::collections::BinaryHeap;

fn show_remainder(input: &BinaryHeap<i32>) -> Vec<i32> {
    let mut remainder_vec = vec![];
    for number in input {
        remainder_vec.push(*number);
    }
    remainder_vec
}

fn main() {
    let many_numbers = vec![94, 42, 59, 64, 32, 22, 38, 5, 59];

    let mut my_heap = BinaryHeap::new();

    for number in many_numbers {
        my_heap.push(number);
    }

    while let Some(number) = my_heap.pop() {
        println!("{}", number);
        println!("remainder: {:?}", show_remainder(&my_heap));
    }
}