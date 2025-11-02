# 18. Mutable References

```rs
fn main () {
    let mut my_number = 9;
    let num_ref = &mut my_number;

    num_ref = 10;
}
```

my_number 는 i32 타입이고 num_ref 는 &mut i32 타입이다.

그래서 더하려고 한다면 값을 가져오는 reference가 아닌 \*를 써야한다.

```rs
fn main () {
    let mut my_number = 9;
    let num_ref = &mut my_number;

    *num_ref = 10;
}
```

&mut 이 2개있으면 \*도 2개를 써야한다.

```rs
fn main () {
    let mut my_number = 9;
    let num_ref = &mut &mut my_number;

    **num_ref = 10;
    println!("my_number: {}", my_number);
}
```

mutable 과 immutable 을 같이쓰면 아래와 같은 문제가 있다.

```rs
fn main () {
    let mut number = 10;
    let number_ref = &number;
    let number_change = &mut number;
    *number_change = 11;
    println!("number: {}", number_ref);
}

let number_ref = &number;
  |                      ------- immutable borrow occurs here
4 |     let number_change = &mut number;
  |                         ^^^^^^^^^^^ mutable borrow occurs here
5 |     *number_change = 11;
6 |     println!("number: {}", number_ref);
  |                            ---------- immutable borrow later used here
```

number_ref 는 immutable 로 가져왔는데 값을 바꾼후 다시 immutable 로 선언한 변수를 print 하려고 했기 때문이다.

그래서 순서를 조금 바꿔주면 된다.

```rs
fn main () {
    let mut number = 10;
    let number_change = &mut number;
    *number_change = 11;
    let number_ref = &number;
    println!("number: {}", number_ref);
}
```

shadowing 을 보면 아래와 같다.

```rs
fn main() {
    let country = "대한민국";
    let country_ref = &country;
    let country = 8;
    println!("{}, {}", country_ref, country);
}

대한민국, 8
```
