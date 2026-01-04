# 47. Multiple Threads

go 같은 경우에는 virtual thread 를 사용하는데 rust 는 진짜 스레드를 사용한다고 한다.

```rs
use std::thread;

fn main() {
    thread::spawn(|| {
        println!("Hello from the thread!");
    });
}
```

main thread 가 종료되면 다른 thread 도 종료되기 때문에 print 가 안찍혔다.

```rs
use std::thread;

fn main() {
    thread::spawn(|| {
        println!("Hello from the thread!");
    });

    for _ in 1..100000 {
        let x = 2;
    }
}
```

main thread 를 for 문을 실행시켜 종료를 지연시키면 print 가 찍혔다.

join을 쓰면 thread 의 실행을 기다릴수 있다.

```rs
use std::thread;

fn main() {
    let join_handle = thread::spawn(|| {
        println!("Hello from the thread!");
    });

    join_handle.join();
}
```

여러개의 thread 를 쓴다면 vector 를 이용해서 기다릴 수 있다.

```rs
use std::thread;

fn main() {
    let mut join_vec = vec![];
    for _ in 1..10 {
        let handle = thread::spawn(|| {
            println!("Hello from the thread!");
        });

        join_vec.push(handle);
    }

    join_vec.into_iter().for_each(|handle| handle.join().unwrap());

    println!("Hello from the main thread!");
}
```

## RefCell과 스레드 - 왜 작동하지 않는가?

`RefCell`은 단일 스레드 환경에서만 안전합니다. 여러 스레드에서 동시에 접근하려고 하면 컴파일 에러가 발생합니다.

```rs
use std::cell::RefCell;
use std::thread;

trait CoolTrait {
    fn cool_function(&self);
}

#[derive(Debug)]
struct OurStruct {
    data: RefCell<u8>,
}

impl CoolTrait for OurStruct {
    fn cool_function(&self) {
        *self.data.borrow_mut() += 1;
    }
}

fn main() {
    let our_struct = OurStruct {
        data: RefCell::new(0),
    };

    let mut join_vec = vec![];
    for _ in 0..10 {
        let handle = thread::spawn(|| {
            *our_struct.data.borrow_mut() += 1;
        });
        join_vec.push(handle);
    }
    join_vec.into_iter().for_each(|handle| handle.join().unwrap());
    println!("our_struct: {:?}", our_struct);
}
```

**컴파일 에러 발생 이유:**

1. **`RefCell`은 `!Send`**: `RefCell`은 `Send` 트레이트를 구현하지 않아 스레드 간 전송이 불가능합니다.

   - `Send`: 타입이 스레드 간에 안전하게 전송될 수 있음을 나타냄
   - `RefCell`은 런타임 빌림 체크만 하므로, 멀티스레드 환경에서의 동시 접근을 보장할 수 없음

2. **소유권 문제**: 클로저가 `our_struct`를 캡처하려고 하지만, 여러 스레드에서 동시에 접근할 수 없습니다.

3. **데이터 레이스 위험**: 여러 스레드가 동시에 `borrow_mut()`를 호출하면 런타임에 panic이 발생할 수 있습니다.

**해결책**: 멀티스레드 환경에서는 `Mutex`를 사용해야 합니다.

## Mutex 사용 - 소유권 문제

`Mutex`는 멀티스레드 환경에서 안전하게 데이터를 보호할 수 있지만, 여러 스레드에서 같은 데이터를 공유하려면 소유권 문제가 발생합니다.

```rs
use std::sync::Mutex;
use std::thread;

trait CoolTrait {
    fn cool_function(&self);
}

struct OurStruct {
    data: Mutex<u8>,
}

impl CoolTrait for OurStruct {
    fn cool_function(&self) {
        *self.data.lock().unwrap() += 1;
    }
}

fn main() {
    let our_struct = OurStruct {
        data: Mutex::new(0),
    };

    let mut join_vec = vec![];
    for _ in 0..10 {
        let handle = thread::spawn(move || {
            *our_struct.data.lock().unwrap() += 1;
        });
        join_vec.push(handle);
    }
    join_vec.into_iter().for_each(|handle| handle.join().unwrap());
}
```

**컴파일 에러 발생 이유:**

1. **첫 번째 반복에서 소유권 이동**: `move` 클로저는 `our_struct`의 소유권을 첫 번째 스레드로 이동시킵니다.

