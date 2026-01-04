# 44. Type Aliases

type 을 정의해서 쓸수 있다.

```rs
type MyString = String;

fn main() {
    let my_string = MyString::from("Hello, world!");
    println!("my_string: {}", my_string);
}
```

긴 타입을 짧게 새로 정의할수도 있다.

```rs
type SkipFiveTakeFive = std::iter::Take<std::iter::Skip<std::vec::IntoIter<char>>>;

fn skip_five_take_five(input: Vec<char>) -> SkipFiveTakeFive {
    input.into_iter().skip(5).take(5)
}

fn main() {
    let input = vec!['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    let result = skip_five_take_five(input);
    println!("{:?}", result);
}
```

struct 로 이용해서 완전 새로운 타입을 만들수도 있다.

```rs
type MyString = String;
struct MyOtherString(String);

fn main() {
    let my_string = MyString::from("Hello, world!");
    let my_other_string = MyOtherString(String::from("Hello, world!"));
}
```
