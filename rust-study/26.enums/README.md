# 26. Enums

enum을 이용해서 집합처럼 값들을 열거해서 쓸수 있다.

```rs
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

my_thing: Sun
my_thing: Sun
```

use 키워드를 중간에 사용해서 {Enum}:: 를 생략하고 쓸수 있다.

좀더 복잡한 enum 써보기..

```rs
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
```

enum 요소들을 숫자로 캐스팅하면 요소의 인덱스로 나온다.

```rs
enum Season {
    Spring,
    Summer,
    Autumn,
    Winter,
}

fn main() {
    use Season::*;
    let four_seasons = vec![Spring, Summer, Autumn, Winter];
    for season in four_seasons {
        println!("season: {}", season as i32);
    }
}

season: 0
season: 1
season: 2
season: 3
```

enum 요소들에 숫자를 지정할수도 있다.

```rs
enum Star {
    BrownDwarf = 10,
    RedDwarf = 50,
    YellowStar = 100,
    RedGiant = 1000,
    DeadStar, // Think about this one. What number will it have?
}

fn main() {
    use Star::*;
    let starvec = vec![BrownDwarf, RedDwarf, YellowStar, RedGiant];
    for star in starvec {
        match star as u32 {
            size if size <= 80 => println!("Not the biggest star."), // Remember: size doesn't mean anything. It's just a name we chose so we can print it
            size if size >= 80 => println!("This is a good-sized star."),
            _ => println!("That star is pretty big!"),
        }
    }
    println!("What about DeadStar? It's the number {}.", DeadStar as u32);
}

Not the biggest star.
Not the biggest star.
This is a good-sized star.
This is a good-sized star.
What about DeadStar? It's the number 1001.
```

숫자를 지정하지 않으면 이전의 숫자에 +1을 한값으로 된다.

enum을 타입을 정의하는것처럼 쓸수도 있다.

```rs
enum Number {
    U32(u32),
    I32(i32),
}

fn get_number(input: i32) -> Number {
    let number = match input.is_positive() {
        true => Number::U32(input as u32),
        false => Number::I32(input as i32),
    };
    number
}

fn main() {
    let numbers = vec![get_number(10), get_number(-10), get_number(0)];
    for number in numbers {
        match number {
            Number::U32(n) => println!("U32: {}", n),
            Number::I32(n) => println!("I32: {}", n),
        }
    }
}

U32: 10
I32: -10
I32: 0
```
