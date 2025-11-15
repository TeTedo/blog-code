enum ThingsInTheSky {
    Sun,
    Moon,
    Stars,
}

fn create_sky_state(time: i32) -> ThingsInTheSky {
    match time {
        6..=18 => ThingsInTheSky::Sun,
        19..=23 => ThingsInTheSky::Moon,
        0..=5 => ThingsInTheSky::Stars,
        _ => ThingsInTheSky::Stars,
    }
}

fn check_sky_state(sky_state: &ThingsInTheSky) {
    match sky_state {
        ThingsInTheSky::Sun => println!("The sky is sunny"),
        ThingsInTheSky::Moon => println!("The sky is dark"),
        ThingsInTheSky::Stars => println!("i can see the stars"),
    }
}

fn main() {
    let time = 10;
    let sky_state = create_sky_state(time);
    check_sky_state(&sky_state);
}