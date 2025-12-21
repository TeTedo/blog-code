# 38. Closure

closure 는 외부 변수를 내부 함수에서 사용하는것이다.

rust 에서는 위 내용 + 익명함수도 closure 라고 한다.

예시는 아래와 같다.

```rs
fn main() {
    let my_number = 10;
    let my_closure = |x: i32| println!("This is a closure: {}", x + my_number);

    my_closure(10);
}
```

{}을 사용해서 좀 더 복잡하게 만들어 볼수도 있다.

```rs
fn main() {
    let my_closure = || {
        let my_number = 7;
        let other_number = 10;
        println!("The two numbers are {my_number} and {other_number}");
        my_number + other_number
    };

    let result = my_closure();
    println!("The result is {result}");
}
```

zero cost abstractions

```rs
.iter().map().filter().inspect().collect()
```

rust 는 위 같은 체이닝 메서드를 써도 속도는 똑같다.

대신 컴파일 할때 시간이 더든다고 한다.

다른 closure 예시를 더 보면 unwrap_or_else 안에 closure 를 사용하는 거다.

```rs
fn main() {
    let my_vec = vec![8,9,10, 15];

    let fourth = my_vec.get(3).unwrap_or_else(|| {
        if my_vec.get(0).is_some() {
            &my_vec[0]
        } else {
            &0
        }
    });

    println!("fourth: {fourth}");
}
```

만약 4번째가 없다면 첫번째가 출력되고 첫번째도 없으면 0이 나오게 된다.

panic 을 일으키지 않고 예외처리를 한것이다.

---

map

```rs
fn main() {
    let num_vec = vec![2, 4, 8];

    let double_vec = num_vec
        .iter()
        .map(|number| number * 2);

    println!("{double_vec:?}")
}

Map { iter: Iter([2, 4, 8]) }
```

collect 를 해주지 않으면 Map 이라는 타입안에 iter 로 그대로 저장된다.

아직 실행시키지 않고 가지고 있다가 collect 를 실행하면 계산이 된다고 한다.

map 은 Map 의 반환타입이 있지만 foreach는 반환타입이 없다.

```rs
fn main() {
    let num_vec = vec![2, 4, 6];

    num_vec
        .iter()
        .enumerate() // (0, 2), (1, 4), (2, 6)
        .for_each(|(index, number)|
            println!("index: {index}, number: {number}")
        );
}
```

zip 을 이용하면 다른 타입의 vec을 합칠수 있다.

두 이터레이터를 순서대로 묶어 튜플 이터레이터 생성한다.

```rs
use std::collections::HashMap;

fn main() {
    let some_numbers = vec![0, 1, 2, 3, 4, 5]; // a Vec<i32>
    let some_words = vec!["zero", "one", "two", "three", "four", "five"]; // a Vec<&str>

    let number_word_hashmap = some_numbers
        .into_iter()                 // now it is an iter
        .zip(some_words.into_iter()) // inside .zip() we put in the other iter. Now they are together.
        .collect::<HashMap<_, _>>();

    println!("For key {} we get {}.", 2, number_word_hashmap.get(&2).unwrap());
}
```

&str 에서 .char() 라는 메소드가 있는데 만약 struct 에 char 라는 변수가 있다면 헷갈릴수 있다.

```rs
struct simple {
    char : Vec<String>
}
```

그래서 .char() 도 상관없지만 .char_indices() 라는걸 사용할 수 도 있다.

```rs
fn main() {
    let big_string = "Hello there, I am a &str";

    println!("big_string: {}", big_string.chars().count());

    big_string.char_indices().for_each(|(index, char)| {
        println!("index: {index}, char: {char}");
    });

    println!("big_string.char_indices().count(): {}", big_string.char_indices().count());
}
```

pipe 안에 사용하지 않지만 값을 받을수도 있다.

이 경우 |\_| 로 사용해서 컴파일러의 경고를 없앨수 있다.

```rs
fn main() {
    let my_vec = vec![8, 9, 10];
    my_vec.iter().for_each(|_| println!("Hello"));
}
```

---

filter, filter_map 으로 조건에 맞는것들만 걸러낼 수 있다.

```rs
fn main() {
    let months = vec!["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let filtered_months = months
        .into_iter()                         // make an iter
        .filter(|month| month.len() < 5)     // We don't want months more than 5 bytes in length.
                                             // We know that each letter is one byte so .len() is fine
        .filter(|month| month.contains("u")) // Also we only like months with the letter u
        .collect::<Vec<&str>>();

    println!("{:?}", filtered_months);
}

["June", "July"]
```

