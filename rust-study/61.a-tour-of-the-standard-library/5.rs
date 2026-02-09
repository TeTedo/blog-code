fn main() {
    let mut my_vec = vec!["sun", "moon", "sun", "moon", "moon", "sun"];
    my_vec.sort_unstable();
    my_vec.dedup();
    println!("{my_vec:?}");
}