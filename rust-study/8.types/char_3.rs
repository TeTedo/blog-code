use std::mem::size_of;

fn main() {
    println!("Size of a char: {}", size_of::<char>()); // 4 bytes
    println!("Size of string containing 'a': {}", "a".len()); // .len() gives the size of the string in bytes
    println!("Size of string containing 'ß': {}", "ß".len());
    println!("Size of string containing '안': {}", "안".len());
    println!("Size of string containing '𓅱': {}", "𓅱".len());
}