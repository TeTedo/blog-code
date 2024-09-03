# SpringBoot JsonSerialize 활용해서 요청 Body 커스텀하기

> 모든 코드는 [Github](https://github.com/TeTedo/blog-code/tree/main/spring-boot-jackson)에 저장되어 있습니다.

## 목차

### 1. Spring boot에서 JSON 요청의 Body값을 처리하는 방법

#### (1) RequestBody - Map

```java
@PostMapping("/mapRequest")
public Map<String, String> mapRequest(@RequestBody Map<String, String> mapRequest) {
    String input1 = mapRequest.get("input1");
    String input2 = mapRequest.get("input2");

    return mapRequest;
}
```

#### Test Code

```java
@Test
void testMapRequest() throws Exception {
    String requestBody = "{\"input1\":\"value1\",\"input2\":\"value2\"}";

    mockMvc.perform(MockMvcRequestBuilders.post("/mapRequest")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(content().string(containsString("value1")))
            .andExpect(content().string(containsString("value2")));
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
public DtoRequest dtoRequest(@RequestBody DtoRequest dtoRequest) {
    String input1 = dtoRequest.getInput1();
    String input2 = dtoRequest.getInput2();

    return dtoRequest;
}
```

#### Test Code

```java
@Test
void testDtoRequest() throws Exception {
    String requestBody = "{\"input1\":\"value1\",\"input2\":\"value2\"}";

    mockMvc.perform(MockMvcRequestBuilders.post("/dtoRequest")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(content().string(containsString("value1")))
            .andExpect(content().string(containsString("value2")));
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
public JsonFormatRequest jsonFormatRequest(@RequestBody JsonFormatRequest jsonFormatRequest) {
    LocalDateTime input1 = jsonFormatRequest.getInput1();
    String input2 = jsonFormatRequest.getInput2();

    return jsonFormatRequest;
}
```

#### Test Code

```java
@Test
void testJsonFormatRequest() throws Exception {
    String input1 = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    String requestBody = String.format("{\"input1\":\"%s\",\"input2\":\"value2\"}", input1);

    mockMvc.perform(MockMvcRequestBuilders.post("/jsonFormatRequest")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(content().string(containsString("value2")))
            .andExpect(content().string(containsString(input1)));
}
```

`@JsonFormat` 어노테이션을 사용해서 요청값의 한 인자를 커스텀 할 수 있다.

> 참고로 @DateTimeFormat 도 사용할 수 있지만 POST 요청의 RequestBody 값은 JsonFormat만 적용된다.

#### (2) 날짜 커스텀하기 - JsonDeserializer

```java
public class LocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
        String date = p.getText();
        return LocalDateTime.parse(date, DATE_FORMAT);
    }
}
```

```java
@Getter
public class DeserializeDtoRequest {
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime input1;
    private String input2;
}
```

```java
@PostMapping("/deserializeDtoRequest")
public DeserializeDtoRequest deserializeDtoRequest(@RequestBody DeserializeDtoRequest deserializeDtoRequest) {
    LocalDateTime input1 = deserializeDtoRequest.getInput1();
    String input2 = deserializeDtoRequest.getInput2();

    return deserializeDtoRequest;
}
```

#### Test Code

```java
@Test
void testDeserializeDtoRequest() throws Exception {
    String input1 = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    String requestBody = String.format("{\"input1\":\"%s\",\"input2\":\"value2\"}", input1);

    mockMvc.perform(MockMvcRequestBuilders.post("/jsonFormatRequest")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(content().string(containsString("value2")))
            .andExpect(content().string(containsString(input1)));
}
```

이렇게 그냥 input1을 return 하게 되면 오류가 난다.

![Screenshot from 2024-09-03 18-04-35](https://github.com/user-attachments/assets/8911e57f-4e03-4d82-a4ab-c97e59fc015a)

왜냐하면 return 할때 LocalDateTime 으로 그냥 return 하게 되면 **2024-09-03T18:03:43** 이런식으로 T가 붙어서 온다.

이를 해결하려면 반대로 Serializer도 구현해주고 DTO 에 어노테이션을 추가하면 된다.

```java
public class LocalDateTimeSerializer extends JsonSerializer<LocalDateTime> {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


    @Override
    public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(DATE_FORMAT.format(value));
    }
}
```

```java
@Getter
public class DeserializeDtoRequest {
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime input1;
    private String input2;
}
```

#### Test Code 재시도 성공

#### (3) Dto 커스텀하기 - JsonDeserializer

Dto 전체를 JsonDeserializer로 커스텀하려면 클래스레벨에 JsonDeserialize 어노테이션을 붙여주면 된다.

```java
@Getter
@JsonDeserialize(using = DtoDeserializer.class)
public class CustomDto {
    private final String input1;
    private final String input2;

    public CustomDto(JsonNode node) {
        input1 = node.get("input1").asText();
        input2 = node.get("input2").asText();
    }
}
```

```java
public class DtoDeserializer extends JsonDeserializer<CustomDto> {

    @Override
    public CustomDto deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
        ObjectMapper mapper = (ObjectMapper) p.getCodec();
        JsonNode node = mapper.readTree(p);

        return new CustomDto(node);
    }
}
```

```java
@PostMapping("/deserializeCustomDtoRequest")
public CustomDto deserializeCustomDtoRequest(@RequestBody CustomDto customDto) {
    String input1 = customDto.getInput1();
    String input2 = customDto.getInput2();

    return customDto;
}
```

#### Test Code

```java
@Test
void testDeserializeCustomDtoRequest() throws Exception {
    String requestBody = "{\"input1\":\"value1\",\"input2\":\"value2\"}";

    mockMvc.perform(MockMvcRequestBuilders.post("/deserializeCustomDtoRequest")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(content().string(containsString("value1")))
            .andExpect(content().string(containsString("value2")));
}
```

### 후기

나의 경우에는 개발을 하다가 요청값들이 같은 형식을 띄는 경우가 있었다.

해당 요청건들은 같은 방식으로 값을 가공해야 했기 때문에 방법을 찾아보다가 JsonDeserializer 라는 객체를 알게 되었고 활용했다.

나는 커스텀 Dto를 만드는 방법을 사용했지만 까다로운 날짜 포맷도 팀마다 정의를 하여 정해두면 편할것 같다는 생각이다.

### 출처

- [Spring Boot에서 특정 필드 직렬화 방식 변경하기 (JsonSerializer, JsonDeserializer)](https://siyoon210.tistory.com/185)

- [Controller에서 String -> 날짜 타입 자동으로 변환하기](https://woonys.tistory.com/242)
