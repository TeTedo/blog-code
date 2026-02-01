use std::sync::mpsc::channel;
use std::thread;

fn main() {
    let (sender, receiver) = channel();

    let s1 = sender.clone();
    let s2 = sender.clone();

    thread::spawn(move|| {
        s1.send(1).unwrap();
    });

    thread::spawn(move|| {
        s2.send(2).unwrap();
    });

    println!("{}", receiver.recv().unwrap());
    println!("{}", receiver.recv().unwrap());
}