fn in_char_vec(char_vec: &Vec<char>, check: char) {
    println!("Is {check} inside? {}", char_vec.iter().any(|&character| character == check));
}

fn main() {
    let char_vec = ('a'..'働').collect::<Vec<char>>(); // U+0061 ~ U+50CD - unicode scalar range (hex value)

    in_char_vec(&char_vec, 'i');
    in_char_vec(&char_vec, '뷁');
    in_char_vec(&char_vec, '鑿');

    let smaller_vec = ('A'..'z').collect::<Vec<char>>();
    println!("All alphabetic? {}", smaller_vec.iter().all(|&x| x.is_alphabetic()));
    println!("All less than the character 행? {}", smaller_vec.iter().all(|&x| x < '행'));
}