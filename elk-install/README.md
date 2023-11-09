
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

#### 4. 설정 수정

```sh

sudo vi /etc/elasticsearch/elasticsearch.yml

```

  

```sh
# ------------------------------------ Node ------------------------------------
#
# Use a descriptive name for the node:
#
node.name: node-1
#
# Add custom attributes to the node:
#
#node.attr.rack: r1

# ---------------------------------- Network -----------------------------------
#
# By default Elasticsearch is only accessible on localhost. Set a different
# address here to expose this node on the network:
#
network.host: 0.0.0.0
#
# By default Elasticsearch listens for HTTP traffic on the first free port it
# finds starting at 9200. Set a specific HTTP port here:
#
http.port: 9200
#
# For more information, consult the network module documentation.
#
#----------------------- BEGIN SECURITY AUTO CONFIGURATION -----------------------
#
# The following settings, TLS certificates, and keys have been automatically      
# generated to configure Elasticsearch security features on 07-11-2023 06:19:34
#
# --------------------------------------------------------------------------------

# Enable security features
xpack.security.enabled: false

xpack.security.enrollment.enabled: false

# Enable encryption for HTTP API client connections, such as Kibana, Logstash, and Agents
xpack.security.http.ssl:
  enabled: false
  keystore.path: certs/http.p12

# Enable encryption and mutual authentication between cluster nodes
xpack.security.transport.ssl:
  enabled: false
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

Security는 아래에서 적용하겠다.

### 5. ElasticSearch 실행

```sh

sudo /bin/systemctl daemon-reload

sudo /bin/systemctl enable elasticsearch.service

sudo systemctl start elasticsearch.service

```

### 6. ElasticSearch 실행 확인

```sh

sudo systemctl status elasticsearch

  

curl -X GET "localhost:9200"

  

curl localhost:9200/_cat/indices?v

  

curl -X GET localhost:9200/_cat/health?v

  

curl -X GET localhost:9200/_cat/nodes?v

```

  
  

### 7. Kibana 설치

  

```sh

sudo apt-get update && sudo apt-get install kibana

```

  

#### 설정 변경

  

```sh

sudo vi /etc/kibana/kibana.yml

```

  

```sh

server.port: 5601

server.host: "0.0.0.0"

elasticsearch.hosts: ["http://localhost:9200"]

```

여기도 마찬가지로 나머지는 건드리지 않았다.

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

sudo systemctl reload nginx

```

  

### 11. Kibana 접속해보기

  

설정한 ip 주소로 접속해보면 잘 접속이 된다.

![image](https://github.com/TeTedo/spring-security-practice/assets/107897812/7b6992b8-a5ba-4525-86fd-d727cd6b2d04)

  

### 12. Logstash 설치

  

```sh

sudo apt-get update && sudo apt-get install logstash

```

  

### 13. Logstash Input, Output 설정

  
  

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

    #user => "elastic"

    #password => "changeme"

  }

}

```

### 14. Logstash test

  
```sh

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

```sh

sudo /bin/systemctl daemon-reload

  

sudo /bin/systemctl enable logstash.service

  

sudo systemctl start logstash.service

```


### 18. Kibana Security 설정

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

  

```yml

xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true

```

ElasticSearch 7.x 버전까지는 위 설정만 넣고 Kibana에 설정을 추가해주면 가능했다.

하지만 8.x 버전부터는 ssl의 keystore를 필수적으로 입력해야 한다.

#### Elastic Search 8.x 버전 security 설정
[Security 설정 공식문서](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/configuring-stack-security.html?blade=kibanasecuritymessage)

```sh
# CA 생성 
sudo /usr/share/elasticsearch/bin/elasticsearch-certutil ca

# 각 노드에 대한 인증서 생성 
sudo /usr/share/elasticsearch/bin/elasticsearch-certutil cert --ca elastic-stack-ca.p12
```

중간중간 비밀번호 입력하라는건 그냥 enter 치고 넘겨버림

```sh
sudo find / -name "*.p12"
```

위 명령어로 생성한 .p12 파일들의 경로를 찾는다.

```sh
#----------------------- BEGIN SECURITY AUTO CONFIGURATION -----------------------
#
# The following settings, TLS certificates, and keys have been automatically      
# generated to configure Elasticsearch security features on 07-11-2023 06:19:34
#
# --------------------------------------------------------------------------------

# Enable security features
xpack.security.enabled: true

xpack.security.enrollment.enabled: true

# Enable encryption for HTTP API client connections, such as Kibana, Logstash, and Agents
xpack.security.http.ssl:
  enabled: true
  keystore.path: "/etc/elasticsearch/certs/http.p12"

# Enable encryption and mutual authentication between cluster nodes
xpack.security.transport.ssl:
  enabled: true
  verification_mode: certificate
  keystore.path: "/etc/elasticsearch/certs/transport.p12"
  truststore.path: "/etc/elasticsearch/certs/transport.p12"
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

나의 경우에는 위와 같이 바꿔줬다.

#### [Elastic Search - security 설정 참고](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/security-settings.html)

```

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
  
