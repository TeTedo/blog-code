fn take_fifth(value: Vec<i32>) -> Option<i32> {
    if value.len() < 5 {
        None
    } else {
        Some(value[4])
    }
}

fn main() {
    let new_vec = vec![1,2];
    let index = take_fifth(new_vec);

    index.expect("Needed a index, but got None");
}