# Type

javascript 에서 쓰는 any 처럼 rust 에서도 Any 타입이 있다.

```rs
use std::any::{Any, type_name};

fn get_type_name<T: Any, U: Any>(_: T, _: U) {
    let type_of_t = type_name::<T>();
    let type_of_u = type_name::<U>();
    println!("type of T: {type_of_t}");
    println!("type of U: {type_of_u}");
}

fn main() {
    let my_number = 10;
    let my_string = String::from("Hello, world!");
    get_type_name(my_number, my_string);
}
```

is 와 downcast 를 이용할 수도 있다.

```rs
use std::any::{Any, type_name};

struct MyType;

fn do_stuff_depending(input: &dyn Any) {
    if let Some(a_string) = input.downcast_ref::<String>() {
        println!("We got a String!");
    } else if input.is::<i32>() {
        println!("We got an i32!");
    } else if input.is::<MyType>() {
        println!("We got a MyType!");
    } else {
        println!("Don't know what it is");
    }
}

fn main() {
    let my_string = String::from("Hello, world!");
    let my_number = 10;
    do_stuff_depending(&my_string);
    do_stuff_depending(&my_number);
    do_stuff_depending(&MyType);
}
```

downcast 는 logger 에서 많이 사용한다고 한다.

- 다양한 로거 타입을 하나로 관리해야 해서 , 확장성과 유연성을 위함, 런타임에 실패할 수 있기때문에 Option을 반환하는 downcast를 사용하는게 아닐까

---

panic 할때 set hook 을 설정해서 panic이 됬을때 처리할수 있다.

take hook 으로 그 훅을 끝낼수 있다.

```rs
use std::panic::{set_hook, take_hook};

fn main() {
    let mut important_code = 400;

    set_hook(Box::new(|panic_info| {
        println!("Didn't get a 200 code yet");
        println!("Panic info: {:?}", panic_info.payload().downcast_ref::<&str>());
    }));

    let my_number = "8876".parse::<i32>().unwrap();
    important_code = 200;
    let _ = take_hook();
    let other_number = "mahtth9484".parse::<i32>().unwrap();
}
```

---

time

```rs
use std::time::{Duration, Instant};
use std::thread::sleep;

fn main() {
    let time_1 = Instant::now();

    sleep(Duration::from_secs(5));

    println!("{:?}", time_1.elapsed());
    println!("{:?}", time_1.elapsed());
    println!("{:?}", time_1.elapsed());

}
```

---

anyhow