#### Kibana Security 설정


```sh
sudo /usr/share/elasticsearch/bin/elasticsearch-certutil cert --name kibana-server --out /etc/kibana/kibana.p12 --self-signed
```

```

sudo vi /etc/kibana/kibana.yml

```

```sh
# Kibana server's Elasticsearch connection configuration
elasticsearch.hosts: ["https://localhost:9200"]

# To avoid SSL certificate verification (not recommended for production use),
# set this option to false
elasticsearch.ssl.verificationMode: "certificate"

# Specify the path to the SSL certificate authority (CA) for Elasticsearch,
# if you have a custom CA
elasticsearch.ssl.certificateAuthorities: ["/etc/elasticsearch/certs/http_ca.crt"]

# If you have set up a service account token for Kibana as recommended, use this:
# elasticsearch.serviceAccountToken: "your_service_account_token"

# If you are using basic authentication, specify the Kibana system user (not recommended for newer versions):
elasticsearch.username: "elastic"
elasticsearch.password: "비밀번호"

# Specifies whether Kibana should require a user for authentication
xpack.security.enabled: true

# Kibana server's own certificate and key for incoming connections
server.ssl.enabled: true
server.ssl.keystore.path: "/etc/kibana/kibana.p12"

```

#### [더 많은 Kibana Security 옵션 참고](https://www.elastic.co/guide/en/kibana/8.10/security-settings-kb.html)

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

setup.dashboards.enabled: true

setup.kibana:
  host: "[kibana_ip]:5601"

# output.elasticsearch:
  # Array of hosts to connect to.
  # hosts: ["localhos:9200"]
  
output.logstash:
  hosts: ["es_ip:5044"]
```

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

#### (1) SSL 적용 (AWS ALB)

기존 ssl 적용을 하지 않고 http 통신을 했을때는 잘 되어서 ssl 까지 적용하려고 했다.
내 서버는 aws ec2 ubuntu 22.04 이며 ssl 은 aws의 certificate manager를 이용한다.
구글링을 하며 ssl 적용을 찾아봤을때는 다른 인증 기관에서 발급받은 crt, key를 사용했지만 aws는 crt, key를 따로 발급해주지 않기 때문에 난감했다.

찾아본 결과 aws는 로드밸런서에서 ssl 을 해결하고 있었으며 로드밸런서에 ssl 을 적용해주면 내가 따로 신경쓸건 없었다.

filebeat에서 elk를 연결하는 주소만 https로 바꿔주어 연결해주면 될것이라고 생각했지만 또 이슈가 발생했다.

http 통신때는 잘 되었지만 https로 바꾸고 나서 nginx에 전송하는 데이터가 너무 크다고 떴다. 
그래서 nginx 설정을 바꿔주어 client data의 용량을 늘려서 해결했다.

맨 처음 전송한 beat의 크기가 1MB가 넘어가서 오류가 뜬걸로 예상된다.

#### (2) logstash 설정

ssl 적용 후 filebeat 설정에서 logstash의 host에도 https를 붙였지만 logstash의 호스트는 https 프로토콜을 붙이지 말아야 한다고 에러가 떴다.

이유는 logstash는 tcp프로토콜로 통신을 하기 때문이다.

나는 aws 로드밸런서를 사용하고 있기 때문에 http/https를 위한 ALB를 구성중이었다.
조금 복잡해질것 같아서 그냥 새로운 인스턴스를 생성하고 NAB를 새로 만들었다.

그래도 logstash의 로그에서 오류가 떠서 살펴봤더니 `Invalid version of beats protocol: 69` 오류 였다.
해당 오류는 beats의 버전이 맞지 않아 값을 읽을수 없다는 오류라고 한다.
그래서 각 elk stack의 버전들을 확인해보니 filebeat만 혼자 7.17.8 버전이었고 나머지는 7.17.14버전이었다. 버전을 똑같이 7.17.14로 맞췄지만 그래도 protocol 관련한 오류가 떴다. 
[호환성 공식문서](https://www.elastic.co/support/matrix)를 찾아보니 ubuntu 22.04는 8.3.x 이상 버전과 호환이 된다고 해서 원래 7.17 버전으로 세팅했었지만 현재 버전인 8.10 버전으로 다시 설치했다. 
elasticsearch의 8.x 버전은 jdk 11 과 호환이 안되고 17과 호환이 된다고 해서 java도 다시 깔았다.


### 참고

- [Elasticsearch, Logstash, Kibana 를 우분투 22.04 에 설치하는 방법](https://hwanstory.kr/@kim-hwan/posts/ELK-Stack-Install)
- [AWS에 ELK 스택 구축(7.x)](https://velog.io/@_zero_/AWS%EC%97%90-ELK-7.x-%EC%8A%A4%ED%83%9D-%EA%B5%AC%EC%B6%95)
- [Support Matrix](https://www.elastic.co/support/matrix)