filter map 은 아래와 같이 사용할 수 있다.

```rs
struct Company {
    name: String,
    ceo: Option<String>
}

impl Company {
    fn new(name: &str, ceo: &str) -> Self {
        let ceo = match ceo {
            "" => None,
            ceo => Some(ceo.to_string())
        };

        Self {
            name: name.to_string(),
            ceo
        }
    }

    fn get_ceo(&self) -> Option<String> {
        self.ceo.clone()
    }
}

fn main() {
    let company_vec = vec![
        Company::new("Umbrella Corporation", "Unknown"),
        Company::new("Ovintiv", "Doug Suttles"),
        Company::new("The Red-Headed League", ""),
        Company::new("Stark Enterprises", ""),
    ];

    let all_the_ceos = company_vec
        .into_iter()
        .filter_map(|company| company.get_ceo()) // filter_map needs Option<T>
        .collect::<Vec<String>>();

    println!("{:?}", all_the_ceos);
}
```

다른 filter map 의 예시를 보자.

```rs
fn main() {
    let user_input = vec!["8.9", "Nine point nine five", "8.0", "7.6", "eleventy-twelve"];

    let actual_numbers = user_input
        .into_iter()
        .filter_map(|input| input.parse::<f32>().ok())
        .collect::<Vec<f32>>();

    println!("{:?}", actual_numbers);
}
```

ok_or_else 를 사용하여 closure 를 만들수도 있다.

```rs
struct Company {
    name: String,
    ceo: Option<String>,
}

impl Company {
    fn new(name: &str, ceo: &str) -> Self {
        let ceo = match ceo {
            "" => None,
            ceo => Some(ceo.to_string()),
        };
        Self {
            name: name.to_string(),
            ceo,
        }
    }

    fn get_ceo(&self) -> Option<String> {
        self.ceo.clone()
    }
}

fn main() {
    let company_vec = vec![
        Company::new("Umbrella Corporation", "Unknown"),
        Company::new("Ovintiv", "Doug Suttles"),
        Company::new("The Red-Headed League", ""),
        Company::new("Stark Enterprises", ""),
    ];

    let mut results_vec = vec![]; // Pretend we need to gather error results too

    company_vec
        .iter()
        .for_each(|company| results_vec.push(company.get_ceo().ok_or("No CEO found")));

    for item in results_vec {
        println!("{:?}", item);
    }
}

Ok("Unknown")
Ok("Doug Suttles")
Err("No CEO found")
Err("No CEO found")
```

ok_or 을 사용하여 에러메시지를 넣어줬다.

ok_or_else 를 이용해서 closure를 넣을수도 있다.

```rs
company_vec.iter().for_each(|company| {
    results_vec.push(company.get_ceo().ok_or_else(|| {
        let err_message = format!("No CEO found for {}", company.name);
        err_message
    }))
});
```

아래는 Option 과 map 을 사용한 예시이다.

```rs
fn main() {
    let some_output = Some(vec![8,9,10]);

    let first = some_output
        .clone()
        .map(|some_vec| {
            some_vec.iter().map(|num| num + 1).collect::<Vec<_>>()
        });

    println!("{first:?}");

    let second = some_output
        .clone()
        .map(|some_vec| match some_vec.len() {
            0 => None,
            1 => Some(vec![some_vec[0]]),
            _ => Some(some_vec)
        });

    println!("{second:?}");
}
```

서버랑 통신중을 가정하고 결과에 대한 처리를 예시로 작성했다.

```rs
fn main() {
    let first_try = vec![Some("success!1"), None, Some("success!1"), Some("success!1"), None];
    let second_try = vec![None, Some("success!2"), Some("success!2"), Some("success!2"), Some("success!2")];
    let third_try = vec![Some("success!3"), Some("success!3"), Some("success!3"), Some("success!3"), None];

    for i in 0..first_try.len() {
        println!("{:?}", first_try[i].and(second_try[i]).and(third_try[i]));
    }
}

None
None
Some("success!3")
Some("success!3")
None
```

and 는 && 와 비슷하다고 생각하며 된다.

Some 일때 and 를 넘어가고 None 이라면 넘어가지않고 None 이 된다.

만약 or 이라면 || 와 같다. -> 만약 3개가 다 Some 이라면 첫번째 Some 이 출력된다.
