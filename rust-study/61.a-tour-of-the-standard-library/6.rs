fn main() {
    let mut my_vec = vec![10; 10000];
    println!("{}", my_vec.capacity());
    my_vec.push(9);
    my_vec.shrink_to_fit();
    println!("{}", my_vec.capacity());
}