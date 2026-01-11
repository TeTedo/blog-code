fn returns_a_closure() -> impl Fn(i32) {
    |x| println!("{x}")
}

fn main() {
    let closure = returns_a_closure();
    closure(10);
}