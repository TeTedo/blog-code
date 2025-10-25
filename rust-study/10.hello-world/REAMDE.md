# 10. hell-world

언어 공부의 국룰 hello world 찍어봐야겠지

```rs
fn main () {
    println!("Hello, World!");
}
```

println 뒤에 ! 를 붙이는데 이건 macro 라고 한다.

macro 는 미리 정의해논 코드를 가져다 쓰는 라이브러리라고 생각하면 될듯

{} 로 뒤에 값으로 채워넣어줄수 있다.

```rs
fn main (0 {
    let my_name = "TeTedo";
    println!("Hello, {}!", my_name);
})
```

rust 에서는 function 만들때 return을 안써도 된다.

```rs
fn main () {
    let my_name = "TeTedo";
    println!("Hello, {}!", my_name);

    let my_age = get_age();
    println!("My age is {my_age}!");
}

fn get_age() -> i32 {
    50
}

Hello, TeTedo!
My age is 50!

{} 안에 변수를 넣을수도 있다.
```
