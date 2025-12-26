# 42. Interior Mutability

rust 에서는 값을 아래를 사용해서 값을 바꿀수 있다.

& immutable reference / shared reference

&mut mutable reference / unique reference

이거로만 값을 바꾸는건 융통성이 없기때문에 다르게 바꿀수 있게 한다.

```rs
let mut x = 9;

thread 1 {
    x += 1;
}

thread 2 {
    x += 2;
}
```

x 라는 변수를 thread1, thread2 에서 동시에 값을 바꾸면 thread safe 하지 않다.

Cell 을 사용하면 thread safe 하게끔 할 수 있다.

```rs
use std::cell::Cell;

#[derive(Debug)]
struct PhoneModel {
    company_name: String,
    model_name: String,
    screen_size: f32,
    memory: usize,
    date_issued: u32,
    on_sale: Cell<bool>,
}

fn main() {
    let super_phone_3000 = PhoneModel {
        company_name: "YY Electronics".to_string(),
        model_name: "Super Phone 3000".to_string(),
        screen_size: 7.5,
        memory: 4_000_000,
        date_issued: 2020,
        on_sale: Cell::new(true),
    };

    println!("super_phone_3000: {:?}", super_phone_3000);
    super_phone_3000.on_sale.set(false);
    println!("super_phone_3000: {:?}", super_phone_3000);
}
```

Cell 은 get, set 을 사용해서 값을 가져오고 설정할 수 있다.

```rs
use std::cell::Cell;

fn main() {
    let my_cell = Cell::new(String::from("I am a String"));
    my_cell.set(String::from("I am a new String"));
    let my_string = my_cell.get();
}

error[E0599]: the method `get` exists for struct `Cell<String>`, but its trait bounds were not satisfied
   --> 2.rs:6:29
    |
  6 |     let my_string = my_cell.get();
    |                             ^^^
    |
360 | pub struct String {
    | ----------------- doesn't satisfy `String: Copy`
    |
    = note: the following trait bounds were not satisfied:
            `String: Copy`
```

String 이 Copy trait 이 없기 때문에 안된다고 한다. Cell을 사용하기 위해선 Copy 를 가지고 있어야 한다고 한다.

---

RefCell

```rs
use std::cell::RefCell;

#[derive(Debug)]
struct User {
    id: u32,
    year_registered: u32,
    username: String,
    active: RefCell<bool>,
    // Many other fields
}

fn main() {
    let user_1 = User {
        id: 1,
        year_registered: 2020,
        username: "User 1".to_string(),
        active: RefCell::new(true),
    };

    let first_reference = user_1.active.borrow_mut();
    let second_reference = user_1.active.borrow_mut();
}

RefCell already borrowed
```

컴파일은 잘 되지만 실행하면 panic이 뜬다.

```rs
println!("user_1: {:?}", user_1);
let first_reference = user_1.active.borrow_mut();
println!("user_1: {:?}", user_1);

user_1: User { id: 1, year_registered: 2020, username: "User 1", active: RefCell { value: true } }
user_1: User { id: 1, year_registered: 2020, username: "User 1", active: RefCell { value: <borrowed> } }
```

borrow_mut 를 하면 user_1 의 RefCell의 value가 바뀌게 된다.

```rs
println!("user_1: {:?}", user_1);
let mut first_reference = user_1.active.borrow_mut();

println!("user_1: {:?}", user_1);
*first_reference = false;

println!("user_1: {:?}", user_1);

drop(first_reference);
println!("user_1: {:?}", user_1);

user_1: User { id: 1, year_registered: 2020, username: "User 1", active: RefCell { value: true } }
user_1: User { id: 1, year_registered: 2020, username: "User 1", active: RefCell { value: <borrowed> } }
user_1: User { id: 1, year_registered: 2020, username: "User 1", active: RefCell { value: <borrowed> } }
user_1: User { id: 1, year_registered: 2020, username: "User 1", active: RefCell { value: false } }
```

dereference 로 값을 직접 바꿀수 있지만 borrow한걸 drop 해줘야 실제 값이 바뀐다.

drop 이라고 명시해도 되지만 scope안에서만 borrow 한다고 한다.

```rs
println!("user_1: {:?}", user_1);
{
    let mut first_reference = user_1.active.borrow_mut();
    *first_reference = false;
    println!("user_1: {:?}", user_1);
}
println!("user_1: {:?}", user_1);

user_1: User { id: 1, year_registered: 2020, username: "User 1", active: RefCell { value: true } }
user_1: User { id: 1, year_registered: 2020, username: "User 1", active: RefCell { value: <borrowed> } }
user_1: User { id: 1, year_registered: 2020, username: "User 1", active: RefCell { value: false } }
```

scope 안에서까진 value 가 <borrowed> 였지만 바깥에선 value가 적용되었다.

```rs
use std::cell::RefCell;

fn main() {
    let my_cell = RefCell::new(String::from("I am a String"));
    *my_cell.borrow_mut() = String::from("I am a new String");
    println!("my_cell: {:?}", my_cell);
}
```

위처럼 간단하게 작성할수도 있다.

```rs
use std::cell::RefCell;

fn main() {
    let my_cell = RefCell::new(String::from("I am a String"));
    *my_cell.borrow_mut() = String::from("I am a new String");
    println!("my_cell: {:?}", my_cell);
    match my_cell.try_borrow_mut() {
        Ok(mut value) => {
            *value = String::from("I am a super new String");
            println!("my_cell: {:?}", my_cell);
        }
        Err(_) => {
            println!("Error: RefCell already borrowed");
        }
    }
    println!("my_cell: {:?}", my_cell);
}
```
