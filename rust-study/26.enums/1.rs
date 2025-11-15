#[derive(Debug)]
enum ThingsInTheSky {
    Sun,
    Moon,
    Stars,
}

fn main() {
    let my_thing = ThingsInTheSky::Sun;
    println!("my_thing: {:?}", my_thing);

    use ThingsInTheSky::*;
    let my_thing = Sun;
    println!("my_thing: {:?}", my_thing);
}