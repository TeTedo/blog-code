#[repr(C)]
struct SomeStruct {
    name: String,
    number: u8,
    data: [u8; 1000]
}

fn main() {
    let my_struct = SomeStruct {
        name: String::from("my_name"),
        number: 10,
        data: [0; 1000]
    };
}