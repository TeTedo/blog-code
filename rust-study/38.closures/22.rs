use std::cmp::{max, min};

fn main() {
    let my_vec = vec![-878, 879879, -94845, 0, 74554];

    let biggest = my_vec
        .iter()
        .fold(i32::MIN, |a, b| {
            max(a, *b)
        });

    let smallest = my_vec
        .iter()
        .fold(i32::MAX, |a, b| {
            min(a, *b)
        });

    println!("biggest: {biggest}");
    println!("smallest: {smallest}");
}