struct SomeStruct {
    name: String,
    number: u8,
    data: [u8; 1000]
}

fn take_thing<T>(thing: T) {

}

fn main() {
    let my_struct = SomeStruct {
        name: String::from("my_name"),
        number: 10,
        data: [0; 1000]
    };

    println!("The struct is {} bytes", std::mem::size_of_val(&my_struct));
}