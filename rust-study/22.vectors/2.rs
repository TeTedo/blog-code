fn main () {
    let name1 = String::from("David");
    let name2 = String::from("John");
    let name3 = String::from("Jane");
    let name4 = String::from("Jim");
    let name5 = String::from("Jill");
    let name6 = String::from("Jack");
    let name7 = String::from("Jill");
    let name8 = String::from("Jill");
    let name9 = String::from("Jill");
    let name10 = String::from("Jill");

    let mut my_vec = Vec::new();
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name1);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name2);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name3);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name4);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name5);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name6);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name7);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name8);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name9);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name10);
    println!("my_vec: {:?}", my_vec);
}