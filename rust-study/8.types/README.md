# 8. types

# 1. primitive types

## (1) Integer

- Signed integers
- Unsigned integers

integer에는 signed, unsigned 2개의 integer가 있다.

signed integer 는 양수(+)와 음수(-)의 값을 가질수 있고 unsigned integer는 양수의 값만 가질수 있다.

### Signed Integer

signed integer는 i8, i16, i32, i6, i128, isize 가 있다.

i8, i16 처럼 i + 숫자 로 구성된경우 뒤 숫자는 비트를 의미한다.

`i8 = 8bit signed integer (-128 ~ 127)`

isize 는 내 컴퓨터 아키텍쳐에 따라 결정된다.

32비트라면 i32가 되고 64비트라면 i64가 된다.

### Unsigned Integer

Unsigned Integer는 Signed Integer와 같은 특징을 가지지만 양수만 표현할수 있다는 점이 다르다.

양수만 표현하기 때문에 u8은 i8 보다 양수에서 더 넓은 범위의 수를 표현할 수 있다.

`u8 = 8bit unsigned integer (0 ~ 255)`

## (2) char

모든 char에는 대응하는 숫자가 있다.

`A -> 65`

`友 -> 21451`

```rs
fn main() {
    let first_letter = 'A';
    let space = ' '; // A space inside ' ' is also a char
    let other_language_char = 'Ꮔ'; // Thanks to Unicode, other languages like Cherokee display just fine too
    let cat_face = '😺'; // Emojis are chars too
}
```

자주 사용되는 아스키 코드같은 글자는 256개보다 적다.

그래서 char를 u8로 안전하게 캐스팅이 가능하다.

```rs
fn main() {
    // casting
    let my_number = 'a' as u8;
    let seconde_number: u8 = 9;
    let third_number = my_number + seconde_number;

    println!("third_number: {}", third_number);
}

third_number: 106
```
