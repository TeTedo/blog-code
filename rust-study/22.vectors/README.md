# 22. vectors

vector 를 만드는 법은 여러가지가 있다.

```rs
fn main() {
    let my_vec: Vec<String> = Vec::new();
    let my_vec2 = vec!["One", "Two", "Three"];
    let mut my_vec3 = Vec::new();
    my_vec3.push("One");
    println!("my_vec: {:?}", my_vec);
    println!("my_vec2: {:?}", my_vec2);
    println!("my_vec3: {:?}", my_vec3);
}

my_vec: []
my_vec2: ["One", "Two", "Three"]
my_vec3: ["One"]
```

`let mut my_vec3 = Vec::new();` 이거만 독립적으로 쓸수 없는데 컴파일러가 타입을 모르기 때문이다.

push로 데이터를 넣어주면 컴파일이 된다.

vector의 capacity 는 4로 시작해서 2배로 늘어난다.

```rs
fn main () {
    let name1 = String::from("David");
    let name2 = String::from("John");
    let name3 = String::from("Jane");
    let name4 = String::from("Jim");
    let name5 = String::from("Jill");
    let name6 = String::from("Jack");
    let name7 = String::from("Jill");
    let name8 = String::from("Jill");
    let name9 = String::from("Jill");
    let name10 = String::from("Jill");

    let mut my_vec = Vec::new();
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name1);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name2);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name3);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name4);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name5);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name6);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name7);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name8);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name9);
    println!("Space for my_vec {:?}", my_vec.capacity());
    my_vec.push(name10);
    println!("my_vec: {:?}", my_vec);
}

Space for my_vec 0
Space for my_vec 4
Space for my_vec 4
Space for my_vec 4
Space for my_vec 4
Space for my_vec 8
Space for my_vec 8
Space for my_vec 8
Space for my_vec 8
Space for my_vec 16
my_vec: ["David", "John", "Jane", "Jim", "Jill", "Jack", "Jill", "Jill", "Jill", "Jill"]
```

---

from과 into trait

```rs
fn main () {
    let my_name = String::from("David");
    let my_city: String = "Seoul".into(); // &str -> String
    let my_vec = Vec::from[8,9,10]; // [i32; 3] -> Vec<i32>
}
```
