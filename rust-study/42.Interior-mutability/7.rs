use std::rc::Rc;

fn main() {
    let large_string = "A".repeat(1000);
    
    println!("=== String::clone() ===");
    let cloned1 = large_string.clone();
    let cloned2 = large_string.clone();
    
    println!("large_string:     {:p}", large_string.as_ptr());
    println!("cloned1:  {:p}", cloned1.as_ptr());
    println!("cloned2:  {:p}", cloned2.as_ptr());
    
    println!("\n=== Rc::clone() ===");
    let rc_string = Rc::new(large_string);
    let rc_cloned1 = Rc::clone(&rc_string);
    let rc_cloned2 = Rc::clone(&rc_string);
    
    println!("rc_string:  {:p}", Rc::as_ptr(&rc_string));
    println!("rc_cloned1: {:p}", Rc::as_ptr(&rc_cloned1));
    println!("rc_cloned2: {:p}", Rc::as_ptr(&rc_cloned2));
    
    println!("\nreference count: {}", Rc::strong_count(&rc_string));
}