# 40. Types of &str

```rs
struct Book {
    title: &str
}

fn main() {
    let my_book = Book {
        title: "my_title"
    };
}

error[E0106]: missing lifetime specifier
 --> 1.rs:2:12
  |
2 |     title: &str
  |            ^ expected named lifetime parameter
  |
help: consider introducing a named lifetime parameter
  |
1 ~ struct Book<'a> {
2 ~     title: &'a str
```

struct 에서 &str 을 사용할때는 lifetime 을 명시해야 한다.

&str 는 다른곳의 데이터를 가리키는데 이 데이터가 언제까지 살아있는지를 컴파일러가 알아야 한다고 한다.

```rs
fn returns_reference() -> &str {
    let my_string = "David".to_string();
    &my_string
}

  |
5 | fn returns_reference() -> &str {
  |                           ^ expected named lifetime parameter
  |
  = help: this function's return type contains a borrowed value, but there is no value for it to be borrowed from
help: consider using the `'static` lifetime, but this is uncommon unless you're returning a borrowed value from a `const` or a `static`
  |
5 | fn returns_reference() -> &'static str {
  |                            +++++++
help: instead, you are more likely to want to return an owned value
  |
5 - fn returns_reference() -> &str {
5 + fn returns_reference() -> String {
```

이런식으로 return_reference 함수 안에서만 존재하는 String을 return 할수 없다.

```rs
fn returns_reference() -> &'static str {
    "David"
}
```

"David" 는 String literal 이고 프로그램의 데이터 섹션에 저장된다. -> 정적 메모리로 프로그램 바이너리에 포함된다고 한다.

그래서 프로그램이 실행될때 항상 유효하므로 'static lifetime 을 가진다고 한다.

그래서 위에서 컴파일이 안됬던 코드를 조금 바꿔주면 아래와 같이 된다.

```rs
struct Book<'a> {
    name: &'a str
}

fn main() {
    let my_book = Book {
        name: "my_book"
    };
}
```

`Book<'booklifetime>` 으로 Book이 살아있는동안 name도 존재한다 라고 표현해준건다.
