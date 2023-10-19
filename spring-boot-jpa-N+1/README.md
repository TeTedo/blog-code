# JPA N + 1의 모든것

모든 코드는 [github]()에 있습니다.

JPA를 사용하면 한번쯤 접하게 되는 N+1 문제에 대해서 다양한 해결책을 공부하려고 한다.

## 1. N + 1 문제란?

연관 관계가 설정된 엔티티를 조회(1)할 경우 조회된 데이터의 갯수(n)만큼 연관관계의 조회 쿼리가 추가로 발생하여 1 + n개 만큼의 쿼리가 발생하는 현상이다.

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

## 4. X To One

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

이 말은 즉, 일반 Join으로 데이터를 가져오면 1차 캐시에 올라가지 않는다는 것이다.

참고로 `JOIN FETCH`는 Hibernate 구현체에서 구현되어있는 JQPL이다.

## 4-1. EntityGraph

어떤 속성이나 관계를 즉시 로딩 또는 지연 로딩으로 할지를 세밀하게 제어할 수 있다.

### MemberRepository.java

```java
@Query("""
        SELECT m
        FROM Member m
        """)
@EntityGraph(attributePaths = { "team" })
List<Member> findAllByEntityGraph();
```

### MemberRepositoryTest.java

```java
@Test
public void 멤버_조회_EntityGraph() {
    List<Member> members = memberRepository.findAllByEntityGraph();

    for (Member member : members) {
        System.out.println(member.getTeam());
    }
}
```

