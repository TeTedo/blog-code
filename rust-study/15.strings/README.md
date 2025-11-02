# Strings

rust 에선 String 과 &str 타입이 있다.

```rs
fn main () {
    let m_name1 = "David"; // &str
    let m_name2 = "David".to_string(); // String
    let m_name3  = String::from("David"); // String

    // growable + shrinkable
    let mut m_name4 = "David".to_string();
    m_name4.push_str(" is a good boy");
    m_name4.push('!');
    println!("{}", m_name4);
}

David is a good boy!
```

String 에는 push_str 이라는 method 가 있지만 &str 은 없다.

```rs
fn main() {

    println!("A String is always {:?} bytes. It is Sized.", std::mem::size_of::<String>()); // std::mem::size_of::<Type>() gives you the size in bytes of a type
    println!("And an i8 is always {:?} bytes. It is Sized.", std::mem::size_of::<i8>());
    println!("And an f64 is always {:?} bytes. It is Sized.", std::mem::size_of::<f64>());
    println!("But a &str? It can be anything. '서태지' is {:?} bytes. It is not Sized.", std::mem::size_of_val("서태지")); // std::mem::size_of_val() gives you the size in bytes of a variable
    println!("And 'Adrian Fahrenheit Țepeș' is {:?} bytes. It is not Sized.", std::mem::size_of_val("Adrian Fahrenheit Țepeș"));
}

A String is always 24 bytes. It is Sized.
And an i8 is always 1 bytes. It is Sized.
And an f64 is always 8 bytes. It is Sized.
But a &str? It can be anything. '서태지' is 9 bytes. It is not Sized.
And 'Adrian Fahrenheit Țepeș' is 25 bytes. It is not Sized
```

String 은 고정크기로 24바이트의 크기를 가진고 아래와 같이 스택에 저장된다. 그래서 컴파일타임에 크기를 알수 있다.

```
Stack:
  my_name: [포인터(8) | len(8) | capacity(8)] = 24 bytes (고정)
```

&str 는 문자열길이에 따라 크기가 다르고 크기를 늘리거나 줄일수 없다.

```rs
fn main() {
    let mut my_name = String::from("");
    println!("Length is {} and capacity is {}", my_name.len(), my_name.capacity());
    my_name.push_str("David!");
    println!("Length is {} and capacity is {}", my_name.len(), my_name.capacity());
    my_name.push_str(" and I live in Seoul");
    println!("Length is {} and capacity is {}", my_name.len(), my_name.capacity());
    my_name.push('!');
    println!("Length is {} and capacity is {}", my_name.len(), my_name.capacity());
}

Length is 0 and capacity is 0
Length is 6 and capacity is 8
Length is 26 and capacity is 26
Length is 27 and capacity is 52
```

```rs
let mut my_name = String::from("");
Stack:
  my_name: [포인터=null | len=0 | capacity=0] = 24 bytes (고정)

Heap:
  (아직 할당 안됨)
```

```rs
my_name.push_str("David!");
Stack:
  my_name: [포인터 → 힙 주소 | len=6 | capacity=8] = 24 bytes (고정)

Heap:
  ["David!"__] (8 bytes 할당, 6 bytes 사용, 2 bytes 여유)
  └─ 실제 데이터 (6 bytes)
```

```rs
my_name.push_str(" and I live in Seoul");
Stack:
  my_name: [포인터 → 힙 주소 | len=26 | capacity=26] = 24 bytes (고정)

Heap:
  ["David! and I live in Seoul"] (26 bytes 할당, 26 bytes 사용, 0 bytes 여유)
  └─ 재할당 발생! (8 → 26 bytes)
```

```rs
my_name.push('!');
Stack:
  my_name: [포인터 → 새로운 힙 주소 | len=27 | capacity=52] = 24 bytes (고정)
                                ↓
                         주소 변경됨!

Heap:
  [구] 주소: ["David! and I live in Seoul"] (26 bytes) → 해제됨

  [신] 주소: ["David! and I live in Seoul!"____________...] (52 bytes 할당)
            └─ 실제 데이터 (27 bytes 사용, 25 bytes 여유)
```
