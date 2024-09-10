# Propagation.REQUIRES_NEW 쓰면 된다면서요

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
        A a = aRepository.findById(1L)
                .orElseThrow(IllegalStateException::new);

        one(a);
        two(a);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void one(A a) {
        a.setState("state2");
    }

    @Transactional
    public void two(A a) {
        a.setState("state3");
    }
}
```

예상으로는 one 실행후 새로운 물리트랜잭션에서 state2로 커밋된 후 two 실행후 전체 물리 트랜잭션이 커밋되면서 state3으로 실행되는걸 예상했다.

## 4. Test

```java
@SpringBootTest
class AServiceTest {

    @Autowired
    private AService aService;

    @Autowired
    private ARepository aRepository;

    @BeforeEach
    public void setup() {
        A entity = new A();
        entity.setId(1L);
        entity.setState("state1");
        aRepository.save(entity);
    }
}
```

먼저 Test를 세팅 해줬고 main 메소드가 잘 실행되는지부터 테스트 해본다.

```java
@Test
public void mainTest() {
    aService.main();

    A updatedEntity = aRepository.findById(1L).orElseThrow();
    assertEquals("state3", updatedEntity.getState());
}
```

> 테스트 성공

다음으로 실제 main 메서드와 비슷한 환경으로 테스트를 만들어봤다.

```java
@Test
@Transactional
public void 메인메소드와_비슷한_환경의_테스트() {
    A a = aRepository.findById(1L)
            .orElseThrow();

    aService.one(a);
    aService.two(a);

    A updatedEntity = aRepository.findById(1L).orElseThrow();
    assertEquals("state3", updatedEntity.getState());
}
```

> 테스트 성공 - 다음으로 one 메소드 실행 이후 커밋이 되는지 확인해본다.

```

```

## 참고

- [[Spring] 스프링의 트랜잭션 전파 속성(Transaction propagation) 완벽하게 이해하기](https://mangkyu.tistory.com/269)
