use std::sync::mpsc::channel;
use std::thread;
use std::time::Duration;
use std::thread::sleep;
use std::any::Any;



fn sleepy(time: u64) {
    sleep(Duration::from_millis(time));
}

#[derive(Debug)]
struct Book {
    name: String
}

fn book() -> Box<dyn Any + Send> {
    let book = Book {
        name: "My Book".to_string()
    };
    Box::new(book)
}

#[derive(Debug)]
struct Magazine {
    name: String
}

fn magazine() -> Box<dyn Any + Send> {
    let magazine = Magazine {
        name: "Nice Magazine".to_string()
    };
    Box::new(magazine)
}

fn main() {
    let (sender, receiver) = channel();

    let s1 = sender.clone();
    let s2 = sender.clone();

    thread::spawn(move|| {
        for _ in 0..5 {
            sleepy(100);
            s1.send(book()).unwrap();
        }
    });

    thread::spawn(move|| {
        for _ in 0..5 {
            sleepy(50);
            s2.send(magazine()).unwrap();
        }
    });

    while let Ok(any_type) = receiver.recv() {
        if let Some(book) = any_type.downcast_ref::<Book>() {
            println!("Book: {}", book.name);
        } else if let Some(magazine) = any_type.downcast_ref::<Magazine>() {
            println!("Magazine: {}", magazine.name);
        }
    }
}