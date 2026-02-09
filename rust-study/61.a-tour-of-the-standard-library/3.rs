// leak

#[derive(Debug)]
struct NeedsAStatic {
    name: &'static str
}

fn get_our_data() -> String {
    "Data".to_string()
}

fn main() {
    let our_data = get_our_data(); // String
    let boxed_data = Box::new(our_data); // Box<String>
    let leaked_data = Box::leak(boxed_data); // &'static str


    let our_data = get_our_data();
    let our_struct = NeedsAStatic {
        name : leaked_data
    };

    println!("{our_struct:?}");
}