# 45. The todo! macro

```rs
struct SomeType {
    name: String,
    number: u8
}

fn some_function(input: SomeType) -> Vec<SomeType> {

}

fn main() {

}


6 | fn some_function(input: SomeType) -> Vec<SomeType> {
  |    -------------                     ^^^^^^^^^^^^^ expected `Vec<SomeType>`, found `()`
```

이걸 todo 를 사용해서 compile 이 되게 할수 있다.

```rs
struct SomeType {
    name: String,
    number: u8
}

fn some_function(input: SomeType) -> Vec<SomeType> {
    todo!()
}

fn main() {

}
```

근데 여기서 some_function 을 main 에서 실행시키면 panic 이 뜬다.
