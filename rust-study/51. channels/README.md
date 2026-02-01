# Rust Channels (채널)

채널은 스레드 간 메시지를 주고받는 통신 방식입니다. Rust의 `std::sync::mpsc` 모듈에서 제공합니다.

## mpsc란?

**M**ultiple **P**roducer, **S**ingle **C**onsumer의 약자입니다.

- 여러 송신자(Producer)가 메시지를 보낼 수 있음
- 하나의 수신자(Consumer)만 메시지를 받을 수 있음

## 기본 사용법

```rust
use std::sync::mpsc::channel;
use std::thread;

fn main() {
    // 채널 생성: (송신자, 수신자) 튜플 반환
    let (sender, receiver) = channel();

    // 여러 스레드에서 사용하려면 sender를 clone
    let s1 = sender.clone();
    let s2 = sender.clone();

    // 스레드 1: 값 1 전송
    thread::spawn(move|| {
        s1.send(1).unwrap();
    });

    // 스레드 2: 값 2 전송
    thread::spawn(move|| {
        s2.send(2).unwrap();
    });

    // 메인 스레드에서 수신 (블로킹)
    println!("{}", receiver.recv().unwrap());
    println!("{}", receiver.recv().unwrap());
}
```

## 핵심 개념

### 1. `move` 키워드

```rust
thread::spawn(move|| {
    s1.send(1).unwrap();
});
```

- 클로저가 `s1`의 **소유권을 가져감**
- 스레드가 메인 함수보다 오래 살 수 있으므로 소유권 이전 필수
- `move` 없으면 컴파일 에러 발생

### 2. `clone()`이 필요한 이유

```rust
let s1 = sender.clone();
let s2 = sender.clone();
```

- `sender`를 직접 move하면 한 스레드에서만 사용 가능
- 여러 스레드에서 메시지를 보내려면 각각 clone 필요
- 모든 sender가 drop되면 채널이 닫힘

### 3. `recv()` 동작

- 메시지가 올 때까지 **블로킹** (대기)
- 채널이 닫히면 `Err` 반환
- 논블로킹 버전: `try_recv()`

## 출력 결과

```
1
2
```

또는

```
2
1
```

스레드 실행 순서는 보장되지 않으므로 순서가 바뀔 수 있습니다.

---

recv try 와 recv timeout 도 사용할 수 있다.

try_recv 는 blocking 하지 않고 바로 값이 없다면 Err 로 넘어간다.

recv_timeout 은 그 시간만큼 기다린다.

```rs
use std::sync::mpsc::channel;
use std::thread;
use std::time::Duration;
use std::thread::sleep;

fn sleepy(time: u64) {
    sleep(Duration::from_millis(time));
}

fn main() {
    let (sender, receiver) = channel();

    let s1 = sender.clone();
    let s2 = sender.clone();

    thread::spawn(move|| {
        sleepy(1000);
        s1.send(1).unwrap();
    });

    thread::spawn(move|| {
        sleepy(500);
        s2.send(2).unwrap();
    });

    println!("{:?}", receiver.try_recv());
    println!("{:?}", receiver.recv_timeout(Duration::from_millis(1000)));
}
```

channel 에서 send 를 하려면 같은 타입이여야 한다.

다른 타입을 보내는 경우 Any 를 이용해서 보낼수 있다.

```rs
use std::sync::mpsc::channel;
use std::thread;
use std::time::Duration;
use std::thread::sleep;
use std::any::Any;



fn sleepy(time: u64) {
    sleep(Duration::from_millis(time));
}

#[derive(Debug)]
struct Book {
    name: String
}

fn book() -> Box<dyn Any + Send> {
    let book = Book {
        name: "My Book".to_string()
    };
    Box::new(book)
}

#[derive(Debug)]
struct Magazine {
    name: String
}

fn magazine() -> Box<dyn Any + Send> {
    let magazine = Magazine {
        name: "Nice Magazine".to_string()
    };
    Box::new(magazine)
}

fn main() {
    let (sender, receiver) = channel();

    let s1 = sender.clone();
    let s2 = sender.clone();

    thread::spawn(move|| {
        for _ in 0..5 {
            sleepy(100);
            s1.send(book()).unwrap();
        }
    });

    thread::spawn(move|| {
        for _ in 0..5 {
            sleepy(50);
            s2.send(magazine()).unwrap();
        }
    });

    while let Ok(any_type) = receiver.recv() {
        if let Some(book) = any_type.downcast_ref::<Book>() {
            println!("Book: {}", book.name);
        } else if let Some(magazine) = any_type.downcast_ref::<Magazine>() {
            println!("Magazine: {}", magazine.name);
        }
    }
}
```
