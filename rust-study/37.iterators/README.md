# iterators

- .iter() for an iterator of references
- .iter_mut() for an iterator of mutable references
- .into_iter() for an iterator of values (not references)

```rs
fn main() {
    let vector1 = vec![1,2,3];
    let vector1_a = vector1.iter().map(|x| x + 1).collect::<Vec<i32>>();
    let vector1_b: Vec<i32> = vector1.into_iter().map(|x| x * 10).collect();

    let mut vector2 = vec![10, 20, 30];
    vector2.iter_mut().for_each(|x| *x += 100);

    println!("{:?}", vector1_a);
    println!("{:?}", vector1_b);
    println!("{:?}", vector2);
}
```

1. iter()

iter() 는 &i32 타입의 요소를 반환하는 반복자를 만든다.

원본 vector1의 소유권은 유지된다.

원본의 값은 바꾸지 않는다.

2. into_iter()

into_iter()는 i32 타입의 소유권을 가져온다.

원본 vector1의 소유권이 이동되어 이후에 사용할수 없다.

3. iter_mut()

iter_mut() 는 &mut i32 타입의 요소를 반환하는 반복자를 만든다.

그래서 vector2는 mut 로 선언되어야 하고 값을 계산할때 \*x 처럼 역참조를 직접 해서 값을 수정한다.

원본의 값을 직접 수정한다.

---

assert_eq 로 테스트를 해볼수 있다.

```rs
fn main() {
    let my_vec = vec!['a', 'b', '거', '柳'];
    let mut my_vec_iter = my_vec.iter();

    assert_eq!(my_vec_iter.next(), Some(&'a'));
    assert_eq!(my_vec_iter.next(), Some(&'b'));
    assert_eq!(my_vec_iter.next(), Some(&'거'));
    assert_eq!(my_vec_iter.next(), Some(&'柳'));
    assert_eq!(my_vec_iter.next(), None);
}
```

---

iterator trait 을 구현하여 사용할수 있다.

```rs

#[derive(Debug)]
struct Library {
    library_type: LibraryType,
    books: Vec<String>,
}

#[derive(Debug)]
enum LibraryType {
    City,
    Country,
}

impl Library {
    fn add_book(&mut self, book: &str) {
        self.books.push(book.to_string());
    }

    fn new() -> Self {
        Self {
            library_type: LibraryType::City,
            books: Vec::new(),
        }
    }
}

impl Iterator for Library {
    type Item = String;

    fn next(&mut self) -> Option<String> {
        match self.books.pop() {
            Some(book) => Some(book + " is found!"), // Rust allows String + &str
            None => None,
        }
    }
}
fn main() {
    let mut my_library = Library::new();
    my_library.add_book("The Doom of the Darksword");
    my_library.add_book("Demian - die Geschichte einer Jugend");
    my_library.add_book("구운몽");
    my_library.add_book("吾輩は猫である");

    for item in my_library {
        println!("{}", item);
    }
}
```
