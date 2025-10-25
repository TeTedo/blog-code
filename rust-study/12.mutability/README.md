# 12. mutability

```rs
fn give_number(one: i32, two: i32) -> i32 {
    one + two
}

fn main () {
    let my_number = give_number(1, 2);
    println!("my_number: {}", my_number);
}
```

이런식으로 더하기 할수 있다.

{} 브리켓 안에서 return 시켜 값을 정할수도 있다.

```rs
fn times_tow(number: i32) -> i32 {
    number * 2
}

fn main () {

    let final_number = {
        let first_number = 1;
        let second_number = 2;
        times_tow(first_number + second_number)
    };

    println!("final_number: {}", final_number)
}
```
