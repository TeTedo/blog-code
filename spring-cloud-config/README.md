# Spring Cloud Config

Spring Cloud Config Server는 분산 시스템에서 설정 파일을 중앙에서 관리하고 애플리케이션이 시작될 때 설정을 동적으로 로드할 수 있도록 도와주는 서버입니다. 이를 통해 애플리케이션의 설정을 일관되게 관리하고, 설정 변경 시 애플리케이션을 재배포하지 않고도 설정을 업데이트할 수 있습니다.

## 주요 기능

- **중앙 집중식 설정 관리**: 모든 애플리케이션의 설정 파일을 중앙에서 관리합니다.
- **환경별 설정 지원**: 개발, 테스트, 운영 등 다양한 환경에 맞는 설정을 지원합니다.
- **버전 관리**: Git과 같은 버전 관리 시스템을 통해 설정 파일의 변경 이력을 관리할 수 있습니다.
- **동적 설정 로드**: 애플리케이션이 실행 중에도 설정을 동적으로 로드할 수 있습니다.

## 설정 방법

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

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

4. **설정 파일 경로**:

   ```yaml
   server:
     port: 8888

   spring:
     cloud:
       config:
         server:
           git:
             uri: https://github.com/your-repo/config-repo
             clone-on-start: true
   ```

## 참고 자료

- [Spring Cloud Config 공식 문서](https://spring.io/projects/spring-cloud-config)
- [Spring Cloud Config GitHub 저장소](https://github.com/spring-cloud/spring-cloud-config)
- [[Spring] Spring Cloud Config 도입하기 및 private 레포지토리 SSL로 연결 설정 및 privateKey 암호화](https://mangkyu.tistory.com/253)
