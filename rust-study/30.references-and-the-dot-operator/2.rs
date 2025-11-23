struct Item {
    number : u8
}

impl Item {
    fn compare_number(&self, other_number: u8) -> bool {
        self.number == other_number
    }
}

fn main(){
    let item = Item { number: 10 };
    let reference_item = &item;
    println!("{}", reference_item.compare_number(10));
}