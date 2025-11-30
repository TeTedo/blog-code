# other collections

### (1) HashMap

key, value 를 사용하는 HashMap 이다.

```rs
use std::collections::HashMap;

struct City {
    name: String,
    population: HashMap<u32, u32> // year, population
}

fn main() {

    let mut tallinn = City {
        name: "Tallinn".to_string(),
        population: HashMap::new(), // So far the HashMap is empty
    };

    tallinn.population.insert(1372, 3_250); // insert three dates
    tallinn.population.insert(1851, 24_000);
    tallinn.population.insert(2020, 437_619);


    for (year, population) in tallinn.population { // The HashMap is HashMap<u32, u32> so it returns a two items each time
        println!("In the year {} the city of {} had a population of {}.", year, tallinn.name, population);
    }
}

In the year 1851 the city of Tallinn had a population of 24000.
In the year 1372 the city of Tallinn had a population of 3250.
In the year 2020 the city of Tallinn had a population of 437619.
```

해시맵은 프린트를 찍을때 순서대로 나오지 않는다.

만약 순서가 보장되길 원하면 btreeMap 을 사용하면 된다.

hashMap 에서 key 값으로 value를 가져오려고 할때 get 을 사용하면 Option을 받기 때문에 더 안전하게 가져올수 있다.

get 을 안썼을땐 값이 없다면 panic이 뜰수 있다.

```rs
use std::collections::HashMap;

fn main() {
    let canadian_cities = vec!["Calgary", "Vancouver", "Gimli"];
    let german_cities = vec!["Karlsruhe", "Bad Doberan", "Bielefeld"];

    let mut city_hashmap = HashMap::new();

    for city in canadian_cities {
        city_hashmap.insert(city, "Canada");
    }
    for city in german_cities {
        city_hashmap.insert(city, "Germany");
    }

    println!("city_hashmap: {:?}", city_hashmap["Bielefeld"]);
    println!("city_hashmap: {:?}", city_hashmap.get("Bielefeld"));
    println!("city_hashmap: {:?}", city_hashmap.get("Bielefeldd"));
}

city_hashmap: "Germany"
city_hashmap: Some("Germany")
city_hashmap: None
```

만약 get을 안쓰고 아래와 같이 쓰면 panic

```rs
println!("city_hashmap: {:?}", city_hashmap["Bielefeldd"]);

thread 'main' panicked at 2.rs:17:48:
no entry found for key
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

같은 키값으로 계속 insert 하면 값이 덮어씌어진다.

```rs
use std::collections::HashMap;

fn main() {
    let mut book_hashmap = HashMap::new();
    book_hashmap.insert(1, 10);
    book_hashmap.insert(1, 20);
    book_hashmap.insert(1, 30);
    println!("book_hashmap: {:?}", book_hashmap.get(&1));
}

book_hashmap: Some(30)
```

get 에서 &(reference)를 사용하는데 hashMap 한테 소유권을 주기 싫어서 레퍼런스를 넘긴다 라고 이해했다.

get의 반환값은 Option 이므로 is_none 등을 쓸수 있다.

```rs
use std::collections::HashMap;

fn main() {
    let mut book_hashmap = HashMap::new();

    book_hashmap.insert(1, "L'Allemagne Moderne");

    if book_hashmap.get(&1).is_none() { // is_none() returns a bool: true if it's None, false if it's Some
        book_hashmap.insert(1, "Le Petit Prince");
    }

    println!("{:?}", book_hashmap.get(&1));
}
```

hashmap 에는 entry와 or_insert라는 함수가 있다.

```rs
pub fn entry(&mut self, key: K) -> Entry<K, V> // 🚧

enum Entry<K, V> {
    Occupied(OccupiedEntry<K, V>),
    Vacant(VacantEntry<K, V>),
}

fn or_insert(self, default: V) -> &mut V { // 🚧
    match self {
        Occupied(entry) => entry.into_mut(),
        Vacant(entry) => entry.insert(default),
    }
}
```

or_insert 에서는 default 값을 넣으면 &mut V 를 반환한다.

그래서 반환값의 \*(dereference)값을 수정하면 해시맵에 있는 값을 수정할수 있는것이다.

```rs
use std::collections::HashMap;

fn main() {
    let book_collection = vec!["L'Allemagne Moderne", "Le Petit Prince", "Eye of the World", "Eye of the World"]; // Eye of the World appears twice

    let mut book_hashmap = HashMap::new();

    for book in book_collection {
        let number_of_books = book_hashmap.entry(book).or_insert(0);
        *number_of_books += 1;
    }
    for (book, number_of_books) in book_hashmap {
        println!("book: {}, number_of_books: {}", book, number_of_books);
    }
}
```

or_insert 를 이용해서 vec 를 넣어주고 값을 push 하도록 할수도 있다.

```rs
use std::collections::HashMap;

fn main() {
    let data = vec![
        ("male", 9),
        ("female", 5),
        ("male", 0),
        ("female", 6),
        ("female", 5),
        ("male", 10),
    ];

    let mut survey_hash = HashMap::new();

    for item in data {
        survey_hash.entry(item.0).or_insert(Vec::new()).push(item.1);
    }

    for (male_or_female, scores) in survey_hash {
        println!("{}: {:?}", male_or_female, scores);
    }
}

female: [5, 6, 5]
male: [9, 0, 10]
```

### (2) HashSet, BtreeSet

Set 은 하나의 타입만 저장하고 값을 중복으로 저장하지 않는다.

```rs
use std::collections::HashSet;

