fn main() {
    let num_vec = vec![2, 4, 8];

    let double_vec = num_vec
        .iter()
        .map(|number| number * 2);

    println!("{double_vec:?}")
}