# 47. Multiple Threads

## Rust 스레드 vs Go 고루틴

### 기본 개념 이해

**OS 스레드란?**

- **프로세스 안에서 실행되는 실행 단위**입니다
- 하나의 프로세스는 여러 개의 OS 스레드를 가질 수 있습니다
- 각 OS 스레드는 독립적인 스택 공간을 가지지만, 힙 메모리는 공유합니다
- OS 커널이 스케줄링을 관리합니다

**프로세스 vs 스레드:**

```
프로세스
├── 힙 메모리 (공유)
├── OS 스레드 1 (독립 스택)
├── OS 스레드 2 (독립 스택)
└── OS 스레드 3 (독립 스택)
```

**Rust `std::thread`:**

- **OS 스레드 (1:1 모델)**: 각 Rust 스레드는 하나의 OS 스레드와 직접 매핑됩니다
  ```
  Rust 스레드 1 → OS 스레드 1
  Rust 스레드 2 → OS 스레드 2
  Rust 스레드 3 → OS 스레드 3
  ```
- OS 커널이 스케줄링을 관리합니다
- 스레드 생성 비용이 높습니다 (메모리 오버헤드 ~2MB)
- 하지만 제어가 직접적이고 예측 가능합니다

**Go 고루틴:**

- **Green Threads (M:N 모델)**: 여러 고루틴이 적은 수의 OS 스레드에 스케줄링됩니다

  ```
  고루틴 1 ─┐
  고루틴 2 ─┤
  고루틴 3 ─┼─→ OS 스레드 1
  고루틴 4 ─┤
  고루틴 5 ─┘

  고루틴 6 ─┐
  고루틴 7 ─┼─→ OS 스레드 2
  고루틴 8 ─┘
  ```

- **여러 고루틴이 하나의 OS 스레드를 공유**합니다
- Go 런타임이 스케줄링을 관리합니다
- 고루틴 생성 비용이 매우 낮습니다 (2KB 정도)
- 수천, 수만 개의 고루틴을 쉽게 생성할 수 있습니다

### 동작 방식 비교

**Rust OS 스레드 (1:1 모델):**

```rs
use std::thread;

fn main() {
    // 각 spawn이 하나의 OS 스레드를 생성
    thread::spawn(|| { /* 작업 1 */ });  // → OS 스레드 1
    thread::spawn(|| { /* 작업 2 */ });  // → OS 스레드 2
    thread::spawn(|| { /* 작업 3 */ });  // → OS 스레드 3
}
```

- 3개의 Rust 스레드 = 3개의 OS 스레드
- OS 커널이 각 스레드를 CPU 코어에 할당
- 각 스레드는 독립적으로 실행

**Go 고루틴 (M:N 모델):**

```go
func main() {
    // 각 go 문이 하나의 고루틴을 생성
    go task1()  // 고루틴 1
    go task2()  // 고루틴 2
    go task3()  // 고루틴 3
    // ... 수천 개의 고루틴 가능
}
```

- 1000개의 고루틴 → 예: 4개의 OS 스레드에 스케줄링
- Go 런타임이 고루틴을 OS 스레드에 할당
- I/O 대기 중인 고루틴은 다른 고루틴이 실행되도록 양보

**비교:**

| 특징      | Rust `std::thread` | Go 고루틴           |
| --------- | ------------------ | ------------------- |
| 모델      | 1:1 (OS 스레드)    | M:N (Green Threads) |
| 스케줄러  | OS 커널            | Go 런타임           |
| 생성 비용 | 높음 (~2MB)        | 낮음 (~2KB)         |
| 동시성    | 수백 개 정도       | 수천~수만 개        |
| 제어      | 직접적             | 런타임이 관리       |

### 구체적인 예시

**Rust: 100개의 작업을 처리하려면?**

```rs
use std::thread;

fn main() {
    let handles: Vec<_> = (0..100)
        .map(|i| {
            thread::spawn(move || {
                println!("Task {} on OS thread", i);
            })
        })
        .collect();

    for handle in handles {
        handle.join().unwrap();
    }
}
```

- **100개의 OS 스레드 생성** (메모리: ~200MB)
- OS가 100개의 스레드를 스케줄링
- CPU 코어 수만큼만 실제로 병렬 실행 (예: 8코어면 8개씩)

**Go: 100개의 작업을 처리하려면?**

```go
func main() {
    for i := 0; i < 100; i++ {
        go func(id int) {
            fmt.Printf("Task %d on goroutine\n", id)
        }(i)
    }
    time.Sleep(time.Second)
}
```

- **100개의 고루틴 생성** (메모리: ~200KB)
- Go 런타임이 고루틴을 **적은 수의 OS 스레드**(예: CPU 코어 수만큼)에 스케줄링
- I/O 대기 중인 고루틴은 다른 고루틴이 실행되도록 양보

**핵심 차이:**

