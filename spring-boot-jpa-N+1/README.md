# JPA N + 1

모든 코드는 [github]()에 있습니다.

JPA를 사용하면 한번쯤 접하게 되는 N+1 문제에 대해서 다양한 해결책을 공부하려고 한다.

## 1. N + 1 문제란?

연관 관계가 설정된 엔티티를 조회할 경우 조회된 데이터의 갯수(n)만큼 연관관계의 조회 쿼리가 추가로 발생하는 현상이다.

## 2. 프로젝트 기본 세팅

### (1) Member.java

```java
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = { "id", "username" })
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @Builder
    public Member(Long id, String username, Team team) {
        this.id = id;
        this.username = username;
        this.team = team;
    }

    public void updateTeam(Team team) {
        this.team = team;
        team.getMembers().add(this);
    }
}
```

### (2) Team.java

```java
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = { "id", "name" })
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "team")
    private List<Member> members = new ArrayList<>();

    @Builder
    public Team(Long id, String name, List<Member> members) {
        this.id = id;
        this.name = name;
        this.members = members;
    }
}
```

### (3) MemberRepository.java

```java
public interface MemberRepository extends JpaRepository<Member, Long> {
}
```

### (4) TeamRepository.java

```java
public interface TeamRepository extends JpaRepository<Team, Long> {
}
```

### (5) MemberRepositoryTest.java

```java
@SpringBootTest
@Transactional(readOnly = true)
public class MemberRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    EntityManager em;

    @BeforeEach
    public void setUp() {
        for (int i = 0; i < 100; i++) {
            Team team = Team.builder()
                    .name("teamName" + i)
                    .build();

            teamRepository.save(team);

            Member member = Member.builder()
                    .username("username" + i)
                    .team(team)
                    .build();

            memberRepository.save(member);
        }

        em.flush();
        em.clear();
    }
}
```

## 3. Loading LAZY

```java
@Test
public void 멤버_조회() {
    List<Member> members = memberRepository.findAll();
}
```

위 코드만 실행 시켜보면 바로 N + 1 문제가 발생한다.

member를 전체조회 하는 쿼리 (1) + member의 team을 조회하는 쿼리(N)개의 쿼리가 발생하는 것이다.

entity에서 @ManyToOne 어노테이션의 default fetch 타입은 EAGER(즉시로딩)으로 설정되어있다.

```java
FetchType fetch() default FetchType.EAGER;
```

이 설정은 조회시 모든 데이터를 즉시 로딩한다는 설정이다.

나중에 알아볼 Batch size를 설정하여 문제를 해결할 수도 있지만, EAGER로 설정하면 예상하지 못한 쿼리가 나갈 수 있다는 단점이 있다.

그래서 우선적으로 fetch type을 모두 LAZY(지연로딩)으로 바꿀 것이다.

X To Many 의 fetch type은 default가 LAZY로 설정되어있기 때문에 건드리지 않아도 된다.

### 수정 후 Member.java

```java
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = { "id", "username" })
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @Builder
    public Member(Long id, String username, Team team) {
        this.id = id;
        this.username = username;
        this.team = team;
    }

    public void updateTeam(Team team) {
        this.team = team;
        team.getMembers().add(this);
    }
}
```

LAZY로 설정해주었기 때문에 findAll 에서는 추가 쿼리를 날리지 않게 된다.

## 4. Fetch Join

findAll() 에서 초기 데이터 조회시 N+1 문제는 LAZY 로딩으로 해결할 수 있었다.

LAZY로딩은 초기에 조회하지 않고 실제 값을 사용할때 조회해서 사용한다는 뜻이다.

그래서 실제 데이터를 쓰려고 할때 반복문을 돌면 그만큼 조회하는 쿼리가 나가게 된다.

```java
@Test
public void 멤버_조회() {
    List<Member> members = memberRepository.findAll();

    for (Member member : members) {
        System.out.println(member.getTeam());
    }
}
```

member를 조회하는 findAll 에서는 N+1문제를 해결했지만 그 다음 반복문에서 team을 받으려고 한다면 1차 캐시에 올라가있지 않기 때문에 각 member의 팀을 조회하는 쿼리를 날리게 된다.

![image](https://github.com/TeTedo/practice_springboot/assets/107897812/5cff4097-2b7b-433b-9a45-9c9e53f088d3)

이렇게 되면 또 N+1 문제가 발생한다.

이를 해결하기 위해서 Fetch Join을 사용하여 member를 조회할때 한번에 team까지 같이 조회한다.

### MemberRepository.java

```java
public interface MemberRepository extends JpaRepository<Member, Long> {
    @Query("""
            SELECT m
            FROM Member m
            JOIN FETCH m.team t
            """)
    List<Member> findAllByFetchJoin();
}
```

Join Fetch는 default로 Inner Join이 실행된다.

이를 테스트 코드로 작성해보면 다음과 같다.

```java
@Test
public void 멤버_조회_FETCH_JOIN() {
    List<Member> members = memberRepository.findAllByFetchJoin();

    for (Member member : members) {
        System.out.println(member.getTeam());
    }
}
```

![image](https://github.com/TeTedo/practice_springboot/assets/107897812/f77a8cc0-df5c-4dfa-9b06-17900b87644b)

그러면 위와 같이 1개의 조회 쿼리만 나가게 되면서 X To One의 연관관계의 N+1 문제를 해결할 수 있다.

### + Fetch Join은 일반 Join과 어떤게 다를까?

먼저 직접 구현을 해보며 차이점을 알아보겠다.

```java
@Query("""
        SELECT m
        FROM Member m
        Join m.team
        """)
List<Member> findAllByJoin();
```

Repository에 코드를 추가하고 Test코드를 작성해보겠다.

```java
@Test
public void 멤버_조회_JOIN() {
    List<Member> members = memberRepository.findAllByJoin();

    for (Member member : members) {
        System.out.println(member.getTeam());
    }
}
```

![image](https://github.com/TeTedo/practice_springboot/assets/107897812/dada152e-30ac-41c7-976f-90eaee6d2ab1)

결과는 Lazy Loading을 설정한 일반 findAll과 같이 team을 조회할때마다 쿼리를 날리는 N+1문제가 발생했다.

## 4-1. EntityGraph

## 5. Batch Size

X To Many 에서도 Fetch Join으로 해결할 수 있는지 테스트 코드를 작성하여 로그를 찍어보겠다.

## 6. 의존관계 자식이 1차 캐시에 있다면?

## 참고

- [JPA N+1 문제 해결 방법 및 실무 적용 팁 - 삽질중인 개발자](https://programmer93.tistory.com/83)

- [[JPA] N+1 문제가 발생하는 여러 상황과 해결방법](https://ttl-blog.tistory.com/1135#%F0%9F%91%89%20N%20%2B%201%20%EB%B0%9C%EC%83%9D%ED%95%98%EB%8A%94%20%EC%83%81%ED%99%A9-4)

- [[JPA] 일반 Join과 Fetch Join의 차이](https://cobbybb.tistory.com/18)

```

```
