fn main() {
    let my_vec = vec![8,9,10, 15];

    let fourth = my_vec.get(3).unwrap_or_else(|| {
        if my_vec.get(0).is_some() {
            &my_vec[0]
        } else {
            &0
        }
    });

    println!("fourth: {fourth}");

}