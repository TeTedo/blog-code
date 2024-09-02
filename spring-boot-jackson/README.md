# SpringBoot JsonSerialize 활용해서 요청 Body 커스텀하기

> 모든 코드는 [Github](https://github.com/TeTedo/blog-code/tree/main/react-redux-recoil)에 저장되어 있습니다.

## 목차

### 1. Spring boot에서 JSON 요청의 Body값을 처리하는 방법

#### (1) RequestBody - Map

```java
@PostMapping("/requestBodyRequest")
public void requestBodyRequest(@RequestBody Map<String, String> requestBodyRequest) {
    String input1 = requestBodyRequest.get("input1");
    String input2 = requestBodyRequest.get("input2");
}
```

#### (2) RequestBody - Dto

```java
@Getter
public class DtoRequest {
    private String input1;
    private String input2;
}
```

```java
@PostMapping("/dtoRequest")
public void dtoRequest(@RequestBody DtoRequest dtoRequest) {
    String input1 = dtoRequest.getInput1();
    String input2 = dtoRequest.getInput2();
}
```

나는 주로 2번의 방법으로 POST 요청의 Body 값을 처리한다.

### 2. 요청 커스텀하기

개발을 하다보면 요청 값들을 자동으로 커스텀을 할 필요가 있는 경우가 있다.

예를 들면 날짜의 경우 팀마다 정해진 규칙대로 커스텀하거나 DTO 자체를 커스텀하는 경우도 있다.

#### (1) 날짜 커스텀하기 - JsonFormat

```java
@Getter
public class JsonFormatRequest {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime input1;
    private String input2;
}
```

```java
@PostMapping("/jsonFormatRequest")
public void jsonFormatRequest(@RequestBody JsonFormatRequest jsonFormatRequest) {
    LocalDateTime input1 = jsonFormatRequest.getInput1();
    String input2 = jsonFormatRequest.getInput2();
}
```

`@JsonFormat` 어노테이션을 사용해서 요청값의 한 인자를 커스텀 할 수 있다.

#### (2) 날짜 커스텀하기 -

- 날짜 커스텀
- DTO 커스텀

### 출처

- [Spring Boot에서 특정 필드 직렬화 방식 변경하기 (JsonSerializer, JsonDeserializer)](https://siyoon210.tistory.com/185)

- [Controller에서 String -> 날짜 타입 자동으로 변환하기](https://woonys.tistory.com/242)
