
### 환경
Elastic Search 와 Kibana는 같은 instance, Logstash, filebeat 총 3개의 인스턴스로 테스트를 진행했다.


### 1-1. Java 설치
  

```sh

sudo apt-get update

sudo apt install openjdk-17-jdk

```

  

### 1-2. Nginx 설치

```sh

sudo apt install nginx

```

  

### 2. APT repository 추가

```sh

wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg

```

  

```sh

sudo apt-get install apt-transport-https

```

  

```sh

echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

```

`apt-transport-https` : 패키지 관리자가 https를 통해 접근할수 있도록 한다.

  

### 3. ElasticSearch 설치

```sh

sudo apt-get update && sudo apt-get install elasticsearch

```

#### 4. 설정 수정 (8.x 는 security 쪽 설정이 true로 되어있음)

```sh

sudo vi /etc/elasticsearch/elasticsearch.yml

```

### 5. ElasticSearch 실행

```sh

sudo /bin/systemctl daemon-reload

sudo /bin/systemctl enable elasticsearch.service

sudo systemctl start elasticsearch.service

```

#### 암호 설정


```sh
sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords interactive
```

만약 비밀번호가 이미 설정되어 있다고 하면 초기화 시키고 다시 설정할 수 있다.

```sh
sudo /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic -i
```


### 6. ElasticSearch 실행 확인

```sh

sudo systemctl status elasticsearch

  
curl -u elastic:[설정한 암호] -k "https://localhost:9200"

```


### 7. Kibana 설치

  

```sh

sudo apt-get update && sudo apt-get install kibana

```

  

#### 설정 변경


#### 내부 SSL 설정 (본인은 AWS ELB에서 SSL설정)

```sh
sudo cp /etc/elasticsearch/certs/http_ca.crt /etc/kibana/
```  

kibana에서 ca를 설정할때 경로를 /etc/elasticsearch/certs/ 로 해버리면 권한 문제가 있어서 kibana쪽으로 파일을 복사해줬다.

```sh

sudo vi /etc/kibana/kibana.yml

```



```sh

elasticsearch.hosts: ["https://localhost:9200"]

elasticsearch.ssl.certificateAuthorities: [ "/etc/kibana/http_ca.crt" ]

```

위 설정을 추가하면 내부 SSL 통신을 할 수 있다.

나는 로드밸런서에서 SSL 을 종료하기 때문에 내부에서는 http 통신으로 한다.
따라서 위 설정이 필요없고 hosts 를 http 로 설정해줬다.

### 8. Kibana 실행

```sh

sudo /bin/systemctl daemon-reload

  

sudo /bin/systemctl enable kibana.service

  

sudo systemctl start kibana.service

```

### 9. Kibana 실행 확인

```sh

sudo systemctl status kibana

```

### 10. Nginx 설정

```sh

sudo vi /etc/nginx/sites-available/default

```

  

```nginx

server {
        listen 80;
        
        client_max_body_size 50M;
        
        server_name _;
        
        location / {
                proxy_pass http://localhost:5601;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}

```

  

```sh

sudo systemctl start nginx

```


접속해보면 ID, PW 로그인창이 떠있는걸 확인할 수 있다.


