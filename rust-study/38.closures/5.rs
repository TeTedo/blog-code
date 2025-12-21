fn main() {
    let num_vec = vec![2, 4, 6];

    num_vec
        .iter()
        .enumerate() // (0, 2), (1, 4), (2, 6)
        .for_each(|(index, number)|
            println!("index: {index}, number: {number}")
        );
}