# Spring Security - Oauth 2.0

## Google login

<img width="542" alt="google cloud" src="https://github.com/TeTedo/blog-code/assets/107897812/dba04529-ac2e-473d-a785-7e1e3621b8af">

1. [구글 클라우드 플랫폼 주소](https://console.cloud.google.com/)으로 이동해서 프로젝트 만들기

<img width="428" alt="oauth-practice" src="https://github.com/TeTedo/blog-code/assets/107897812/1e6c3857-f626-4251-8c78-567f578ba5fe">

2. 완성된 프로젝트 생성 후 API 및 서비스 클릭

<img width="865" alt="oauth" src="https://github.com/TeTedo/blog-code/assets/107897812/4d1ddbca-e85f-480a-8b07-7c8a859cd7b1">

3. OAuth 클라이언트 ID 만들기

<img width="543" alt="oauth-redirect" src="https://github.com/TeTedo/blog-code/assets/107897812/c68b1062-f8fc-4571-96a8-e78cd84649a3">

4. OAuth는 리다이렉션 URI를 설정하여 로그인 성공시 보여줄 화면을 지정할 수 있다.

5. application-oatuh.yml 파일 생성

```java
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id:
            client-secret:
            scope: profile, email
```

scope를 설정하지 않으면 기본으로 openid, profile, email이 등록된다.

이렇게 되면 openid Provider로 인식하여 추후 네이버, 카카오 로그인시 나눠서 Service를 만들어야 한다.

하나의 Service로 구현하기 위해 openid를 빼고 등록했다.

client-id와 client-scret은 env파일로 숨겨서 보관하자.

