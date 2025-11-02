fn main() {
    let mut my_name = String::from("");
    println!("Length is {} and capacity is {}", my_name.len(), my_name.capacity());
    my_name.push_str("David!");
    println!("Length is {} and capacity is {}", my_name.len(), my_name.capacity());
    my_name.push_str(" and I live in Seoul");
    println!("Length is {} and capacity is {}", my_name.len(), my_name.capacity());
    my_name.push('!');
    println!("Length is {} and capacity is {}", my_name.len(), my_name.capacity());
}