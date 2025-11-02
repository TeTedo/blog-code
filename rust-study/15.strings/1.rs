fn main () {
    let m_name1 = "David"; // &str
    let m_name2 = "David".to_string(); // String
    let m_name3  = String::from("David"); // String

    // growable + shrinkable
    let mut m_name4 = "David".to_string();
    m_name4.push_str(" is a good boy");
    m_name4.push('!');
    println!("{}", m_name4);
}