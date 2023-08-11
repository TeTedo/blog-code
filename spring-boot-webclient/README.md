# Spring Boot WebClient

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

## WebClient 사용하기

## WebClient Interceptor

### 참고

[Spring WebClient 쉽게 이해하기](https://happycloud-lee.tistory.com/220)

[Spring doc RestTemplate](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html)

[WebClient 사용방법 가이드](https://thalals.tistory.com/379)
