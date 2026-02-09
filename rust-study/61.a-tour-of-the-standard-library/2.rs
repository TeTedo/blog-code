use std::str::FromStr;

fn main() {
    println!("{:?}", bool::from_str("false"));
    println!("{:?}", "true".parse::<bool>());
    println!("{:?}", true.then(|| {
        9
    }));

    let bool_vec = vec![true, false, true, true, false];
    let option_vec = bool_vec
        .iter()
        .map(|item| {
            item.then(|| {
                println!("Got a {item}!");
                "It's true, you know"
            })
        }).collect::<Vec<_>>();

    println!("{:?}", option_vec);
}