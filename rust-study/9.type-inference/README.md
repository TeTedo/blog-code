# 9. type inference

type을 숫자뒤에 써도 된다. 그리고 \_ 는 무시된다.

```rs
fn main() {
    let small_number = 10u8;
    let big_number = 100_000_000_u32;
}
```

float은 f32, f64 가 있다. f64가 기본이다.

```rs
fn main() {
    let float_number = 1.0f32;
    let double_number = 2.0f64;

    let plus_number = float_number + double_number;
    println!("plus_number: {}", plus_number);
}

f32와 f64니까 안되겠지
```

```bash
error[E0308]: mismatched types
 --> type_1.rs:5:38
  |
5 |     let plus_number = float_number + double_number;
  |                                      ^^^^^^^^^^^^^ expected `f32`, found `f64`

error[E0277]: cannot add `f64` to `f32`
 --> type_1.rs:5:36
  |
5 |     let plus_number = float_number + double_number;
  |                                    ^ no implementation for `f32 + f64`
  |
  = help: the trait `Add<f64>` is not implemented for `f32`
  = help: the following other types implement trait `Add<Rhs>`:
            `&f32` implements `Add<f32>`
            `&f32` implements `Add`
            `f32` implements `Add<&f32>`
            `f32` implements `Add`

error: aborting due to 2 previous errors
```

```rs
fn main() {
    let float_number = 1.0f32;
    let double_number = 2.0;

    let plus_number = float_number + double_number;
    println!("plus_number: {}", plus_number);
}

plus_number: 3

이건 된다 -> 기본은 f64지만 타입추론으로 f32로 바꿔서 더하기 때문에
```
