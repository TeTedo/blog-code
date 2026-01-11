#[cfg(target_os = "linux")]
fn do_something() {
    println!("I am running on Linux");
}

#[cfg(target_os = "windows")]
fn do_something() {
    println!("I am running on Windows");
}

#[cfg(target_os = "macos")]
fn do_something() {
    println!("I am running on macOS");
}

fn main() {
    do_something();
}