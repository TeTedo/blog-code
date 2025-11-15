# 27. loops

rust에서 반복문은 for, while, loop 3가지로 작성할 수 있다.

loop 키워드를 이용해서 반복문을 돌릴수 있다.

```rs
fn main() {
    let mut counter = 0;

    loop {
        counter += 1;
        println!("counter: {}", counter);
        if counter == 10 {
            break;
        }
    }
}

counter: 1
counter: 2
counter: 3
counter: 4
counter: 5
counter: 6
counter: 7
counter: 8
counter: 9
counter: 10
```

특이한건 loop 에 이름을 지정할수 있다는 것이다.

```rs
fn main() {
    let mut counter = 0;
    let mut counter2 = 0;

    'first_loop: loop {
        println!("counter: {}", counter);
        counter += 1;
        if counter == 10 {
            'second_loop: loop {
                println!("counter2: {}", counter2);
                counter2 += 1;
                if counter2 == 10 {
                    break 'first_loop;
                }
            }
        }
    }
}
```

second_loop 에서 first_loop를 바로 끝낼수 있어서 코드의 길이를 줄일수 있을것 같다.

for 문에서 .. 과 ..= 을 이용해서 range를 표시한다.

```rs
fn main() {
    for number in 0..3 {
        println!("number: {}", number);
    }

    for _ in 0..3 {
        println!("Hello");
    }
}

number: 0
number: 1
number: 2
Hello
Hello
Hello
```

\_ 를 쓰면 컴파일러에게 안쓰는 값이라고 알려줄수 있다.

loop 를 이용해서 변수에 값을 할당해줄수도 있다.

```rs
fn main() {

    let mut counter = 5;

    let my_number = loop {
        counter += 1;
        if counter == 10 {
            break counter;
        }
    };

    println!("my_number: {}", my_number);
}

my_number: 10
```
