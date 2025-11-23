# 30. references and the dot operator

integer와 &integer의 비교는 불가하다.

```rs
fn main() {
    let my_number = 10;
    let reference = &my_number;

    println!("Are they the same? {}", my_number == reference);
}

error[E0277]: can't compare `{integer}` with `&{integer}`
 --> 1.rs:5:49
  |
5 |     println!("Are they the same? {}", my_number == reference);
  |                                                 ^^ no implementation for `{integer} == &{integer}`
  |
  = help: the trait `PartialEq<&{integer}>` is not implemented for `{integer}`
help: consider dereferencing here
  |
5 |     println!("Are they the same? {}", my_number == *reference);
  |                                                    +
```

비교를 하기 위해선 reference 값이 아닌 \*로 값으로 비교해야한다.

```rs
fn main() {
    let my_number = 10;
    let reference = &my_number;

    println!("Are they the same? {}", my_number == *reference);
}

Are they the same? true
```

.(dot) 을 쓰면 자동으로 \*(deref)를 쓰는 효과가 있다.

```rs
struct Item {
    number : u8
}

impl Item {
    fn compare_number(&self, other_number: u8) -> bool {
        self.number == other_number // self. -> dot operator
    }
}

fn main(){
    let item = Item { number: 10 };
    let reference_item = &item;
    println!("{}", reference_item.compare_number(10));
}
```