fn main() {
    let many_numbers = vec![
        94, 42, 59, 64, 32, 22, 38, 5, 59, 49, 15, 89, 74, 29, 14, 68, 82, 80, 56, 41, 36, 81, 66,
        51, 58, 34, 59, 44, 19, 93, 28, 33, 18, 46, 61, 76, 14, 87, 84, 73, 71, 29, 94, 10, 35, 20,
        35, 80, 8, 43, 79, 25, 60, 26, 11, 37, 94, 32, 90, 51, 11, 28, 76, 16, 63, 95, 13, 60, 59,
        96, 95, 55, 92, 28, 3, 17, 91, 36, 20, 24, 0, 86, 82, 58, 93, 68, 54, 80, 56, 22, 67, 82,
        58, 64, 80, 16, 61, 57, 14, 11];

    let mut number_hashset = HashSet::new();

    for number in many_numbers {
        number_hashset.insert(number);
    }

    let hashset_length = number_hashset.len(); // The length tells us how many numbers are in it
    println!("There are {} unique numbers, so we are missing {}.", hashset_length, 100 - hashset_length);

    // Let's see what numbers we are missing
    let mut missing_vec = vec![];
    for number in 0..100 {
        if number_hashset.get(&number).is_none() { // If .get() returns None,
            missing_vec.push(number);
        }
    }

    print!("It does not contain: ");
    for number in missing_vec {
        print!("{} ", number);
    }
}
```

### (3) BinaryHeap

BinaryHeap은 제일 큰수가 뒤에 있어서 pop을 하게 되면 제일 큰수가 나온다. 중간에 있는 값들의 순서는 뒤죽박죽이다.

priority queue 를 쓸때 적용하면 좋을듯 하다.

```rs
use std::collections::BinaryHeap;

fn show_remainder(input: &BinaryHeap<i32>) -> Vec<i32> {
    let mut remainder_vec = vec![];
    for number in input {
        remainder_vec.push(*number);
    }
    remainder_vec
}

fn main() {
    let many_numbers = vec![94, 42, 59, 64, 32, 22, 38, 5, 59];

    let mut my_heap = BinaryHeap::new();

    for number in many_numbers {
        my_heap.push(number);
    }

    while let Some(number) = my_heap.pop() {
        println!("{}", number);
        println!("remainder: {:?}", show_remainder(&my_heap));
    }
}

94
remainder: [64, 59, 59, 42, 32, 22, 38, 5]
64
remainder: [59, 59, 38, 42, 32, 22, 5]
59
remainder: [59, 42, 38, 5, 32, 22]
59
remainder: [42, 32, 38, 5, 22]
42
remainder: [38, 32, 22, 5]
38
remainder: [32, 5, 22]
32
remainder: [22, 5]
22
remainder: [5]
5
remainder: []
```

priority queue 를 만들어보면 아래와 같다.

```rs
use std::collections::BinaryHeap;

fn main() {
    let mut jobs = BinaryHeap::new();

    // Add jobs to do throughout the day
    jobs.push((100, "Write back to email from the CEO"));
    jobs.push((80, "Finish the report today"));
    jobs.push((5, "Watch some YouTube"));
    jobs.push((70, "Tell your team members thanks for always working hard"));
    jobs.push((30, "Plan who to hire next for the team"));

    while let Some((priority, job)) = jobs.pop() {
        println!("{} (priority: {})", job, priority);
    }
}

Write back to email from the CEO (priority: 100)
Finish the report today (priority: 80)
Tell your team members thanks for always working hard (priority: 70)
Plan who to hire next for the team (priority: 30)
Watch some YouTube (priority: 5)
```

### (4) VecDeque

rust 에는 queue의 타입이 따로 없다.

그래서 stack은 vec, queue를 만들어 쓸꺼면 VecDeque로 쓸수 있다.

```rs
use std::collections::VecDeque;

fn main() {
    // VecDeque 생성
    let mut my_vecdeque = VecDeque::new();

    // 뒤쪽에 추가 (push_back)
    my_vecdeque.push_back(1);
    my_vecdeque.push_back(2);
    my_vecdeque.push_back(3);
    println!("뒤쪽에 추가 후: {:?}", my_vecdeque);

    // 앞쪽에 추가 (push_front) - Vec와 달리 효율적!
    my_vecdeque.push_front(0);
    my_vecdeque.push_front(-1);
    println!("앞쪽에 추가 후: {:?}", my_vecdeque);

    // 뒤쪽에서 제거 (pop_back)
    if let Some(value) = my_vecdeque.pop_back() {
        println!("뒤쪽에서 제거: {}", value);
    }
    println!("현재 상태: {:?}", my_vecdeque);

    // 앞쪽에서 제거 (pop_front)
    if let Some(value) = my_vecdeque.pop_front() {
        println!("앞쪽에서 제거: {}", value);
    }
    println!("최종 상태: {:?}", my_vecdeque);

    // 큐(Queue)로 사용하기
    println!("\n=== 큐(Queue) 예시 ===");
    let mut queue = VecDeque::new();
    queue.push_back("첫 번째");
    queue.push_back("두 번째");
    queue.push_back("세 번째");

    while let Some(item) = queue.pop_front() {
        println!("처리 중: {}", item);
    }

    // 스택(Stack)으로 사용하기
    println!("\n=== 스택(Stack) 예시 ===");
    let mut stack = VecDeque::new();
    stack.push_back("하나");
    stack.push_back("둘");
    stack.push_back("셋");

    while let Some(item) = stack.pop_back() {
        println!("꺼내기: {}", item);
    }
}

```
