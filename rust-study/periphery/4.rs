use std::time::{Duration, Instant};
use std::thread::sleep;

fn main() {
    let time_1 = Instant::now();
    sleep(Duration::from_secs(5));

    println!("{:?}", time_1.elapsed());
    println!("{:?}", time_1.elapsed());
    println!("{:?}", time_1.elapsed());

}