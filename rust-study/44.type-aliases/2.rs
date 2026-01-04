type SkipFiveTakeFive = std::iter::Take<std::iter::Skip<std::vec::IntoIter<char>>>;

fn skip_five_take_five(input: Vec<char>) -> SkipFiveTakeFive {
    input.into_iter().skip(5).take(5)
}

fn main() {
    let input = vec!['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    let result = skip_five_take_five(input);
    println!("{:?}", result);
}