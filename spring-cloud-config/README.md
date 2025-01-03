# Spring Cloud Config

모든 코드는 [깃허브](https://github.com/TeTedo/blog-code/tree/main/springboot-propagation-required-new)에서 볼수 있습니다.

Spring Cloud Config Server는 분산 시스템에서 설정 파일을 중앙에서 관리하고 애플리케이션이 시작될 때 설정을 동적으로 로드할 수 있도록 도와주는 서버입니다. 이를 통해 애플리케이션의 설정을 일관되게 관리하고, 설정 변경 시 애플리케이션을 재배포하지 않고도 설정을 업데이트할 수 있습니다.

## 주요 기능

- **중앙 집중식 설정 관리**: 모든 애플리케이션의 설정 파일을 중앙에서 관리합니다.
- **환경별 설정 지원**: 개발, 테스트, 운영 등 다양한 환경에 맞는 설정을 지원합니다.
- **버전 관리**: Git과 같은 버전 관리 시스템을 통해 설정 파일의 변경 이력을 관리할 수 있습니다.
- **동적 설정 로드**: 애플리케이션이 실행 중에도 설정을 동적으로 로드할 수 있습니다.

## Config Server

1. **Spring Cloud Config Server 의존성 추가 (Gradle)**:

```groovy
plugins {
	id 'java'
	id 'org.springframework.boot' version '3.4.1'
	id 'io.spring.dependency-management' version '1.1.7'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

ext {
	set('springCloudVersion', "2024.0.0")
}

dependencies {
    // web
	implementation 'org.springframework.boot:spring-boot-starter-web'

    // actuator
	implementation 'org.springframework.boot:spring-boot-starter-actuator'

    // config-server
	implementation 'org.springframework.cloud:spring-cloud-config-server'

    // test
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

dependencyManagement {
	imports {
		mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
	}
}

tasks.named('test') {
	useJUnitPlatform()
}

```

2. **Config Server application.yml 설정**

```yml
server:
  port: 8888

spring:
  application:
    name: config
  cloud:
    config:
      server:
        git:
          uri: https://github.com/TeTedo/blog-code # 깃 주소가 기본이지만 로컬 file 도 사용가능
          search-paths: spring-cloud-config/config-file/** # 설정 파일 경로
          default-label: main # branch 이름
```

3. **Config Server 애플리케이션 설정**:

@EnableConfigServer 어노테이션을 추가한다.

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

4. **설정 파일 경로**

config 파일이 있는 경로에 {어플리케이션이름}-{profile}.yml 형식으로 작성하면
localhost:8888/{어플리케이션이름}/{profile} 로 접근해서 받을수 있다.

(1) sso-dev.yml

http://localhost:8888/sso/dev

```json
{
  "name": "sso",
  "profiles": ["dev"],
  "label": null,
  "version": "9fbfd60974f823c23cae9fb3e9297c67a72f4af3",
  "state": "",
  "propertySources": [
    {
      "name": "https://github.com/TeTedo/blog-code/spring-cloud-config/config-file/sso/dev/sso-dev.yml",
      "source": {
        "name": "sso",
        "profile": "dev"
      }
    }
  ]
}
```

## Client

1. **Spring Cloud Config Server 의존성 추가 (Gradle)**:

```groovy
plugins {
	id 'java'
	id 'org.springframework.boot' version '3.4.1'
	id 'io.spring.dependency-management' version '1.1.7'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

ext {
	set('springCloudVersion', "2024.0.0")
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.cloud:spring-cloud-starter-config'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

dependencyManagement {
	imports {
		mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
	}
}

tasks.named('test') {
	useJUnitPlatform()
}

```

2. **Client application.yml 설정**

```yml
spring:
  application:
    name: sso
  profiles:
    active: dev
  config:
    import: "optional:configserver:"

  cloud:
    config:
      uri: http://localhost:8888
      fail-fast: true # Config Server 연결 실패시 애플리케이션 시작 실패
```

3. **property 설정**

(1) MyConfig.java

```java
@Getter
@Setter
@RefreshScope
@ConfigurationProperties(prefix = "")
@Configuration
public class MyConfig {
    private String name;
    private String profile;
}
```

(2) ConfigController

```java
@RestController
@RequiredArgsConstructor
public class ConfigController {

    private final MyConfig myConfig;

    @GetMapping("/config")
    public String getConfig() {
        return myConfig.getName() + " " + myConfig.getProfile();
    }
}
```

(3) localhost:8080/config

sso dev 가 잘 출력되는걸 볼수 있다.

## 참고 자료

- [Spring Cloud Config 공식 문서](https://spring.io/projects/spring-cloud-config)
- [Spring Cloud Config GitHub 저장소](https://github.com/spring-cloud/spring-cloud-config)
- [[Spring] Spring Cloud Config 도입하기 및 private 레포지토리 SSL로 연결 설정 및 privateKey 암호화](https://mangkyu.tistory.com/253)
