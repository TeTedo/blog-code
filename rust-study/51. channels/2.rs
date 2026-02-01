use std::sync::mpsc::channel;
use std::thread;
use std::time::Duration;
use std::thread::sleep;

fn sleepy(time: u64) {
    sleep(Duration::from_millis(time));
}

fn main() {
    let (sender, receiver) = channel();

    let s1 = sender.clone();
    let s2 = sender.clone();

    thread::spawn(move|| {
        sleepy(1000);
        s1.send(1).unwrap();
    });

    thread::spawn(move|| {
        sleepy(500);
        s2.send(2).unwrap();
    });

    println!("{:?}", receiver.try_recv());
    println!("{:?}", receiver.recv_timeout(Duration::from_millis(1000)));
}