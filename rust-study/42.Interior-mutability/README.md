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

Cell 을 이용하면 다른 사람이 만들어놓은 코드에서 mut 필요없이 값을 바꿀수가 있다.

```rs
use std::cell::{Cell, RefCell};

trait SuperCoolTrait {
    fn cool_function(&self);
}

#[derive(Debug)]
struct User {
    id: u32,
    times_used: Cell<u32>
}

impl SuperCoolTrait for User {
    fn cool_function(&self) {
        println!("Now using the cool function");
        let times_used = self.times_used.get();
        self.times_used.set(times_used + 1);
    }
}

fn main() {
    let user = User {
        id: 89723,
        times_used: Cell::new(0),
    };

    for _ in 0..20 {
        user.cool_function();
    }

    println!("user: {:?}", user);
}
```

RC - reference counter를 체크하면서 0이 되면 drop 한다.

ARC - thread safe Reference Counter

ARC<Mutex> - atomic reference counter

RC 를 먼저 봐보자.

```rs
use std::rc::Rc;

fn takes_a_string(input: String) {

}

fn also_takes_a_string(input: String) {

}

fn main() {
    let my_string = "Hello there".to_string();
    takes_a_string(my_string);
    also_takes_a_string(my_string);
}
```

ownership 때문에 위 처럼 string 의 ownership을 takes_a_string 에 주면 다음 함수가 실행되지 못한다.

이를 해결하기 위해 clone 을 쓸수 있는데

```rs
use std::rc::Rc;

fn takes_a_string(input: String) {

}

fn also_takes_a_string(input: String) {

}

fn main() {
    let my_string = "Hello there".to_string();
    takes_a_string(my_string.clone());
    also_takes_a_string(my_string);
}
```

이렇게 쓸수 있지만 Rc를 이용할 수 있다.

```rs
use std::rc::Rc;

fn takes_a_string(input: Rc<String>) {

}

fn also_takes_a_string(input: Rc<String>) {

}

fn main() {
    let my_string = Rc::new("Hello there".to_string());
    takes_a_string(Rc::clone(&my_string));
    also_takes_a_string(Rc::clone(&my_string));
}
```

Rc 를 사용하면 기존 메모리 포인터에 reference counter 만 증가하기 때문에 메모리를 거의 사용하지 않는다.

메모리적으로 보면 String::clone 은 완전히 새로운 메모리주소를 생성하지만 Rc::clone 은 기존 메모리 주소를 사용하여 counter만 증가시킨다.

```rs
use std::rc::Rc;

fn main() {
    let large_string = "A".repeat(1000);

    println!("=== String::clone() ===");
    let cloned1 = large_string.clone();
    let cloned2 = large_string.clone();

    println!("large_string:     {:p}", large_string.as_ptr());
    println!("cloned1:  {:p}", cloned1.as_ptr());
    println!("cloned2:  {:p}", cloned2.as_ptr());

    println!("\n=== Rc::clone() ===");
    let rc_string = Rc::new(large_string);
    let rc_cloned1 = Rc::clone(&rc_string);
    let rc_cloned2 = Rc::clone(&rc_string);

    println!("rc_string:  {:p}", Rc::as_ptr(&rc_string));
    println!("rc_cloned1: {:p}", Rc::as_ptr(&rc_cloned1));
    println!("rc_cloned2: {:p}", Rc::as_ptr(&rc_cloned2));

    println!("\nreference count: {}", Rc::strong_count(&rc_string));
}

=== String::clone() ===
large_string:     0x128e063d0
cloned1:  0x128e067c0
cloned2:  0x128e06bb0

=== Rc::clone() ===
rc_string:  0x128e061e0
rc_cloned1: 0x128e061e0
rc_cloned2: 0x128e061e0

reference count: 3
```

Rc 의 예시를 하나 더 보자

```rs
use std::rc::Rc;

#[derive(Debug)]
struct City {
    name: String,
    population: u32,
    history: Rc<String>
}

#[derive(Debug)]
struct CityData {
    names: Vec<String>,
    histories: Vec<Rc<String>>,
}

fn main() {
    let calgary = City {
        name: "Calgary".to_string(),
        population: 1_239_260,
        history: Rc::new("Calgary was founded in 1875".to_string()),
    };

    let canada_cities = CityData {
        names: vec![calgary.name],
        histories: vec![Rc::clone(&calgary.history)],
    };

    println!("Calgary's history is: {}", calgary.history);

    println!("Data has {} cities", Rc::strong_count(&calgary.history));
}
```

다음은 RefCell 의 예시를 보겠다.

```rs
#[derive(Debug)]
struct DataContainer<'a> {
    data: &'a mut String
}

fn main() {
    let mut important_data = "Super duper important data".to_string();

    let container_1 = DataContainer {
        data: &mut important_data,
    };

    let mut container_2 = DataContainer {
        data: &mut important_data,
    };

    for _ in 0..10 {
        *container_1.data = String::from("hi");
        *container_2.data = String::from("hello");
    }

}
```

rust 에서는 한 스코프에서 하나의 &mut 만 허용한다.

여기서 container_1 을 수정하려고 할때는 important_data 라는 String 을 빌려와서 수정한다.

바로 이어서 container_2 에서 수정할때도 같은데이터를 빌리려고 시도한다.

만약 이게 가능하다면 값을 수정할때 데이터 경합이 발생할수 있다고 한다.

이럴때 Rc와 RefCell 을 사용해서 값을 바꿀수 있다.

```rs
use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
struct DataContainer {
    data: Rc<RefCell<String>>
}

fn main() {
    let important_data = Rc::new(RefCell::new("Super duper important data ".to_string()));

    let container_1 = DataContainer {
        data: Rc::clone(&important_data),
    };

    let container_2 = DataContainer {
        data: Rc::clone(&important_data),
    };

    for _ in 0..10 {
        container_1.data.borrow_mut().push('a');
        container_2.data.borrow_mut().push('b');
    }

    println!("container_1: {:?}", container_1);
    println!("container_2: {:?}", container_2);
}
```
