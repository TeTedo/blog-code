# 60. external crates

rand

```rs
use rand;

fn main() {
    for _ in 0..5 {
        let random_u16 = rand::random::<u16>();
        let random_char = rand::random::<char>();
        println!("Random u16: {}, Random char: {}", random_u16, random_char);
    }
}
```

gen_rng

```rs
use rand::{thread_rng, Rng};

fn main() {
    let mut rng = thread_rng();
    for _ in 0..5 {
        println!("Random number: {}", rng.gen_range('a'..='행'));
    }
}
```

fast rand

```rs
use fastrand::{Rng};

fn main() {
    let mut rng = Rng::new();
    for _ in 0..5 {
        let code = rng.u32('a' as u32..='행' as u32);
        if let Some(c) = char::from_u32(code) {
            println!("Random number: {}", c);
        }
    }
}
```
