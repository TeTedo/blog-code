use std::ops::{Deref, DerefMut};

struct HoldsANumber(u8);

impl Deref for HoldsANumber {
    type Target = u8;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for HoldsANumber {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

fn main() {
    let my_number = HoldsANumber(20);
    println!("{}", *my_number + 20);
    println!("{}", my_number.checked_add(20).unwrap() + 10);
}