2. **두 번째 반복에서 에러**: 첫 번째 반복에서 이미 `our_struct`가 이동되었으므로, 두 번째 반복에서는 사용할 수 없습니다.

   ```
   error[E0382]: use of moved value: `our_struct`
   ```

3. **`Mutex`는 `Send`이지만 `Clone`이 아님**: `Mutex`는 스레드 간 전송은 가능하지만, 복제할 수 없어 여러 스레드에서 공유할 수 없습니다.

**해결책**: `Arc`(Atomically Reference Counted)를 사용하여 여러 스레드가 같은 데이터를 공유할 수 있도록 해야 합니다.

## Arc + Mutex - 최종 해결책

`Arc`(Atomically Reference Counted)는 여러 스레드에서 같은 데이터를 안전하게 공유할 수 있게 해줍니다. `Rc`와 비슷하지만, `Arc`는 원자적 연산을 사용하여 스레드 안전합니다.

```rs
use std::sync::{Arc, Mutex};
use std::thread;

trait CoolTrait {
    fn cool_function(&self);
}

#[derive(Debug)]
struct OurStruct {
    data: Arc<Mutex<u8>>,
}

impl CoolTrait for OurStruct {
    fn cool_function(&self) {
        *self.data.lock().unwrap() += 1;
    }
}

fn main() {
    let our_struct = OurStruct {
        data: Arc::new(Mutex::new(0)),
    };

    let mut join_vec = vec![];
    for _ in 0..10 {
        let clone = Arc::clone(&our_struct.data);
        let handle = thread::spawn(move || {
            let mut data = clone.lock().unwrap();
            *data += 1;
        });
        join_vec.push(handle);
    }
    join_vec.into_iter().for_each(|handle| handle.join().unwrap());
    println!("our_struct: {:?}", our_struct);
}
```

**작동 원리:**

1. **`Arc::new(Mutex::new(0))`**:

   - `Mutex`로 데이터를 보호하고, `Arc`로 여러 스레드에서 공유 가능하게 만듭니다.
   - `Arc`는 참조 카운터를 원자적으로 관리하여 스레드 안전합니다.

2. **`Arc::clone(&our_struct.data)`**:

   - 데이터를 복사하는 것이 아니라, 참조 카운터만 증가시킵니다.
   - 모든 `Arc` 클론은 같은 힙 데이터를 가리킵니다.
   - 비용이 매우 낮습니다 (참조 카운터 증가만).

3. **`move` 클로저**:

   - `clone`의 소유권이 각 스레드로 이동됩니다.
   - 각 스레드는 `Arc` 클론을 소유하지만, 모두 같은 `Mutex`를 가리킵니다.

4. **`clone.lock().unwrap()`**:
   - `Mutex`를 잠가서 한 번에 하나의 스레드만 데이터에 접근할 수 있게 합니다.
   - 다른 스레드는 잠금이 해제될 때까지 대기합니다.

**`Rc` vs `Arc`:**

- **`Rc`**: 단일 스레드용, `!Send`, `!Sync`
- **`Arc`**: 멀티스레드용, `Send`, `Sync`, 원자적 연산 사용 (약간의 성능 오버헤드)

**결과:**

- 10개의 스레드가 각각 값을 1씩 증가시키므로, 최종 값은 `10`이 됩니다.
- 데이터 레이스 없이 안전하게 동시 접근이 가능합니다.

---

mutex 써보기

```rs
use std::sync::{Mutex, RwLock};

fn main() {
    let my_mutex = Mutex::new(5);

    let mut mutex_changer = my_mutex.lock().unwrap();
    let mut other_mutex_changer = my_mutex.try_lock();

    if let Ok(value) = other_mutex_changer {
        println!("other_mutex_changer: {value:?}");
    } else {
        println!("other_mutex_changer: locked");
    }
    *mutex_changer = 6;
    drop(mutex_changer);
    println!("{my_mutex:?}");
}
```

RwLock 을 이용하면 read, write lock 을 따로 사용할 수 있다.

```rs
use std::sync::{Mutex, RwLock};

fn main() {
    let my_rwlock = RwLock::new(5);

    let read1 = my_rwlock.read().unwrap();
    let read2 = my_rwlock.read().unwrap();
    println!("read1: {read1:?}");
    println!("read2: {read2:?}");

}
```
