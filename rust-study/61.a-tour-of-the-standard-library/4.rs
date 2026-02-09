fn main() {
    let mut my_vec = vec![100, 90, 80, 0, 0, 0];
    my_vec.sort_unstable();
    println!("{my_vec:?}");
}