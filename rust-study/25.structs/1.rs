struct FileDirectory;

fn main() {
    let file_directory = FileDirectory;

    println!("The size is {}", std::mem::size_of_val(&file_directory));
}