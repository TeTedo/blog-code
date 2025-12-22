# 39. The dbg! macro and .inspect

```rs
fn main() {
    let my_number = 9;
    dbg!(my_number);
    println!("my_number: {}", my_number);
}

[1.rs:3:5] my_number = 9
my_number: 9
```

dbg는 어느라인, 변수 등 더 자세하게 로그가 찍힌다.

```rs
fn main() {
    let mut my_number = dbg!(9);
    dbg!(my_number += 10);

    let new_vec = dbg!(vec![8, 9, 10]);

    let double_vec = dbg!(new_vec.iter().map(|x| x * 2).collect::<Vec<i32>>());

    dbg!(double_vec);
}

[1.rs:2:25] 9 = 9
[1.rs:3:5] my_number += 10 = ()
[1.rs:5:19] vec![8, 9, 10] = [
    8,
    9,
    10,
]
[1.rs:7:22] new_vec.iter().map(|x| x * 2).collect::<Vec<i32>>() = [
    16,
    18,
    20,
]
[1.rs:9:5] double_vec = [
    16,
    18,
    20,
]
```

inspect 를 이용해서 iterator 중간에 값을 찍어볼수도 있다.

```rs
fn main() {
    let new_vec = vec![8, 9, 10];

    let double_vec = new_vec
        .iter()
        .inspect(|first_item| { dbg!(first_item); })
        .map(|x| x * 2)
        .inspect(|next_item| { dbg!(next_item); })
        .collect::<Vec<i32>>();

    dbg!(double_vec);
}

[2.rs:6:33] first_item = 8
[2.rs:8:32] next_item = 16
[2.rs:6:33] first_item = 9
[2.rs:8:32] next_item = 18
[2.rs:6:33] first_item = 10
[2.rs:8:32] next_item = 20
[2.rs:11:5] double_vec = [
    16,
    18,
    20,
]
```
