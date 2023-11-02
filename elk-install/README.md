### 1-1. Java 설치

```
sudo apt-get update
sudo apt install openjdk-11-jdk
```

### 1-2. Nginx 설치
```
sudo apt install nginx
```

### 2. APT repository 추가
```
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
```

```
sudo apt-get install apt-transport-https
```

```
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
```
`apt-transport-https` : 패키지 관리자가 https를 통해 접근할수 있도록 한다.

### 3. ElasticSearch 설치
```
sudo apt-get update && sudo apt-get install elasticsearch
```

#### 4. 설정 추가

```
sudo vi /etc/elasticsearch/elasticsearch.yml
```

```
node.name: node-1

network.host: 0.0.0.0

http.port: 9200

discovery.seed_hosts: ["127.0.0.1"]

cluster.initial_master_nodes: ["node-1"]
```

### 5. ElasticSearch 실행

```
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable elasticsearch.service
sudo systemctl start elasticsearch.service
```

### 6. ElasticSearch 실행 확인

```
sudo systemctl status elasticsearch

curl -X GET "localhost:9200"

curl localhost:9200/_cat/indices?v

curl -X GET localhost:9200/_cat/health?v

curl -X GET localhost:9200/_cat/nodes?v
```


### 7. Kibana 설치

```
sudo apt-get update && sudo apt-get install kibana
```

#### 설정 변경

```
sudo vi /etc/kibana/kibana.yml
```

```
server.port: 5601
server.host: "0.0.0.0"
elasticsearch.hosts: ["http://localhost:9200"]
```
### 8. Kibana 실행

```
sudo /bin/systemctl daemon-reload

sudo /bin/systemctl enable kibana.service

sudo systemctl start kibana.service
```

### 9. Kibana 실행 확인

```
sudo systemctl status kibana
```

### 10. Nginx 설정

```
sudo vi /etc/nginx/sites-available/default
```

```nginx
server {
 listen 80;

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

```
sudo systemctl reload nginx
```

### 11. Kibana 접속해보기

설정한 ip 주소로 접속해보면 잘 접속이 된다.
![image](https://github.com/TeTedo/spring-security-practice/assets/107897812/7b6992b8-a5ba-4525-86fd-d727cd6b2d04)

### 12. Logstash 설치

```
sudo apt-get update && sudo apt-get install logstash
```

### 13. Logstash Input, Output 설정


```
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
 hosts => ["http://localhost:9200"]
 index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"
 #user => "elastic"
 #password => "changeme"
 }
}
```


### 14. Logstash test

```
sudo -u logstash /usr/share/logstash/bin/logstash --path.settings /etc/logstash -t
```

```
Using bundled JDK: /usr/share/logstash/jdk

Sending Logstash logs to /var/log/logstash which is now configured via log4j2.properties
[2023-11-02T04:37:05,680][INFO ][logstash.runner ] Log4j configuration path used is: /etc/logstash/log4j2.properties
[2023-11-02T04:37:05,693][INFO ][logstash.runner ] Starting Logstash {"logstash.version"=>"8.10.4", "jruby.version"=>"jruby 9.4.2.0 (3.1.0) 2023-03-08 90d2913fda OpenJDK 64-Bit Server VM 17.0.8+7 on 17.0.8+7 +indy +jit [x86_64-linux]"}
[2023-11-02T04:37:05,697][INFO ][logstash.runner ] JVM bootstrap flags: [-Xms1g, -Xmx1g, -Djava.awt.headless=true, -Dfile.encoding=UTF-8, -Djruby.compile.invokedynamic=true, -XX:+HeapDumpOnOutOfMemoryError, -Djava.security.egd=file:/dev/urandom, -Dlog4j2.isThreadContextMapInheritable=true, -Djruby.regexp.interruptible=true, -Djdk.io.File.enableADS=true, --add-exports=jdk.compiler/com.sun.tools.javac.api=ALL-UNNAMED, --add-exports=jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED, --add-exports=jdk.compiler/com.sun.tools.javac.parser=ALL-UNNAMED, --add-exports=jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED, --add-exports=jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED, --add-opens=java.base/java.security=ALL-UNNAMED, --add-opens=java.base/java.io=ALL-UNNAMED, --add-opens=java.base/java.nio.channels=ALL-UNNAMED, --add-opens=java.base/sun.nio.ch=ALL-UNNAMED, --add-opens=java.management/sun.management=ALL-UNNAMED]
[2023-11-02T04:37:05,715][INFO ][logstash.settings ] Creating directory {:setting=>"path.queue", :path=>"/var/lib/logstash/queue"}
[2023-11-02T04:37:05,716][INFO ][logstash.settings ] Creating directory {:setting=>"path.dead_letter_queue", :path=>"/var/lib/logstash/dead_letter_queue"}
[2023-11-02T04:37:06,370][INFO ][org.reflections.Reflections] Reflections took 193 ms to scan 1 urls, producing 132 keys and 464 values
[2023-11-02T04:37:06,713][INFO ][logstash.javapipeline ] Pipeline `main` is configured with `pipeline.ecs_compatibility: v8` setting. All plugins in this pipeline will default to `ecs_compatibility => v8` unless explicitly configured otherwise.
Configuration OK
[2023-11-02T04:37:06,714][INFO ][logstash.runner ] Using config.test_and_exit mode. Config Validation Result: OK. Exiting Logstash
```


### 15. Logstash 실행

```
sudo /bin/systemctl daemon-reload

sudo /bin/systemctl enable logstash.service

sudo systemctl start logstash.service
```

### 16. firebeats 설치

```
sudo apt install filebeat
```

### 17. firebeats 설정

```
sudo vi /etc/filebeat/filebeat.yml
```

```
#output.elasticsearch:
 # Array of hosts to connect to.
 #hosts: ["localhost:9200"]

-----------------------------------

output.logstash:
 # The Logstash hosts
 hosts: ["localhost:5044"]
```

output.elasticsearch 주석처리, logstash 주석 해제

### 18. nginx 로그 수집

```
sudo filebeat modules enable nginx
sudo filebeat setup --pipelines --modules nginx
sudo filebeat setup --index-management -E output.logstash.enabled=false -E 'output.elasticsearch.hosts=["localhost:9200"]'
```

### 19. firebeats 시작

```
sudo systemctl start filebeat
sudo systemctl enable filebeat
```

### 20. Kibana Security 설정

#### 서비스 중지

```
sudo systemctl stop elasticsearch.service

sudo systemctl stop kibana.service

sudo systemctl stop logstash.service
```
#### elastic 설정

```
sudo vi /etc/elasticsearch/elasticsearch.yml
```

```
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
```


```
sudo systemctl start elasticsearch.service
```

#### 암호 설정

```
sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords interactive
```

#### 키바나 아이디, 비번 설정

```
sudo vi /etc/kibana/kibana.yml
```

```
elasticsearch.username: "elastic"
elasticsearch.password: "비밀번호 입력"
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

#### 다시 사이트 들어가보면 로그인창이 생긴다.

![image](https://github.com/TeTedo/spring-security-practice/assets/107897812/6e823732-74da-4fef-919f-0090a7d2d916)

### 참고
- [Elasticsearch, Logstash, Kibana 를 우분투 22.04 에 설치하는 방법](https://hwanstory.kr/@kim-hwan/posts/ELK-Stack-Install)
- [AWS에 ELK 스택 구축(7.x)](https://velog.io/@_zero_/AWS%EC%97%90-ELK-7.x-%EC%8A%A4%ED%83%9D-%EA%B5%AC%EC%B6%95)
