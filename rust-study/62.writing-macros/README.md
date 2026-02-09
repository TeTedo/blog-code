# 62. writing macros

매크로 만드는법

macro_rules!로 매크로를 만드는 가장 기본적인 형태다.

```rs
macro_rules! give_six {
    () => {
        6
    };
}

fn main() {
    let six = give_six!();
    println!("{}", six);
}
```

파라미터에 따라서 다르게 로직을 작성할 수 있다.

```rs
macro_rules! six_or_print {
    (6) => {
        6
    };
    () => {
        println!("You didn't give me 6.");
    };
}

fn main() {
    let my_number = six_or_print!(6);
    six_or_print!();
}
```

이상한 값을 넣을수도 있다.

```rs
macro_rules! might_print {
    (THis is strange input 하하はは哈哈 but it still works) => {
        println!("You guessed the secret message!")
    };
    () => {
        println!("You didn't guess it");
    };
}

fn main() {
    might_print!(THis is strange input 하하はは哈哈 but it still works);
    might_print!();
}
```

---

```rs
macro_rules! might_print {
    ($input:expr) => {
        println!("You gave me: {}", $input);
    }
}

fn main() {
    might_print!(6);
}
```

$input:expr → expr(expression) 타입의 인자를 $input으로 캡처

안에 디버그 프린터를 이용해서 vec 도 나타낼수 있다.

```rs
macro_rules! might_print {
    ($input:expr) => {
        println!("You gave me: {:?}", $input);
    }
}

fn main() {
    might_print!(6);
    let my_vec = vec![1, 2, 3];
    might_print!(my_vec);
}
```

ident, expr

```rs
macro_rules! check {
    ($input1:ident, $input2:expr) => {
        println!(
            "Is {:?} equal to {:?}? {:?}",
            $input1,
            $input2,
            $input1 == $input2
        );
    };
}

fn main() {
    let x = 6;
    let my_vec = vec![7, 8, 9];
    check!(x, 6);
    check!(my_vec, vec![7, 8, 9]);
    check!(x, 10);
}
```

token tree

Rust 코드에서 하나의 토큰 또는 (), [], {} 로 감싸진 토큰 그룹을 의미한다. 사실상 뭐든 받을 수 있는 가장 유연한 캡처 타입이다.

```rs
macro_rules! print_anything {
    ($input:tt) => {
        let output = stringify!($input);
        println!("{}", output);
    };
}

fn main() {
    print_anything!(ththdoetd);
    print_anything!(87575oehq75onth);
    let my_string = String::from("Hello, world!");
    print_anything!(my_string);
}

ththdoetd
87575oehq75onth
my_string
```

ththdoetd → 존재하지 않는 식별자지만 tt라서 OK (토큰으로만 취급)

87575oehq75onth → 마찬가지

my_string → 변수의 값이 아닌 my_string이라는 토큰 자체가 출력됨

---

반복 패턴

$(...),\*는 반복 패턴이다.

```rs
macro_rules! print_anything {
    ($($input1:tt),*) => {
        let output = stringify!($($input1),*);
        println!("{}", output);
    };
}


fn main() {
    print_anything!(ththdoetd, rcofe);
    print_anything!();
    print_anything!(87575oehq75onth, ntohe, 987987o, 097);
}
```

($($input1:tt),\*) 는 "쉼표로 구분된 0개 이상의 토큰"을 받겠다는 뜻이다.

나누는 기준을 바꿀수도 있다.

```rs
macro_rules! print_anything {
    ($($input1:tt);*) => {
        let output = stringify!($($input1),*);
        println!("{}", output);
    };
}


fn main() {
    print_anything!(ththdoetd; rcofe);
    print_anything!();
    print_anything!(87575oehq75onth; ntohe; 987987o; 097);
}
```

---

make function

```rs
macro_rules! make_a_function {
    ($name:ident, $($input:tt),*) => { // First you give it one name for the function, then it checks everything else
        fn $name() {
            let output = stringify!($($input),*); // It makes everything else into a string
            println!("{}", output);
        }
    };
}


fn main() {
    make_a_function!(print_it, 5, 5, 6, I); // We want a function called print_it() that prints everything else we give it
    print_it();
    make_a_function!(say_its_nice, this, is, really, nice); // Same here but we change the function name
    say_its_nice();
}
```

---

자기자신의 macro 를 사용할수도 있다.

```rs
macro_rules! my_macro {
    () => {
        println!("Let's print this.");
    };
    ($input:expr) => {
        my_macro!();
    };
    ($($input:expr),*) => {
        my_macro!();
    }
}

fn main() {
    my_macro!(vec![8, 9, 0]);
    my_macro!(toheteh);
    my_macro!(8, 7, 0, 10);
    my_macro!();
}
```

이런 형식으로 vec, dbg 등 여러 매크로가 만들어져있다.
