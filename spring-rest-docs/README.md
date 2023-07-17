# **Spring REST Docs**

## **REST Docs란?**

- 이름 그대로 REST 문서이다.

- REST API를 문서화하여 input, output, 파라미터 세부정보 등을 팀원과 공유할 수 있다.

- REST Docs는 테스트 코드를 통과하여야 문서로 작성되기 때문에 검증된 문서를 작성할 수 있다.

## **REST Docs를 선택한 이유?**

Spring에서 문서화를 할때 Swagger와 Rest Docs를 많이 사용한다.

개인적으로 Swagger UI가 더 보기 좋다.

그리고 Swagger는 curl을 통해 API를 바로 테스트 해볼 수 있지만 REST Docs는 단순히 문서만 제공한다.

여기까지 보고 나는 Swagger로 해야겠다는 생각을 하고 어떻게 코드를 작성하나 찾아봤다.

근데 Swagger는 기존 코드에 어노테이션을 덕지덕지 붙어야 한다는 단점이 있다.

코드의 가독성을 떨어뜨리면서까지 API문서를 만들어야 할까? 라는 생각이 컸고 결국 REST Docs로 선택을 바꿨다.

```java
// swagger 예시
@RestController
public class TutorialController {
  // ...

  @Operation(
      summary = "Retrieve a Tutorial by Id",
      description = "Get a Tutorial object by specifying its id. The response is Tutorial object with id, title, description and published status.",
      tags = { "tutorials", "get" })
  @ApiResponses({
      @ApiResponse(responseCode = "200", content = { @Content(schema = @Schema(implementation = Tutorial.class), mediaType = "application/json") }),
      @ApiResponse(responseCode = "404", content = { @Content(schema = @Schema()) }),
      @ApiResponse(responseCode = "500", content = { @Content(schema = @Schema()) }) })
  @GetMapping("/tutorials/{id}")
  public ResponseEntity<Tutorial> getTutorialById(@PathVariable("id") long id) {
    // ...
  }
}
```

Swagger는 요런식으로 기존에 있는 Controller에 코드 쓰는게 맘에 안들어서 REST Docs 선택!

## **REST Docs 구현**

### **1. build.gradle**

```java
plugins {
	id 'java'
	id 'org.springframework.boot' version '3.1.1'
	id 'io.spring.dependency-management' version '1.1.0'
	id "org.asciidoctor.jvm.convert" version "3.3.2"
}

group = 'restdocs'
version = '0.0.1-SNAPSHOT'

java {
	sourceCompatibility = '17'
}

configurations {
	compileOnly {
		extendsFrom annotationProcessor
	}

	asciidoctorExt
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.boot:spring-boot-starter'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'

	// build/generated-snippets 에 생긴 .adoc 들을 내가 설정한 index.adoc 에서 읽을수 있게 한다.
    // index.adoc 파일에서 operation을 사용하여 .adoc들을 연동한다.
    // 최종적으로 .adoc 파일을 HTML로 만들어 export 한다.
	asciidoctorExt 'org.springframework.restdocs:spring-restdocs-asciidoctor:3.0.0'
	// restdocs-mockmvc의 testCompile 구성 -> mockMvc를 사용해서 snippets 조각들을 뽑아낼 수 있게 된다.
	testImplementation 'org.springframework.restdocs:spring-restdocs-mockmvc:3.0.0'

	// lombok
	compileOnly 'org.projectlombok:lombok'
	annotationProcessor 'org.projectlombok:lombok'
}


ext {
	// 아래서 사용할 변수 선언
	snippetsDir = file('build/generated-snippets')
}

tasks.named('test') {
	// 스니펫 조각들이 build/generated-snippets로 출력
	outputs.dir snippetsDir
	useJUnitPlatform()
}

asciidoctor {

	configurations 'asciidoctorExt'
	dependsOn test // test에 의존하여 test작업 후 실행

	inputs.dir snippetsDir // snippetsDir 를 입력으로 구성

    // source가 없으면 .adoc파일을 전부 html로 만들어버림
    // source 지정시 특정 adoc만 HTML로 만든다.
    sources{
        include("**/index.adoc")
    }
}

// static/docs 폴더 비우기
asciidoctor.doFirst {
    delete file('src/main/resources/static/docs')
}

// asccidoctor 작업 이후 생성된 HTML 파일을 static/docs 로 copy
task copyDocument(type: Copy) {
    dependsOn asciidoctor
    from file("build/docs/asciidoc")
    into file("src/main/resources/static/docs")
}

// 파일 복사 후 빌드 진행
build {
    dependsOn copyDocument
}


// jar 파일이 생성되기 전에 Html 생성
// bootJar {
// 	dependsOn asciidoctor
// 	from ("${asciidoctor.outputDir}/html5") {
// 		into 'static/docs'
// 	}
// }


```

