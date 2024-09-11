# Propagation.REQUIRES_NEW에서 겪은 이슈

> 모든 코드는 [Github](https://github.com/TeTedo/blog-code/tree/main/springboot-propagation-required-new)에 저장되어 있습니다.

> ### 이슈
>
> **Propagation.REQUIRES_NEW** 써도 따로 커밋이 안되는 현상

## 1. 배경지식

> Propagation이란 사전적 의미로 **전파**, **번식**등의 의미를 가지고 있다.

### Transaction Propagation (트랜잭션의 전파 속성)

트랜잭션의 전파속성이란 이미 트랜잭션이 진행중일 때 추가 트랜잭션 진행을 어떻게 할지 결정하는 것이다.

속성에 따라서 기존 트랜잭션에 참여할 수도 있고 새로운 트랜잭션을 만들수도 있다.

### 물리 트랜잭션과 논리 트랜잭션

다른 블로그 글들을 보면 물리 트랜잭션, 논리 트랜잭션 이라고 하는데 추상적으로는 이해가 되지만 콕 찝어서 설명하라고 하면 못할것 같아서 따로 찾아보고 정리하려고 한다.

#### (1) 물리 트랜잭션

물리 트랜잭션이란 실제 데이터베이스의 트랜잭션을 의미한다.

Spring에서는 JDBC와 같은 커넥터를 이용해서 데이터베이스와 연결하는데 이때 실제로 연결된 커넥션을 의미하기도 한다.

물리 트랜잭션의 끝은 롤백/커밋을 호출하는것으로 끝낼수 있다.

#### (2) 논리 트랜잭션

Spring에서는 내부적으로 트랜잭션을 관리하는 트랜잭션 매니저라는 객체가 있다.

논리 트랜잭션이란 이 트랜잭션 매니저를 통해 트랜잭션을 처리하는 단위이다.

따라서 실제 데이터베이스 커넥션이 아니라 Spring 내부에서 나눈 트랜잭션 영역인 것이다.

#### ([[Spring] 스프링의 트랜잭션 전파 속성(Transaction propagation) 완벽하게 이해하기](https://mangkyu.tistory.com/269) 이블로그에 설명이 정말 잘되어있다.)

### REQUIRES_NEW란?

전파 속성에는 여러가지 속성이 있는데 REQUIRES_NEW 속성은 기존 트랜잭션에 참여하는게 아니라 새로운 물리 트랜잭션을 만드는 것이다.

새로운 물리 트랜잭션을 만들기 때문에 기존 트랜잭션과 별개로 롤백/커밋을 호출할 수 있는것이다.

Spring에서는 Default로 REQUIRED 속성을 사용하는데 이는 기존 트랜잭션이 있다면 참여하고 없다면 새로운 물리 트랜잭션을 만드는 것이다.

## 2. 요구사항

내 상황에서의 요구사항을 간략하게 정리하면 아래와 같다.

1. A 조회후 상태 변경
2. 비즈니스 로직 실행 후 A 상태 변경

1번이 실행되고 난 후 먼저 커밋을 호출하고 2번이 실행되어야 되는 상황이다.

## 3. 구현

구현을 위해 트랜잭션을 새로 생성하는 전파속성을 이용해서 먼저 커밋을 호출하면 되겠지라고 생각하고 구현했다.

```java
@Service
@RequiredArgsConstructor
public class AService {
    private final ARepository aRepository;

    @Transactional
    public void main() {
        A a = one();
        two(a);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public A one() {
        A a = aRepository.findById(1L)
                .orElseThrow(IllegalStateException::new);

        a.setState("state2");
        return a;
    }

    @Transactional
    public void two(A a) {
        a.setState("state3");
    }
}
```

예상으로는 one 실행후 새로운 물리트랜잭션에서 state2로 커밋된 후 two 실행후 전체 물리 트랜잭션이 커밋되면서 state3으로 실행되는걸 예상했다.

## 4. Test

테스트 코드를 작성하여 테스트를 해보고 싶었지만 테스트 환경에서의 트랜잭션은 중간에 commit 되지 않는다고 하여 debug로 테스트 해본다.

> 디버그로 테스트 결과 one을 실행시켰더니 select문의 쿼리만 실행됐고 모든 트랜잭션이 끝난 이후 update 쿼리가 실행됐다. 결과는 "state2"로 상태가 바뀌었다.

먼저 예상한 REQUIRES_NEW의 동작이 잘 안된 이유부터 찾아본다.

그 이유로는 Spring의 Transactional의 동작방식에 있었다.

간단하게 Transactional의 동작방식은 proxy 객체를 이용하는데 이때 동일 클래스에 있으면 새로운 proxy 객체를 만들지 않는것 같았다.

그래서 다른 서비스를 만들어 테스트를 진행했다.

```java
public class BService {

    private final ARepository aRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public A one() {
        A a = aRepository.findById(1L)
                .orElseThrow(IllegalStateException::new);

        a.setState("state2");
        return a;
    }

    @Transactional
    public void two(A a) {
        a.setState("state3");
    }
}

@Transactional
public void main2() {
    A a = bService.one();
    bService.two(a);
}
```

> 디버그로 찍어본 결과 one이 실행되면 select와 update 쿼리 두개가 실행됐다. 하지만 마찬가지로 "state2"로 결과가 나왔다.

여기서 문제는 트랜잭션의 범위이다.

select 쿼리가 REQUIRES_NEW로 새로운 물리 트랜잭션 안에서 조회했기때문에 이 안에서만 영속성 컨텍스트가 적용된 것으로 추측한다.

나는 같은 클래스안에서 REQUIRES_NEW를 사용해서 문제가 됬었고 해결했다. 끝..

## 참고

- [[Spring] 스프링의 트랜잭션 전파 속성(Transaction propagation) 완벽하게 이해하기](https://mangkyu.tistory.com/269)

- [Spring @Transactional 사용시 주의할점](https://velog.io/@roro/Spring-Transactional-%EC%82%AC%EC%9A%A9%EC%8B%9C-%EC%A3%BC%EC%9D%98%ED%95%A0%EC%A0%90)
