# 41. Lifetimes

```rs
struct Book {
    title: &str
}

fn main() {
    let my_book = Book {
        title: "my_title"
    };
}

error[E0106]: missing lifetime specifier
 --> 1.rs:2:12
  |
2 |     title: &str
  |            ^ expected named lifetime parameter
  |
help: consider introducing a named lifetime parameter
  |
1 ~ struct Book<'a> {
2 ~     title: &'a str
```

struct 에서 &str 을 사용할때는 lifetime 을 명시해야 한다.

&str 는 다른곳의 데이터를 가리키는데 이 데이터가 언제까지 살아있는지를 컴파일러가 알아야 한다고 한다.

```rs
fn returns_reference() -> &str {
    let my_string = "David".to_string();
    &my_string
}

  |
5 | fn returns_reference() -> &str {
  |                           ^ expected named lifetime parameter
  |
  = help: this function's return type contains a borrowed value, but there is no value for it to be borrowed from
help: consider using the `'static` lifetime, but this is uncommon unless you're returning a borrowed value from a `const` or a `static`
  |
5 | fn returns_reference() -> &'static str {
  |                            +++++++
help: instead, you are more likely to want to return an owned value
  |
5 - fn returns_reference() -> &str {
5 + fn returns_reference() -> String {
```

이런식으로 return_reference 함수 안에서만 존재하는 String을 return 할수 없다.

```rs
fn returns_reference() -> &'static str {
    "David"
}
```

"David" 는 String literal 이고 프로그램의 데이터 섹션에 저장된다. -> 정적 메모리로 프로그램 바이너리에 포함된다고 한다.

그래서 프로그램이 실행될때 항상 유효하므로 'static lifetime 을 가진다고 한다.

그래서 위에서 컴파일이 안됬던 코드를 조금 바꿔주면 아래와 같이 된다.

```rs
struct Book<'a> {
    name: &'a str
}

fn main() {
    let my_book = Book {
        name: "my_book"
    };
}
```

`Book<'booklifetime>` 으로 Book이 살아있는동안 name도 존재한다 라고 표현해준건다.

그러면 이부분을 static으로 해준다면

```rs
struct Book<'static> {
    name: &'static str
}

fn main() {
    let my_book = Book {
        name: "my_book"
    };
}

--> 3.rs:1:13
  |
1 | struct Book<'static> {
  |             ^^^^^^^ 'static is a reserved lifetime name
```

Book은 static 이 아니기 때문에 빌드가 실패한다.

아래처럼 Book 에서 지워주면 되긴 한다.

```rs
struct Book {
    name: &'static str
}

fn main() {
    let my_book = Book {
        name: &my_string
    };
}
```

아래의 경우에도 실패한다.

```rs
struct Book {
    name: &'static str
}

fn main() {

    let my_string = "my_book_title".to_string();

    let my_book = Book {
        name: &my_string
    };
}
```

Book의 name은 static 이라고 명시했는데 &my_string 처럼 레퍼런스를 넣으려고 했기 때문이다.

만약 Book struct 에 다른 요소가 다른 라이프타임을 가질수도 있다.

```rs
struct Book<'a, 'b> {
    name: &'a str,
    second_name: &'b str
}

fn main() {

    let my_string = "my_book_title".to_string();
    let my_second_string = "my_book_second_title".to_string();

    let my_book = Book {
        name: &my_string,
        second_name: &my_second_string
    };
}
```

impl block 을 만들때도 라이프타임이 필요하다.

```rs
struct Adventurer<'a> {
    name: &'a str,
    hit_points: u32,
}

impl Adventurer<'_> {
    fn take_damage(&mut self) {
        self.hit_points -= 20;
        println!("{} has {} hit points left", self.name, self.hit_points);
    }
}

fn main() {
    let mut adventurer = Adventurer {
        name: "David",
        hit_points: 100,
    };
    adventurer.take_damage();
}
```

struct 에서 <'a> 로 라이프타임을 이미 정했기 때문에 impl 에서는 <'\_> 를 사용했다.

다른 사람이 쓴 코드를 불러온다고 가정하자.

```rs
// External code
mod client {
    pub struct InternetClient {
        pub client_id: u32,
    }
}

use client::InternetClient;

struct Customer<'a> {
    money: u32,
    name: &'a str,
    client: &'a InternetClient
}

use std::fmt;

impl fmt::Debug for Customer<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Customer")
            .field("money", &self.money)
            .field("name", &self.name)
            .field("client", &self.client.client_id)
            .finish()
    }
}

fn main() {
    let client = client::InternetClient {
        client_id: 1,
    };
    let customer1 = Customer {
        money: 100,
        name: "David",
        client: &client,
    };

    println!("customer1: {:?}", customer1);
}
```

InternetClient에 debug trait 이 없기 때문에 Customer 에 그냥 #[derive(Debug)] 를 붙이면 안된다.

그래서 Debug를 새로 만들어서 사용했다.
