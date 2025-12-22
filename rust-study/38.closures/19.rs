fn main() {
    let ten_chars = ('a'..).take(10).collect::<Vec<_>>();
    println!("{ten_chars:?}");

    let skip_then_ten_chars = ('a'..).skip(1300).take(10).collect::<Vec<_>>();
    println!("{skip_then_ten_chars:?}");
}