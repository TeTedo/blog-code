# Spring Security - Oauth 2.0

## **Google login**

<img width="542" alt="google cloud" src="https://github.com/TeTedo/blog-code/assets/107897812/dba04529-ac2e-473d-a785-7e1e3621b8af">

### **1. [구글 클라우드 플랫폼 주소](https://console.cloud.google.com/)으로 이동해서 프로젝트 만들기**

<img width="428" alt="oauth-practice" src="https://github.com/TeTedo/blog-code/assets/107897812/1e6c3857-f626-4251-8c78-567f578ba5fe">

### **2. 완성된 프로젝트 생성 후 API 및 서비스 클릭**

<img width="865" alt="oauth" src="https://github.com/TeTedo/blog-code/assets/107897812/4d1ddbca-e85f-480a-8b07-7c8a859cd7b1">

### **3. OAuth 클라이언트 ID 만들기**

<img width="543" alt="oauth-redirect" src="https://github.com/TeTedo/blog-code/assets/107897812/c68b1062-f8fc-4571-96a8-e78cd84649a3">

### **4. OAuth는 리다이렉션 URI를 설정하여 로그인 성공시 보여줄 화면을 지정할 수 있다.**

### **5. application-oatuh.yml 파일 생성**

```java
spring:
    security:
        oauth2:
            client:
                registration:
                    google:
                        client-id: ${GOOGLE_CLIENT_ID}
                        client-secret: ${GOOGLE_CLIENT_SECRET}
                        scope: profile, email
```

scope를 설정하지 않으면 기본으로 openid, profile, email이 등록된다.

이렇게 되면 openid Provider로 인식하여 추후 네이버, 카카오 로그인시 나눠서 Service를 만들어야 한다.

하나의 Service로 구현하기 위해 openid를 빼고 등록했다.

client-id와 client-scret은 env파일로 숨겨서 보관하자.

### **6. User Entity 만들기**

```java
// domain.user.model.vo.Role
@RequiredArgsConstructor
@Getter
public enum Role {
    GUEST("ROLE_GUEST", "게스트"),
    USER("ROLE_USER", "유저");

    private final String type;
    private final String role;
}

// domain.user.model.User
@Entity
@NoArgsConstructor
@Getter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder
    public User(Long id, String name, String email, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getRoleKey() {
        return role.getType();
    }
}
```

유저 엔티티를 만들고 Role이라는 enum을 생성했다.

### **7. UserRepository 생성**

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

이메일을 통해 가입이 되어있는지 안되어있는지 확인하기 위해 findByEmail을 미리 만들어 준다.

### **8. OAuthAttributes Class 생성**

```java
@Getter
public class OAuthAttributes {
    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private String name;
    private String email;
    
    @Builder
    public OAuthAttributes(Map<String, Object> attributes, String nameAttributeKey, String name, String email) {
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        this.name = name;
        this.email = email;
    }
    
    public static OAuthAttributes of(String registrationId, String userNameAttributeName,
                                     Map<String, Object> attributes) {
        // 어떤 플랫폼에서 로그인하는지 체크한다.
        if("naver".equals(registrationId)) {
            return ofNaver("id", attributes);
        }
        
        return ofGoogle(userNameAttributeName, attributes);
    }

    private static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    private static OAuthAttributes ofNaver(String userNameAttributeName, Map<String, Object> attributes) {
        Map<String,Object> response = (Map<String, Object>) attributes.get("response");
        return OAuthAttributes.builder()
                .name((String) response.get("name"))
                .email((String) response.get("email"))
                .attributes(response)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    public User toEntity(){
        return User.builder()
                .name(name)
                .email(email)
                .role(Role.GUEST)
                .build();
    }

}
```

이 클래스는 유저가 로그인 시도를 할때 어떤 플랫폼에서 로그인 시도를 하는지 체크하고 기존 유저아이디의 정보를 받아오는 클래스이다.

### **9. SessionUser Class 생성**

```java
@Getter
public class SessionUser implements Serializable {
    private String name;
    private String email;

    public SessionUser(User user) {
        name = user.getName();
        email = user.getEmail();
    }
}
```

유저의 정보를 세션에 담기 위해 따로 클래스를 생성한다.

User Entity를 세션에 담을 수도 있지만 나중에 자식 엔티티를 갖게 될경우 너무 많은 정보를 담게 된다면 성능에 문제가 생길 수 도 있다.

필요한 정보만 세션에 담기 위해 클래스를 만들어 준다.

### **10. CustomOAuth2UserService**

```java
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final UserRepository userRepository;
    private final HttpSession httpSession;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();

        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration()
                .getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        OAuthAttributes oAuthAttributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        User user = saveOrUpdate(oAuthAttributes);

        httpSession.setAttribute("user", new SessionUser(user));

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRoleKey())),
                oAuthAttributes.getAttributes(), oAuthAttributes.getNameAttributeKey());
    }

    private User saveOrUpdate(OAuthAttributes oAuthAttributes) {
        // 중복 체크
        User user = userRepository.findByEmail(oAuthAttributes.getEmail())
                .map(entity -> entity.update(oAuthAttributes.getName()))
                .orElse(oAuthAttributes.toEntity());

        return userRepository.save(user);
    }
}
```

유저가 로그인 요청시 위에서 만들었던 OAuthAttributes 클래스를 이용하여 OAuth2User 를 만든다.

이때 User Entity에서 설정했던 Role을 부여하여 가지고 있는다.

### **11. SecurityConfig 생성**

```java
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .headers().frameOptions().disable()
                .and().authorizeHttpRequests()
                .requestMatchers("/","/css/**","/images/**","/js/**","/h2-console/**").permitAll()
                .requestMatchers("/api/v1/**").hasRole(Role.USER.name())
                .anyRequest().authenticated()
                .and().logout().logoutSuccessUrl("/")
                .and().oauth2Login()
                .userInfoEndpoint()
                .userService(customOAuth2UserService);

        return http.build();

    }
}
```

지금 spring security가 7.0을 준비한다고 속성들이 deprecated 되었다고 하는데 무시하고 실행했더니 잘된다.

[spring security 공식문서](https://docs.spring.io/spring-security/reference/migration-7/configuration.html) 참고

참고

[스프링 부트와 AWS로 혼자 구현하는 웹 서비스 - 이동욱 지음 p163~190](https://www.yes24.com/Product/Goods/83849117) 책에 더 자세한 내용이 나와있습니다.