![image](https://github.com/TeTedo/spring-security-practice/assets/107897812/6e823732-74da-4fef-919f-0090a7d2d916)


### 11. Logstash 설치

  

```sh

wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
sudo apt-get install apt-transport-https
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list
```

```sh

sudo apt-get update && sudo apt-get install logstash

```

나는 logstash를 다른 서버에서 새로 설치했다.

### 12. Logstash Input, Output 설정

```sh

sudo vi /etc/logstash/conf.d/logstash.conf

```

  

```c

input {

  beats {

    port => 5044

    host => "0.0.0.0"

  }

}

  

filter {

}

  

output {

  elasticsearch {

    hosts => ["[es-ip]:9200"]

    index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"

    user => "elastic"

    password => "비밀번호"

  }

}

```

### 13. Logstash test

  
```sh

sudo -u logstash /usr/share/logstash/bin/logstash --path.settings /etc/logstash -t

```

  

```
Using bundled JDK: /usr/share/logstash/jdk
Sending Logstash logs to /var/log/logstash which is now configured via log4j2.properties
[2023-11-10T03:06:15,008][INFO ][logstash.runner          ] Log4j configuration path used is: /etc/logstash/log4j2.properties
[2023-11-10T03:06:15,014][INFO ][logstash.runner          ] Starting Logstash {"logstash.version"=>"8.11.0", "jruby.version"=>"jruby 9.4.2.0 (3.1.0) 2023-03-08 90d2913fda OpenJDK 64-Bit Server VM 17.0.9+9 on 17.0.9+9 +indy +jit [x86_64-linux]"}
[2023-11-10T03:06:15,017][INFO ][logstash.runner          ] JVM bootstrap flags: [-Xms1g, -Xmx1g, -Djava.awt.headless=true, -Dfile.encoding=UTF-8, -Djruby.compile.invokedynamic=true, -XX:+HeapDumpOnOutOfMemoryError, -Djava.security.egd=file:/dev/urandom, -Dlog4j2.isThreadContextMapInheritable=true, -Djruby.regexp.interruptible=true, -Djdk.io.File.enableADS=true, --add-exports=jdk.compiler/com.sun.tools.javac.api=ALL-UNNAMED, --add-exports=jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED, --add-exports=jdk.compiler/com.sun.tools.javac.parser=ALL-UNNAMED, --add-exports=jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED, --add-exports=jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED, --add-opens=java.base/java.security=ALL-UNNAMED, --add-opens=java.base/java.io=ALL-UNNAMED, --add-opens=java.base/java.nio.channels=ALL-UNNAMED, --add-opens=java.base/sun.nio.ch=ALL-UNNAMED, --add-opens=java.management/sun.management=ALL-UNNAMED]
[2023-11-10T03:06:15,732][INFO ][org.reflections.Reflections] Reflections took 136 ms to scan 1 urls, producing 132 keys and 464 values
[2023-11-10T03:06:16,134][INFO ][logstash.javapipeline    ] Pipeline `main` is configured with `pipeline.ecs_compatibility: v8` setting. All plugins in this pipeline will default to `ecs_compatibility => v8` unless explicitly configured otherwise.
Configuration OK
[2023-11-10T03:06:16,134][INFO ][logstash.runner          ] Using config.test_and_exit mode. Config Validation Result: OK. Exiting Logstash

```

### 14. Logstash 실행

```sh

sudo /bin/systemctl daemon-reload

  

sudo /bin/systemctl enable logstash.service

  

sudo systemctl start logstash.service

```


### 15. Kibana Security 설정

#### [security 연결 - 공식문서 참고](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/configuring-stack-security.html?blade=kibanasecuritymessage)

#### 서비스 중지

  

```sh

sudo systemctl stop elasticsearch.service

sudo systemctl stop kibana.service

  

sudo systemctl stop logstash.service

```

#### elastic 설정

  

```sh

sudo vi /etc/elasticsearch/elasticsearch.yml

```

  ElasticSearch 7.x 버전까지는 아래 설정만 넣고 Kibana에 설정을 추가해주면 가능했다.

```yml

xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true

```


하지만 8.x 버전부터는 ssl의 keystore를 필수적으로 입력해야 하는데 elasticsearch를 설치할때 자동으로 설치해준다. 
#### Elastic Search 8.x 버전 security 설정
[Security 설정 공식문서](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/configuring-stack-security.html?blade=kibanasecuritymessage)


```sh
#----------------------- BEGIN SECURITY AUTO CONFIGURATION -----------------------
#
# The following settings, TLS certificates, and keys have been automatically      
# generated to configure Elasticsearch security features on 09-11-2023 07:40:42
#
# --------------------------------------------------------------------------------
# Enable security features
xpack.security.enabled: true

xpack.security.enrollment.enabled: true

# Enable encryption for HTTP API client connections, such as Kibana, Logstash, and Agents
xpack.security.http.ssl:
  enabled: false
  keystore.path: certs/http.p12

# Enable encryption and mutual authentication between cluster nodes
xpack.security.transport.ssl:
  enabled: true
  verification_mode: certificate
  keystore.path: certs/transport.p12
  truststore.path: certs/transport.p12
# Create a new cluster with the current node only
# Additional nodes can still join the cluster later
cluster.initial_master_nodes: ["node-1"]

# Allow HTTP API connections from anywhere
# Connections are encrypted and require user authentication
http.host: 0.0.0.0

# Allow other nodes to join the cluster from anywhere
# Connections are encrypted and mutually authenticated
#transport.host: 0.0.0.0

#----------------------- END SECURITY AUTO CONFIGURATION -------------------------

```

나의 경우 로드밸런서로 http ssl 을 설정해줬기 때문에 내부에서는 ssl 을 사용하지 않는다.

```

sudo systemctl start elasticsearch.service

```

#### 키바나 시작

```

sudo systemctl start kibana.service

```
  
#### logstash 설정 추가

```

sudo vi /etc/logstash/conf.d/logstash.conf

```

#### 주석 처리한곳 설정


```

output {

	elasticsearch {
	
	hosts => ["http://localhost:9200"]
	
	index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"
	
	user => "elastic"
	
	password => "설정한 비밀번호"
	
	}

}

```


### 19. filebeat 설치

  

```
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.10.4-amd64.deb
sudo dpkg -i filebeat-8.10.4-amd64.deb

```

### 20. filebeat 설정 변경

```

sudo vi /etc/filebeat/filebeat.yml

```

```
type: log
  id: test_log
  enabled: true
  paths:
    - /var/log/*.log

filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: true

#setup.dashboards.enabled: true

#setup.kibana:
  #host: "[kibana_ip]:5601"

output.logstash:
  # The Logstash hosts
  hosts: ["logstash-ip:5044"]
  ssl.enabled: true


filebeat.modules:
- module: system
  syslog:
    enabled: true
  auth:
    enabled: true
```

참고로 filebeat와 logstash는 tcp통신을 한다.
이부분에서 나도 애를 많이 먹었다.
당연히 http 통신을 할 줄 알았지만 tcp로 통신한단다.
#### 21. filebeat 모듈 설정

```
sudo filebeat modules list
filebeat modules enable [모듈]
```
  

#### 22. filebeat 시작

```
sudo /bin/systemctl daemon-reload

sudo /bin/systemctl enable filebeat.service

sudo systemctl start filebeat.service
```


#### 23. 겪은 이슈

#### (1) 버전호환

ssl 적용 후 filebeat 설정에서 logstash의 host에도 https를 붙였지만 logstash의 호스트는 https 프로토콜을 붙이지 말아야 한다고 에러가 떴다.

이유는 logstash는 tcp프로토콜로 통신을 하기 때문이다.

나는 aws 로드밸런서를 사용하고 있기 때문에 http/https를 위한 ALB를 구성중이었다.
조금 복잡해질것 같아서 그냥 새로운 인스턴스를 생성하고 NAB를 새로 만들었다.

그래도 logstash의 로그에서 오류가 떠서 살펴봤더니 `Invalid version of beats protocol: 69` 오류 였다.
해당 오류는 beats의 버전이 맞지 않아 값을 읽을수 없다는 오류라고 한다.
그래서 각 elk stack의 버전들을 확인해보니 filebeat만 혼자 7.17.8 버전이었고 나머지는 7.17.14버전이었다. 버전을 똑같이 7.17.14로 맞췄지만 그래도 protocol 관련한 오류가 떴다. 
[호환성 공식문서](https://www.elastic.co/support/matrix)를 찾아보니 ubuntu 22.04는 8.3.x 이상 버전과 호환이 된다고 해서 원래 7.17 버전으로 세팅했었지만 현재 버전인 8.10 버전으로 다시 설치했다. 
elasticsearch의 8.x 버전은 jdk 11 과 호환이 안되고 17과 호환이 된다고 해서 java도 다시 깔았다.

#### (2) ElasticSearch, Kibana 연결

7.x 버전을 하다가 8.x 버전을 세팅하니까 달라진게 많았다.
가장 대표적으로 security 설정이었는데, 7.x 버전은 증명서를 넣지 않아도 됬지만 8.x버전은 꼭 명시해줘야 했다.

이부분 때문에 설정을 하다가 가장 많은 시간을 날렸다.
공식문서를 봐도 elasticsearch, kibana 각각의 설정은 설명하지만 연결지어서 설명은 안해서 이해하기가 힘들었다.

짜증나서 다 밀어버리고 새로 8.x버전을 깔았는데 default 설정과 주석을 보면서 gpt와 함께 하다보니 해결됬다. (http ssl 은 false)

많은 블로그글도 참고했지만 8.x버전에서 명확하게 정리한건 잘 못봤다.


#### (3) SSL 적용

기존 ssl 적용을 하지 않고 http 통신을 했을때는 잘 되어서 ssl 까지 적용하려고 했다.
내 서버는 aws ec2 ubuntu 22.04 이며 ssl 은 aws의 certificate manager를 이용한다.
구글링을 하며 ssl 적용을 찾아봤을때는 다른 인증 기관에서 발급받은 crt, key를 사용했지만 aws는 crt, key를 따로 발급해주지 않기 때문에 난감했다.

찾아본 결과 aws는 로드밸런서에서 ssl 을 해결하고 있었으며 로드밸런서에 ssl 을 적용해주면 내가 따로 신경쓸건 없었다.

filebeat에서 elk를 연결하는 주소만 https로 바꿔주어 연결해주면 될것이라고 생각했지만 또 이슈가 발생했다.

http 통신때는 잘 되었지만 https로 바꾸고 나서 nginx에 전송하는 데이터가 너무 크다고 떴다. 
그래서 nginx 설정을 바꿔주어 client data의 용량을 늘려서 해결했다.

맨 처음 전송한 beat의 크기가 1MB가 넘어가서 오류가 뜬걸로 예상된다.

다 설정한 후에도 적용이 되지 않았다.

나는 aws ELB에서 ssl 설정을 해주고 있었고 내부에서도 ssl 설정을 하려고 하니까 중복적인 문제가 생긴것이다.

SSL Termination과 SSL Passthrough를 중복으로 사용해서 문제라고 추측한다.

SSL Termination은 로드밸런서에서 SSL연결이 종료되고 이후 내부 네트워크에서는 일반 HTTP를 사용하는 구성이다.

SSL Passthrough는 로드밸런서가 SSL 연결을 백엔드 서버까지 그대로 전달하기 때문에 백엔드 서버에서 SSL 인증서를 가지고 있어야 한다.



### 24. 느낀점

그냥 설치하고 실행시키면 끝날줄 알았는데 생각보다 많은 삽질을 했다.
특히 ssl 관련 삽질을 굉장히 많이 했다.

처음에는 다른 블로그들을 보면서 우다다 세팅하고 어디서 오류난지도 모르고 해맸다.
세팅을 하면서 telnet, curl 등 health check의 중요성을 깨달았다.
한단계씩 잘 세팅이 되었는지 확인하면서 다음에 오류가 나면 그 부분만 집중적으로 볼수 있기 때문이다.

세팅하면서 네트워크 부분의 지식도 조금은 늘어난것 같다.
다음엔 metricbeat를 설치해서 metric에 대한 정보를 시각화하는걸 목표로 한다.




### 참고

- [Elasticsearch, Logstash, Kibana 를 우분투 22.04 에 설치하는 방법](https://hwanstory.kr/@kim-hwan/posts/ELK-Stack-Install)
- [AWS에 ELK 스택 구축(7.x)](https://velog.io/@_zero_/AWS%EC%97%90-ELK-7.x-%EC%8A%A4%ED%83%9D-%EA%B5%AC%EC%B6%95)
- [Support Matrix](https://www.elastic.co/support/matrix)