| 항목                  | Rust OS 스레드       | Go 고루틴             |
| --------------------- | -------------------- | --------------------- |
| **100개 작업 처리**   | 100개 OS 스레드 생성 | 100개 고루틴 생성     |
| **실제 OS 스레드 수** | 100개                | 예: 8개 (CPU 코어 수) |
| **메모리 사용**       | ~200MB               | ~200KB                |
| **스케줄러**          | OS 커널              | Go 런타임             |

**참고:** Rust도 `async/await`와 `tokio` 같은 런타임을 사용하면 Go의 고루틴과 유사한 green threads 모델을 사용할 수 있습니다.

## Rust OS 스레드의 장점

### 1. **직접적인 제어와 예측 가능성**

```rs
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        // OS 스레드에서 직접 실행
        // 스케줄링이 OS 커널에 의해 관리됨
        println!("Running on OS thread");
    });
    handle.join().unwrap();
}
```

- OS 커널이 스케줄링을 관리하므로 동작이 예측 가능합니다
- 런타임 레이어 없이 직접 제어 가능합니다
- 디버깅 시 OS 레벨 도구를 사용할 수 있습니다

### 2. **CPU 집약적 작업에 최적화**

```rs
use std::thread;

fn cpu_intensive_task() {
    // CPU 집약적 작업
    let mut sum = 0;
    for i in 0..1_000_000_000 {
        sum += i;
    }
}

fn main() {
    let handles: Vec<_> = (0..4)
        .map(|_| thread::spawn(cpu_intensive_task))
        .collect();

    for handle in handles {
        handle.join().unwrap();
    }
}
```

- OS가 CPU 코어에 직접 스레드를 할당합니다
- 멀티코어 활용이 효율적입니다
- 계산 집약적 작업에 적합합니다

### 3. **블로킹 I/O에 적합**

```rs
use std::thread;
use std::time::Duration;

fn blocking_io() {
    // 블로킹 I/O 작업
    thread::sleep(Duration::from_secs(1));
    println!("Blocking I/O completed");
}

fn main() {
    let handle = thread::spawn(blocking_io);
    // 다른 스레드는 계속 실행 가능
    println!("Main thread continues");
    handle.join().unwrap();
}
```

- 블로킹 작업이 있어도 다른 스레드에 영향이 없습니다
- OS가 스레드를 블록/언블록하므로 런타임 오버헤드가 없습니다
- 전통적인 동기 I/O와 잘 맞습니다

### 4. **메모리 격리**

```rs
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        let large_array = vec![0u8; 1_000_000];
        // 각 스레드는 독립적인 스택 공간을 가짐
        println!("Thread stack: {} bytes", large_array.len());
    });
    handle.join().unwrap();
}
```

- 각 스레드가 독립적인 스택 공간을 가집니다
- 한 스레드의 스택 오버플로우가 다른 스레드에 영향을 주지 않습니다
- 메모리 안전성이 보장됩니다

### 5. **컨텍스트 스위칭 최적화**

- OS 커널이 수십 년간 최적화된 스케줄러를 사용합니다
- 하드웨어 레벨 최적화 (CPU 캐시, TLB 등) 활용
- 런타임 레이어가 없어 오버헤드가 적습니다

### 6. **시스템 레벨 통합**

```rs
use std::thread;

fn main() {
    thread::Builder::new()
        .name("my-worker".to_string())
        .stack_size(1024 * 1024)  // 스택 크기 설정
        .spawn(|| {
            // 커스텀 설정으로 스레드 생성
        })
        .unwrap();
}
```

- OS 레벨 기능을 직접 활용할 수 있습니다
- 스레드 이름, 우선순위, CPU 어피니티 등을 설정 가능합니다
- 시스템 모니터링 도구와 통합이 쉽습니다

## 언제 Rust 스레드를 사용해야 할까?

**Rust OS 스레드가 적합한 경우:**

1. **CPU 집약적 작업**: 이미지 처리, 암호화, 과학 계산
2. **블로킹 I/O**: 전통적인 파일 I/O, 네트워크 I/O
3. **제한된 수의 작업**: 수백 개 이하의 동시 작업
4. **예측 가능성 중요**: 실시간 시스템, 임베디드 시스템
5. **OS 기능 활용**: 시스템 레벨 제어가 필요한 경우

**Go 고루틴이 적합한 경우:**

1. **I/O 바운드 작업**: 많은 수의 네트워크 요청 처리
2. **대량의 동시성**: 수천~수만 개의 동시 작업
3. **메모리 제약**: 메모리 사용량이 중요한 경우
4. **간단한 동시성**: 복잡한 동기화 없이 많은 작업 처리

## 요약

| 측면            | Rust OS 스레드                        | Go 고루틴                          |
| --------------- | ------------------------------------- | ---------------------------------- |
| **장점**        | 직접 제어, CPU 집약적 작업, 예측 가능 | 낮은 비용, 대량 동시성, I/O 효율적 |
| **단점**        | 높은 생성 비용, 제한된 동시성         | 런타임 오버헤드, 예측 어려움       |
| **적합한 작업** | CPU 집약적, 블로킹 I/O                | I/O 바운드, 대량 동시성            |

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
