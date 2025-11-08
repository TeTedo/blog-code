# 21. collection types

array 길이가 다르면 비교를 할수 없다.

```rs
fn main() {
    let array = ["One", "Two"]; // [&str; 2]
    let array2 = ["One", "Two", "Three"]; // [&str; 3]

    println!("Is array the same as array2? {}", array == array2);
}

error[E0277]: can't compare `[&str; 2]` with `[&str; 3]`
 --> 1.rs:8:55
  |
8 |     println!("Is array the same as array2? {}", array == array2);
  |                                                       ^^ no implementation for `[&str; 2] == [&str; 3]`
  |
```

길이가 같으면 비교할 수 있다.

타입을 알려면 없는 메소드를 쓰면 컴파일에러에 타입을 보여준다.

```rs
fn main() {
    let array = ["One", "Two"]; // [&str; 2]

    array.asdu8oifasduf();

}

error[E0599]: no method named `asdu8oifasduf` found for array `[&str; 2]` in the current scope
 --> 2.rs:4:11
  |
4 |     array.asdu8oifasduf();
  |           ^^^^^^^^^^^^^ method not found in `[&str; 2]`
```

array로 buffer 만드는법

```rs
fn main() {
    let array = [0; 10];

    println!("array: {:?}", array);
}

array: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

array의 데이터에 접근할때 방법

```rs
fn main() {
    let array = ["One", "Two", "Three"];

    println!("array[0]: {}", array[0]);
    println!("array[2]: {:?}", array.get(2));
    println!("array[3]: {:?}", array.get(3));
}

array[0]: One
array[2]: Some("Three")
array[3]: None
```

get 함수를 사용하면 디버그 프린트를 해야하는데 값이 아닌 Some, None 객체를 반환해서 그런듯

```rs
fn main() {
    let seasons = ["Spring", "Summer", "Autumn", "Winter"];
    println!("seasons: {:?}", seasons[0..2]);
}

error[E0277]: the size for values of type `[&str]` cannot be known at compilation time
 --> 5.rs:6:31
  |
6 |     println!("seasons: {:?}", seasons[0..2]);
  |                        ----   ^^^^^^^^^^^^^ doesn't have a size known at compile-time
```

array는 slice를 할수 있는데 컴파일러가 이 크기를 알수 없기 때문에 &를 붙여준다.

`seasons[0..2]`는 슬라이스 타입인 `[&str]`를 만든다. 슬라이스는 크기가 컴파일 타임에 정해지지 않는다.

&를 붙이면 &[&str] 이 되어 참조는 크기가 고정되어있어 사용할 수 있다.

1. **`[&str]` (슬라이스 타입)**:

   - 이것은 **unsized type** (DST: Dynamically Sized Type)입니다
   - 슬라이스의 실제 길이는 런타임에만 결정됩니다
   - Rust는 컴파일 타임에 크기를 알아야 하는 값(value)을 스택에 저장할 수 있으므로, `[&str]` 타입의 값을 직접 사용할 수 없습니다

2. **`&[&str]` (슬라이스 참조)**:
   - 이것은 **fat pointer**입니다 (포인터 + 길이 정보를 포함)
   - 참조 자체의 크기는 고정되어 있습니다 (64비트 시스템에서 16바이트: 8바이트 포인터 + 8바이트 길이)
   - 따라서 `&[&str]`는 sized type이므로 스택에 저장하고 전달할 수 있습니다

```rs
// slices
// vecs

fn main() {
    let seasons = ["Spring", "Summer", "Autumn", "Winter"];
    println!("seasons: {:?}", &seasons[0..2]);
    println!("seasons: {:?}", &seasons[0..=2]);
    println!("seasons: {:?}", &seasons[..]);
    println!("seasons: {:?}", &seasons[..2]);
    println!("seasons: {:?}", &seasons[2..]);
}

seasons: ["Spring", "Summer"]
seasons: ["Spring", "Summer", "Autumn"]
seasons: ["Spring", "Summer", "Autumn", "Winter"]
seasons: ["Spring", "Summer"]
seasons: ["Autumn", "Winter"]
```
