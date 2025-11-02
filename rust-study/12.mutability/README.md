# 12. mutability

```rs
fn main () {
    let my_number = 10;
    my_number = 9;
    println!("my_number: {}", my_number);
}

cannot assign twice to immutable variable `my_number`
 --> 1.rs:3:5
  |
2 |     let my_number = 10;
  |         --------- first assignment to `my_number`
3 |     my_number = 9;
  |     ^^^^^^^^^^^^^ cannot assign twice to immutable variable
```

let 으로 변수를 선언하면 불변이 기본이다.

이를 바꾸려면 mut 를 사용해야 한다.

```rs
fn main () {
    let mut my_number = 10;
    my_number = 9;
    println!("my_number: {}", my_number);
}
```

mut를 써도 타입을 바꿀수는 없다.

```rs
fn main () {
    let mut my_number = 10;
    my_number = "hello, world!";
    println!("my_number: {}", my_number);
}

rror[E0308]: mismatched types
 --> 2.rs:3:17
  |
2 |     let mut my_number = 10;
  |                         -- expected due to this value
3 |     my_number = "hello, world!";
  |                 ^^^^^^^^^^^^^^^ expected integer, found `&str`

error: aborting due to 1 previous error
```

타입을 바꾸려면 새로 let 으로 선언을 하는데 이걸 shadowing 이라고 함

```rs
fn main() {
    let my_number = 8; // This is an i32
    println!("{}", my_number); // prints 8
    let my_number = 9.2; // This is an f64 with the same name. But it's not the first my_number - it is completely different!
    println!("{}", my_number) // Prints 9.2
}
```

새로운 블록을 넣어서 그안에서 선언하면 블록안에서만 적용된다.

```rs
fn main() {
    let my_number = 8; // This is an i32
    println!("{}", my_number); // prints 8
    {
        let my_number = 9.2; // This is an f64. It is not my_number - it is completely different!
        println!("{}", my_number) // Prints 9.2
                                  // But the shadowed my_number only lives until here.
                                  // The first my_number is still alive!
    }
    println!("{}", my_number); // prints 8
}
```
