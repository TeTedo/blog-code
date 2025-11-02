# 17. More and References

```rs
fn main () {
    let country = String::from("대한민국");
    let ref_one = &country;
    let ref_two = &country;
}
```

reference를 이용하면 데이터를 가져올수 있지만 바꿀수는 없다.

```rs
fn return_str() -> &str {
    let country = String::from("대한민국");
    &country
}

fn main () {
    let my_country = return_str();
    println!("my_country: {}", my_country);
}
```

return_str 함수안에서 String을 만들고 return 하려고 한다.

하지만 컴파일 하려고 하면 에러난다.

reference 를 return 하려고 하는데 country 변수는 return_str 함수 안에서만 존재하기 때문이다.
