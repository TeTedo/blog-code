# 23. tuples

여러타입을 쓰고 싶다면 tuples를 쓸수 있다.

```rs
fn main() {
    let my_tuple = (8, "Dave", vec![1,2,3]);
    println!("my_tuple: {:?}", my_tuple);
}

my_tuple: (8, "Dave", [1, 2, 3])
```

컴파일러를 화나게하면 무슨 타입인지 알수있다..

```rs
3 |     my_tuple.jasidfjasiod();
  |              ^^^^^^^^^^^^ method not found in `({integer}, &str, Vec<{integer}>)`
```

main 에는 사실 빈 튜플이 숨겨 있던 거임

```rs
fn main() -> () {
    let x = ();
    x
}
```

튜플에 있는데이터는 .0 .1처럼 인덱스로 뽑을수 있다.

```rs
fn main() {
    let random_tuple = ("Here is a name", 8, vec!['a'], 'b', [8, 9, 10], 7.7);
    println!(
        "Inside the tuple is: First item: {:?}
Second item: {:?}
Third item: {:?}
Fourth item: {:?}
Fifth item: {:?}
Sixth item: {:?}",
        random_tuple.0,
        random_tuple.1,
        random_tuple.2,
        random_tuple.3,
        random_tuple.4,
        random_tuple.5,
    )
}

Inside the tuple is: First item: "Here is a name"
Second item: 8
Third item: ['a']
Fourth item: 'b'
Fifth item: [8, 9, 10]
Sixth item: 7.7
```

튜플을 이용해서 vector 에 두가지 타입을 넣는것 처럼 쓸수 있다.

```rs
// Vec<(i32, &str)>

fn main() {
    let vec = vec![(8, "Dave"), (9, "John"), (10, "Jane")];
    println!("vec: {:?}", vec);
}

vec: [(8, "Dave"), (9, "John"), (10, "Jane")]
```

구조분해할당도 가능하다

```rs
fn main() {
    let (a, b, c) = (8, 9, 10);
    println!("a: {}", a);
    println!("b: {}", b);
    println!("c: {}", c);
}

a: 8
b: 9
c: 10
```
