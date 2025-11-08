# 19. Giving references to functions

```rs
fn print_country(country_name: String) {
    println!("My country is {}", country_name);
}

fn main() {
    let country = String::from("대한민국");
    print_country(country);
}
```

이건 정상 작동되는데 아래 print_country 를 한번 더 쓰면 컴파일 에러가 난다.

```rs
fn print_country(country_name: String) {
    println!("My country is {}", country_name);
}

fn main() {
    let country = String::from("대한민국");
    print_country(country);
    print_country(country);
}
```

country라는 변수로 만든걸 print_country 함수로 소유권이 넘어갔기 때문에 그다음 print_country에 country가 들어가지 못한다.

```rs
fn print_country(country_name: String) -> String {
    println!("My country is {}", country_name);
    country_name
}

fn main() {
    let country = String::from("대한민국");
    let country_print = print_country(country);
    print_country(country_print);
}
```

두번 실행시키고 싶다면 String 을 return 받고 이걸 다시 함수에 넣어줘야 한다.

아니면 reference 를 넘겨서 country 는 아직 자기데이터를 소유하고 있는 상태로 있으면된다.

```rs
fn print_country(country_name: &String) {
    println!("My country is {}", country_name);
}

fn main() {
    let country = String::from("대한민국");
    print_country(&country);
    print_country(&country);
}
```

function 에서 &mut reference를 받아 값을 사용할수 있다.

```rs
fn add_is_great(country_name: &mut String) {
    country_name.push_str(" is great!");
    println!("{}", country_name);
}

fn main() {
    let mut country = String::from("대한민국");
    add_is_great(&mut country);
    add_is_great(&mut country);
}

대한민국 is great!
대한민국 is great! is great!
```

좀 다르게 작성할수 있다.

```rs
fn add_is_great(mut country_name: String) {
    country_name.push_str(" is great!");
    println!("{}", country_name);
}

fn main() {
    let country = String::from("대한민국");
    add_is_great(country);
}
```

country 가 `대한민국`의 소유권을 가지고 있다가 아예 add_is_great 함수에게 주는거다.
