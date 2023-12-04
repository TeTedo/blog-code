# APM으로 성능측정 - ubuntu 22.04


어플리케이션의 성능을 측정하기 위해 APM 을 설치하려고 한다.
기존에 ELK에서 로그나 메트릭을 모니터링하기 때문에 여기에 추가하기 위해서 ELK에서 제공하는 APM 을 사용할 것이다.

### APM 다운로드

```bash
curl -O https://artifacts.elastic.co/downloads/apm-server/apm-server-8.11.0-amd64.deb
sudo dpkg -i apm-server-8.11.0-amd64.deb
```

### APM 설정 변경

```bash
sudo rm -rf /etc/apm-server/apm-server.yml
sudo vi /etc/apm-server/apm-server.yml
```

```yml
apm-server:
  host: "0.0.0.0"
  
output.elasticsearch:
  hosts: ["http://localhost:9200"]
  username: "elastic"
  password: "비밀번호"
  index: "apm-%{[observer.version]}-%{[processor.event]}"
```

### APM 실행

```bash
sudo systemctl start apm-server.service
```

## nodejs

```
npm install elastic-apm-node --save
```


```js
var apm = require("elastic-apm-node").start({
	serviceName: "server-name",
	serverUrl: "apm server host",
});
```


## Spring boot

### (1) gradle

```
implementation 'co.elastic.apm:apm-agent-attach:1.44.0'
```


### (2) maven

```
<dependency>
    <groupId>co.elastic.apm</groupId>
    <artifactId>apm-agent-attach</artifactId>
    <version>1.44.0</version>
    <scope>provided</scope>
</dependency>

```

### (3) resources 경로에  elasticapm.properties 파일 생성

```
service_name=server-name
server_urls=apm-url
```

### (4) main 메소드에 apm attach 추가

```java
public static void main(String[] args) {

	ElasticApmAttacher.attach();

	SpringApplication.run(Application.class, args);
}
```

### (4-1) main 메소드 말고 Configuration 추가

```java
@Configuration
public class ApmConfig {

	@Bean
	public void apmInit() {
		ElasticApmAttacher.attach();
	}
}
```


위 코드들을 추가하여 kibana에서 Observability -> APM 에서 확인할 수 있다.

### 참고
[APM Guide](https://www.elastic.co/guide/en/apm/guide/current/apm-quick-start.html)