![image](https://github.com/TeTedo/practice_springboot/assets/107897812/bbfcc92e-69d1-4bdf-9d9d-e44d88e87499)

쿼리를 보면 EntityGraph는 outer join 쿼리를 날린다는 차이가 있다.

EntityGraph는 `type = EntityGraphType.FETCH` 이나 `type = EntityGraphType.LOAD` 으로 정할 수 있다.

EntityGraph는 Fetch Join과 비슷하게 동작한다고 생각할 수 있는데 fetch 타입을 런타임에 동적으로 바꿔서 동작한다는 차이점이 있다.

`FETCH` : EntityGraph에 명시한 attribute는 EAGER로 fetch하고 나머지 attribute는 LAZY로 fetch

`LOAD` : EntityGraph에 명시한 attribute는 EAGER로 fetch하고 나머지 attribute는 entity에 명시한 fetch type으로 fetch

## 4-2. Paging

Fetch Join으로 페이징 처리도 잘 되는지 확인해보겠다.

### MemberRepository.java

```java
@Query("""
        SELECT m
        FROM Member m
        JOIN FETCH m.team t
        """)
Page<Member> findAllByFetchJoinWithPaging(Pageable pageable);
```

### MemberRepositoryTest.java

```java
@Test
public void 멤버_조회_FETCH_JOIN_Paging() {

    int pageNumber = 0;
    int pageSize = 5;
    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

    Page<Member> members = memberRepository.findAllByFetchJoinWithPaging(pageRequest);

    for (Member member : members) {
        System.out.println(member.getTeam());
    }

    Assertions.assertThat(members.getSize()).isEqualTo(pageSize);
    Assertions.assertThat(members.getContent())
            .extracting("username")
            .containsExactly("username0", "username1", "username2", "username3", "username4");
}
```

![image](https://github.com/TeTedo/practice_springboot/assets/107897812/8353a521-6bfd-4c97-9cc5-216bd8e54f14)

X To One 일때 Fetch Join으로 페이징 처리까지 잘 동작하는걸 알수 있다.

## 5. X To Many

X To Many 에서도 Fetch Join으로 해결할 수 있는지 확인해본다.

Team 조회 에서는 조건을 조금 바꿔보겠다.

### TeamRepositoryTest.java

```java
@SpringBootTest
@Transactional(readOnly = true)
public class TeamRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    EntityManager em;

    @BeforeEach
    public void setUp() {
        Team teamA = Team.builder()
                .name("teamA")
                .build();

        Team teamB = Team.builder()
                .name("teamB")
                .build();

        teamRepository.save(teamA);
        teamRepository.save(teamB);

        for (int i = 0; i < 100; i++) {

            Member member = Member.builder()
                    .username("username" + i)
                    .team(i % 2 == 0 ? teamA : teamB)
                    .build();

            memberRepository.save(member);
        }

        em.flush();
        em.clear();
    }
}

```

여기서 MemberRepositoryTest의 setUp과 다른점은 team 100개를 만드는게 아니라 2팀으로 나누어 멤버를 2팀에 넣어주는 것이다.

먼저 기본 findAll로 했을때 어떻게 되는지 보겠다.

### TeamRepositoryTest.java

```java
@Test
public void 팀_조회() {
    List<Team> teams = teamRepository.findAll();

    for (Team team : teams) {
        System.out.println("team : " + team);

        for (Member member : team.getMembers()) {
            System.out.println("member : " + member);
        }
    }
}
```

![image](https://github.com/TeTedo/practice_springboot/assets/107897812/d480ded9-5512-4780-a636-8cc270efb24f)

위와 같이 N+1문제가 발생한다.

그럼 이것도 Fetch Join으로 해보면 다음과 같다.

### TeamRepository.java

```java
@Query("""
        SELECT t
        FROM Team t
        JOIN FETCH t.members m
        """)
List<Team> findAllByFetchJoin();
```

### TeamRepositoryTest.java

```java
@Test
public void 팀_조회_FETCH_JOIN() {
    List<Team> teams = teamRepository.findAllByFetchJoin();

    for (Team team : teams) {
        System.out.println("team : " + team);

        for (Member member : team.getMembers()) {
            System.out.println("member : " + member);
        }
    }
}
```

![image](https://github.com/TeTedo/practice_springboot/assets/107897812/7d38536a-ff72-4ecc-a2b3-a1bea05adce7)

X To Many 또한 Fetch Join으로 N+1문제를 해결할 수 있다.

> **참고**
>
> Hibernate 6 버전 부터는 기존 발생하던 데이터 중복 문제를 해결했다.
> Hibernate 5 까지는 데이터 중복문제가 발생하여 주로 distinct나 BatchSize로 해결했다.
>
> https://github.com/hibernate/hibernate-orm/blob/6.0/migration-guide.adoc#distinct

X To Many인 경우 Fetch Join을 사용할때 페이징처리시 문제가 생길 수 있다.

## 5-1. Paging

### TeamRepository.java

```java
@Query("""
    SELECT t
    FROM Team t
    JOIN FETCH t.members m
    """)
Page<Team> findAllByFetchJoinWithPaging(Pageable pageable);
```

### TeamRepositoryTest.java

```java
@Test
public void 팀_조회_FETCH_JOIN_Paging() {
    int pageNumber = 0;
    int pageSize = 3;
    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

    Page<Team> teams = teamRepository.findAllByFetchJoinWithPaging(pageRequest);

    for (Team team : teams) {
        System.out.println("team : " + team);

        for (Member member : team.getMembers()) {
            System.out.println("member : " + member);
        }
    }
}
```

### 쿼리 결과 분석

![image](https://github.com/TeTedo/practice_springboot/assets/107897812/15b15b96-88ec-4859-8e75-5b7198a5a82b)

쿼리 결과를 자세히 보면 paging 처리하는 쿼리를 날리지 않고 위에 있는 Fetch Join 쿼리와 같은 쿼리를 날리고 있는걸 볼 수 있다.

Hibernate는 Fetch Join과 함께 컬렉션에 대한 페이징을 지원하지 않는다.

### 컬렉션 조회시 Fetch Join과 Paging을 지원하지 않는 이유

![image](https://github.com/TeTedo/practice_springboot/assets/107897812/f1a087fc-5166-48b0-b804-53a0bffe129e)

이미지 출처 : https://velog.io/@mohai2618/JPA%EC%97%90%EC%84%9C-fetchJoin%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%A0-%EB%95%8C-%EC%A3%BC%EC%9D%98%ED%95%B4%EC%95%BC%ED%95%A0-%EC%A0%90

컬렉션 조회시 join을 할 경우 위 그림처럼 중복된 데이터가 발생할 수 있다.

그래서 페이징 처리를 하기 위해서는 모든 데이터를 메모리에 올린후 페이징처리를 해야하는 복잡성 때문에 아예 Hibernate에서 지원을 하지 않는것이다.

이렇게 컬렉션 조회시 Paging처리를 하기 위해서는 BatchSize를 이용해서 처리할 수 있다.

## BatchSize

BatchSize를 적용하는 방법은 Entity class, Entity Field, application.yml에 각각 적용하는 방법등이 있다.

나는 이방법중 application.yml으로 적용할 것이다.

### application.java

```yml
spring:
  properties:
    hibernate:
      default_batch_fetch_size: 100
```

### TeamRepository.java

```java
@Test
public void 팀_조회_BatchSize() {
    int pageNumber = 0;
    int pageSize = 3;
    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

    Page<Team> teams = teamRepository.findAll(pageRequest);

    for (Team team : teams) {
        System.out.println("team : " + team);

        for (Member member : team.getMembers()) {
            System.out.println("member : " + member);
        }
    }
}
```

### 쿼리 결과

![image](https://github.com/TeTedo/practice_springboot/assets/107897812/bf7080c2-1c26-4df5-b837-42410379117f)

결과는 성공이다.

@BatchSize로 기존 엔티티를 먼저 페이징 처리로 가져온후 연관관계는 나중에 In 쿼리로 한번더 조회한다.

컬렉션 페이징 처리는 N+1문제를 1+1번의 쿼리로 해결할수 있다.

## 결론

X To One은 Fetch Join이나 EntityGraph로 해결

X To Many는 BatchSize로 해결

## 참고

- [JPA N+1 문제 해결 방법 및 실무 적용 팁 - 삽질중인 개발자](https://programmer93.tistory.com/83)

- [[JPA] N+1 문제가 발생하는 여러 상황과 해결방법](https://ttl-blog.tistory.com/1135#%F0%9F%91%89%20N%20%2B%201%20%EB%B0%9C%EC%83%9D%ED%95%98%EB%8A%94%20%EC%83%81%ED%99%A9-4)

- [[JPA] 일반 Join과 Fetch Join의 차이](https://cobbybb.tistory.com/18)

- [JPA에서 fetchJoin을 사용할 때 주의해야할 점](https://velog.io/@mohai2618/JPA%EC%97%90%EC%84%9C-fetchJoin%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%A0-%EB%95%8C-%EC%A3%BC%EC%9D%98%ED%95%B4%EC%95%BC%ED%95%A0-%EC%A0%90)