[spring-rest-docs 공식문서](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/)를 참고해서 작성하면 된다.

공식문서에서는 bootJar로 생성하지만 나는 main/resources에 파일을 복사하기 위해 추가 task를 만들었다.

### **2. 코드 작성**

**(1) MemberController.java**

```java
@RestController
@RequestMapping("/members")
public class MemberController {

    @GetMapping
    public ResponseEntity<MemberResponse> getMemberList() {

        MemberResponse response = MemberResponse.builder()
                .build();

        return ResponseEntity.ok().body(response);
    }

}
```

**(2) MemberControllerTest.java**

```java
@WebMvcTest({ MemberController.class })
@ExtendWith(RestDocumentationExtension.class)
public class MemberControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp(
            WebApplicationContext webApplicationContext,
            RestDocumentationContextProvider restDocumentationContextProvider) {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(MockMvcRestDocumentation.documentationConfiguration(restDocumentationContextProvider))
                .build();
    }

    @Test
    @DisplayName("REST Docs TEST")
    void writeDoc() throws Exception {
        ResultActions resultActions = mockMvc.perform(
                MockMvcRequestBuilders.get(MockMvcResultMatchers.status().isOk())
                // REST Docs 작성 시작
                .andDo(
                        MockMvcRestDocumentation.document(
                                // member 라는 폴더이름으로 adoc 생성된다.
                                "member",
                                PayloadDocumentation.responseFields(
                                        PayloadDocumentation.fieldWithPath("id").description("ID"),
                                        PayloadDocumentation.fieldWithPath("name").description("name"),
                                        PayloadDocumentation.fieldWithPath("email").description("email")))));
    }
}

```

나는 Get으로 받는 파라미터도 없기 때문에 간단하다.

다른 경우는 공식문서나 검색을 통해 찾아보며 될것 같다.

**(3) src/docs/asciidoc/index.adoc**

```adoc
= Member REST Docs
:doctype: book
:icons: font
:source-highlighter: highlightjs
:toc: left
:sectlinks:

[[Member-API]]
== Member API

[[Member-조회]]
=== Member 조회
operation::member[snippets='http-request,http-response,response-fields']

```

위 경로에 index.adoc를 만들어주면 처음 build.gradle에서 주입했던 asciidocker가 이를 기반으로 snippet 조각들을 html로 만들어준다.

### **3. 프로젝트 빌드**

```bash
./gradlew clean build
```

-> 빌드 후 src/main/resources/static/docs에 들어가보면 index.html이 생겼다.

![image](https://github.com/TeTedo/blog-code/assets/107897812/8eb149b7-a4b0-4280-a484-4e0dfa3e89b3)

생긴 index.html을 공유하여도 되지만 나는 docs 라는 경로로 이동시 생성된 index.html을 보여주는 걸로 했다.

view/IndexController.java

```java
@Controller
public class IndexController {

    @GetMapping("/docs")
    public String viewDocs() {

        return "/docs/index.html";
    }
}
```

docs 경로에 대해 권한 설정을 해놓으면 문제될건 없어 보인다.

#### **참고**

[REST Docs 공식문서](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/)

[Spring REST Docs 적용 및 최적화 하기](https://velog.io/@backtony/Spring-REST-Docs-%EC%A0%81%EC%9A%A9-%EB%B0%8F-%EC%B5%9C%EC%A0%81%ED%99%94-%ED%95%98%EA%B8%B0)

[Spring REST Docs 적용](https://techblog.woowahan.com/2597/)
