# Spring Boot WebClient

모든 소스는 [github]()에 있습니다.

## WebClient vs RestTemplate

스프링에서 http 요청을 위해 `WebClient` 와 `RestTemplate`이 있다.

인터넷에 `RestTemplate`이 `Deprecated` 된다는 말이 있지만 이는 사실이 아니다.

> It would be more helpful, and also accurate, to explain that the RestTemplate is in maintenance mode rather than mention a potential deprecation in the future.

[Deprecated 관련 이슈](https://github.com/spring-projects/spring-framework/issues/24503)

[java doc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html)
을 확인해보면 유지모드로 들어간다고 한다.

### RestTemplate

#### **동작 원리**

RestTemplate은 `Multi-Thread`와 `Blocking` 방식을 사용한다.

![download (1)](https://github.com/TeTedo/blog-code/assets/107897812/a4068333-bf50-4a85-a1e6-dea1cb737c3e)

출처 https://happycloud-lee.tistory.com/220

`Thread pool`은 어플리케이션 구동시에 미리 설정한다.

```java
@Configuration
public class RestTemplateConfig {

	public RestTemplate getRestTemplate(int defaultMaxPerRoute, int maxTotal) {
		PoolingHttpClientConnectionManager connManager = new PoolingHttpClientConnectionManager();

		connManager.setDefaultMaxPerRoute(defaultMaxPerRoute);
		connManager.setMaxTotal(maxTotal);

		HttpClient client = HttpClientBuilder.create().setConnectionManager(connManager).build();

		HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(client);

		factory.setConnectTimeout(3000);
		factory.setReadTimeout(3000);

		return new RestTemplate(factory);
	}

    @Bean
	public RestTemplate restTemplate() {
		return getRestTemplate(20, 50);
	}
}
```

요청이 오면 큐에 쌓이고 가용한 스레드가 있으면 그 스레드에 할당되어 처리된다.

`요청 1개당 1개의 스레드`가 할당되는것이다.

각 스레드는 Blocking 방식으로 처리되어 다른 요청에 할당되지 못하고 응답이 올때까지 대기하여야 한다.

요청이 왔는데 가용할 스레드가 없다면 요청은 계속 큐에 대기하게 된다.

그렇기 때문에 여러 스레드에서 문제가 발생하면 가용할 스레드가 줄어들어 전체적으로 매우 느려질수 있다.

추가로 멀티스레드를 사용하면서 잦은 컨텍스트 스위칭 때문에 성능에 좋지 않은 영향을 미칠 수 있다.

### WebClient

#### **동작 원리**

WebClient는 `Single Thread`와 `Non-Blocking` 방식을 사용한다.

![download](https://github.com/TeTedo/blog-code/assets/107897812/fc4da806-cdcd-4386-af29-4c4620ef406c)

출처 : https://luminousmen.com/post/asynchronous-programming-blocking-and-non-blocking

각 요청은 Event Loop에서 Job으로 된다.

Event Loop는 Job을 제공자에게 요청한 후 `결과를 기다리지 않고 다른 Job을 처리`한다.

제공자로부터 응답을 받으면 Event Loop는 요청자에게 전달한다.

RestTemplate은 제공자에게 요청 후 응답이 올때 까지 기다렸지만 WebClient는 Non-Blocking 방식으로 결과를 기다리지 않았다.

즉 기다린 시간만큼 다른 일을 하며 낭비되는 메모리를 줄이는 것이다.

### 성능 비교

![download (2)](https://github.com/TeTedo/blog-code/assets/107897812/dcc4af3d-ba63-4f87-8723-234c16045b4b)

출처 : https://dzone.com/articles/raw-performance-numbers-spring-boot-2-webflux-vs-s

유저가 1000명까지는 비슷하지만 그 이후에 차이가 많이 벌어진다.

소수의 유저가 사용한다면 상관없지만 동시에 많은 유저가 사용한다면 `WebClient`를 고려해볼만 하다.

### 동기, 비동기, Blocking, Non-Blocking

![download (3)](https://github.com/TeTedo/blog-code/assets/107897812/bf7ef974-4ec0-4e07-8804-fa1f31b070b5)

출처 : https://gngsn.tistory.com/154

`Blocking`은 요청에 대한 응답을 할때까지 기다린다.

`NonBlocking`은 요청을 하고 바로 제어권을 받는다.

`동기`는 결과를 직접 받아 처리한다.

`비동기`는 결과를 직접 받지는 않고 콜백함수를 통해 받는다.

## WebClient 사용하기

### 의존성 추가

```java
implementation 'org.springframework.boot:spring-boot-starter-webflux'
```

### webClient Bean 생성

```java
@Configuration
public class WebclientConfig {
    static private final String BASE_URL = "http://localhost:8080";

    @Bean
    public WebClient webClient() {

        DefaultUriBuilderFactory factory = new DefaultUriBuilderFactory(BASE_URL);
        factory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.VALUES_ONLY);

        return WebClient.builder()
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultCookie("cookieName", "cookieValue")
                .filter(ExchangeFilterFunction.ofRequestProcessor(
                        clientRequest -> {
                            System.out.println("Request: " + clientRequest);
                            return Mono.just(clientRequest);
                        }))
                .filter(ExchangeFilterFunction.ofResponseProcessor(
                        clientResponse -> {
                            System.out.println("Response: " + clientResponse);
                            return Mono.just(clientResponse);
                        }))
                .uriBuilderFactory(factory)
                .build();
    }
}
```

`EncodingMode.VALUES_ONLY` : Uri 변수값만 인코딩한다.

`EncodingMode.URI_COMPONENT` : 각 URI 구성 요소에 따라 인코딩된다. 경로변수는 세그먼트에 대한 규칙, 쿼리 매개변수는 쿼리 문자열에 대한 규칙으로 인코딩된다.

`EncodingMode.NONE` : 인코딩 하지 않는다.

`filter` : Request 요청을 하기 전, Response 응답을 받기 전에 Intercept 하는 filter를 구현 할 수 있다.

### test controller 생성

`retrieve` : ClientResponse의 body값을 받는다. toEntity, bodyToMono, bodyToFlux를 사용할 수 있다.

`exchange` : 아래 2개의 exchange는 ClientResponse를 상태값, 헤더와 함께 가져온다. 세밀한 조정이 가능하지만 모든 처리를 직접 하게되면 메모리 누수가 발생할 가능성이 있기 때문에 retrieve를 권장한다고 한다. exchange는 deprecated 되어 exchangeToFlux, exchangeToMono를 사용해야 한다.

`Mono` 객체는 0~1개의 결과를 처리하고 `Flux`는 0~N개의 결과를 처리하는 객체이다.

```java
@GetMapping("test")
public void getDataFrom8080() {
	Map<String, String> request = new HashMap<>();

	request.put("test", "testData");

	Mono<String> data = webClient.post()
			.uri("test")
			.bodyValue(request)
			.retrieve()
			.bodyToMono(String.class);

	// blocking
	String response1 = data.block();

	// non-blocking
	data.subscribe(string -> System.out.println(string));
}
```

먼저 retrieve를 사용한 예제이다.

`blocking`으로 처리할때에는 `block()`을 사용

`non-blocking`으로 처리할때에는 안에 콜백함수를 넣어주면 된다.

다음은 exchange를 이용한 예제이다.

```java
@GetMapping("test2")
public void errorRetrieve() throws Exception {
	Map<String, String> request = new HashMap<>();

	request.put("test", "testData");

	Mono<String> data = webClient.post()
			.uri("test")
			.bodyValue(request)
			.exchangeToMono(response -> {
				if (response.statusCode().equals(HttpStatus.OK)) {
					return response.bodyToMono(String.class);
				} else {
					return response.createException().flatMap(Mono::error);
				}
			});
}
```

### 참고

[Spring WebClient 쉽게 이해하기](https://happycloud-lee.tistory.com/220)

[Spring doc RestTemplate](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html)

[WebClient 사용방법 가이드](https://thalals.tistory.com/379)

[Spring WebFlux는 어떻게 적은 리소스로 많은 트래픽을 감당할까?](https://alwayspr.tistory.com/44)

[Spring WebClient, 어렵지 않게 사용하기](https://gngsn.tistory.com/154)
