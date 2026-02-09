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