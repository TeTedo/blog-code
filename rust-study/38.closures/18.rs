fn main() {
    let even_odd = vec!["even", "odd"].into_iter().cycle();

    let even_odd_vec = (0..6)
        .zip(even_odd)
        .collect::<Vec<(i32, &str)>>();

    println!("{even_odd_vec:?}");
}