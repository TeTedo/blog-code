# stack, heap, pointers

스택과 힙을 비교하면 스택이 힙보다 빠르다.

i32 같이 정확히 바이트수를 아는 변수는 스택으로 들어간다.

하지만 컴파일 타임에 사이즈를 모르는 변수들도 있다.

그런겨우에는 힙에 데이터가 저장되고 스택에는 포인터가 저장된다.

```rs
fn main() {
    let my_number = 15; // This is an i32
    let single_reference = &my_number; //  This is a &i32
    let double_reference = &single_reference; // This is a &&i32
    let five_references = &&&&&my_number; // This is a &&&&&i32

    println!("my_number: {}", my_number);
    println!("single_reference: {}", single_reference);
    println!("double_reference: {}", double_reference);
    println!("five_references: {}", five_references);
}

my_number: 15
single_reference: 15
double_reference: 15
five_references: 15
```

my_number는 i32타입으로 스택에 저장된다.

&는 reference 라고 한다.

```
my_number:          15 (스택에 저장)
     ↑
single_reference:   &my_number
     ↑
double_reference:   &single_reference
```

이런구조로 데이터를 가져와 print 한다.

마지막 five_references는 아래와 같다.

```
my_number (값: 15, 타입: i32)
    ↑ 참조
&my_number (값: &i32)
    ↑ 참조
&&my_number (값: &&i32)
    ↑ 참조
&&&my_number (값: &&&i32)
    ↑ 참조
&&&&my_number (값: &&&&i32)
    ↑ 참조
&&&&&my_number (값: &&&&&i32)
```
