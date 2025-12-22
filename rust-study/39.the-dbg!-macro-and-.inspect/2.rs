fn main() {
    let new_vec = vec![8, 9, 10];

    let double_vec = new_vec
        .iter()
        .inspect(|first_item| { dbg!(first_item); })
        .map(|x| x * 2)
        .inspect(|next_item| { dbg!(next_item); })
        .collect::<Vec<i32>>();

    dbg!(double_vec);
}