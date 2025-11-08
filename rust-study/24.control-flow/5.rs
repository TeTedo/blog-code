fn main() {
    let children = 5;
    let married = true;

    match (children, married) {
        (children, married) if children > 0 && married => println!("You have {} children and you are married", children),
        (children, married) if children > 0 && !married => println!("You have {} children and you are not married", children),
        (c, m) if c == 0 && m => println!("You are married but you don't have children"),
        (children, married) if children == 0 && !married => println!("You are not married and you don't have children"),
        _ => println!("You are not married and you don't have children"),
    }
}