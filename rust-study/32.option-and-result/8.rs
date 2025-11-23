fn main() {
    let my_vec = vec![2,3,4];
    let get_one = my_vec.get(0);
    let get_two = my_vec.get(10);

    println!("get_one: {:?}", get_one);
    println!("get_two: {:?}", get_two);
}