
### 환경
Elastic Search 와 Kibana는 같은 인스턴스, Logstash, filebeat 총 3개의 인스턴스로 테스트를 진행했다.

aws ec2
ubuntu 22.04


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

### 4. ElasticSearch 실행

```sh

sudo systemctl daemon-reload

sudo systemctl enable elasticsearch.service

sudo systemctl start elasticsearch.service

```

### 5. Kibana 설치

```sh

sudo apt-get update && sudo apt-get install kibana

```

### 6. Kibana 실행

```sh
sudo systemctl daemon-reload
sudo systemctl enable kibana.service
sudo systemctl start kibana.service
```

### 7. Nginx 설정 및 시작

```sh

sudo vi /etc/nginx/nginx.conf

```

```nginx
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}

http {

  upstream kibana {
    server 127.0.0.1:5601 max_fails=3 fail_timeout=30s;
}

  server {
    listen 80;

    location / {
          proxy_pass          http://kibana;
          proxy_set_header    X-Real-IP           $remote_addr;
          proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
          proxy_set_header    Host                $http_host;
    }
  }

  include /etc/nginx/conf.d/*.conf;
}


```

```sh
sudo systemctl enable nginx.service
sudo systemctl restart nginx.service
```

![image](https://github.com/TeTedo/blog-code/assets/107897812/daab44bb-53d6-4b8e-a6ab-ecc19d5afceb)

설정을 하고 접속해보면 위와 같은 화면이 나온다.

나는 여기서 추가로 security를 설정하여 id, pw로 로그인할 수 있도록 설정하려고 한다.

예전에는 elastic 이라는 username으로 superuser 권한이 부여되고 kibana에도 적용해줄수 있었지만 8.0부터는 아니라고 한다. [elastic forbid issue 참고](https://github.com/elastic/kibana/pull/122722)

그래서 kibana 라는 유저로 kibana.yml에 추가해 주려고 한다.
#### 8. 설정 파일 수정

**(1) kibana 유저 비밀번호 설정**

```sh
sudo /usr/share/elasticsearch/bin/elasticsearch-reset-password -u kibana -i
```

**(2) elasticsearch.yml 파일 수정**

나는 내부에 ssl 을 설정하지 않고 aws 로드밸런서에서 처리를 해주기 때문에 `xpack.security.http.ssl` 설정을 false로 처리한다.

```sh
sudo vi /etc/elasticsearch/elasticsearch.yml
```

```yml
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch

xpack.security.enabled: true

xpack.security.enrollment.enabled: true

xpack.security.http.ssl:
  enabled: false
  keystore.path: certs/http.p12

xpack.security.transport.ssl:
  enabled: true
  verification_mode: certificate
  keystore.path: certs/transport.p12
  truststore.path: certs/transport.p12
cluster.initial_master_nodes: ["master-node"]

http.host: 0.0.0.0
```

**(3) kibana.yml 파일 수정**

```sh
sudo vi /etc/kibana/kibana.yml
```

```yml
server.host: "0.0.0.0"

elasticsearch.hosts: ["http://localhost:9200"]
elasticsearch.username: "kibana"
elasticsearch.password: "위에서 설정했던 비밀번호"

logging:
  appenders:
    file:
      type: file
      fileName: /var/log/kibana/kibana.log
      layout:
        type: json
  root:
    appenders:
      - default
      - file

pid.file: /run/kibana/kibana.pid
```

elasticsearch.username을 elastic으로 설정하게 되면 권한 오류가 뜨게 된다.
그래서 kibana로 username을 설정해줬다.

위 설정들을 마치고 kibana와 elasticsearch를 재시작 해준다.

```sh
sudo systemctl restart elasticsearch.service
sudo systemctl restart kibana.service
```

실행 후 다시 키바나 홈페이지에 들어가보면 아래와 같이 username, password를 입력하는게 생겼다.

![image](https://github.com/TeTedo/spring-security-practice/assets/107897812/6e823732-74da-4fef-919f-0090a7d2d916)

### 9. Logstash 설치 (새로운 서버에 jdk 설치해주고 설치)

```
sudo apt-get update

sudo apt install openjdk-17-jdk
```

```sh
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
```

```sh
sudo apt-get install apt-transport-https
```

```sh
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list
```

```sh

sudo apt-get update && sudo apt-get install logstash

```

나는 logstash를 다른 서버에서 새로 설치했다.

### 10. Logstash Input, Output 설정

```sh
sudo vi /etc/logstash/conf.d/logstash.conf
```

아래 username, password 부분은 kibana에서 user를 새로 만들어서 넣어줘도 되고 elastic 유저를 써도 된다.


```c

input {

  beats {

    port => 5044

    host => "0.0.0.0"

  }

}

  

filter {
  if [agent][type] == "heartbeat" {
    mutate {
      add_field => { "[host][hostname]" => "%{[monitor][name]}" }
    }
  }
}

  

output {

  elasticsearch {

    hosts => ["[elasticsearch-ip:9200]"]

    index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"

    user => "kibana"

    password => "비밀번호"

  }

}

```

7.5 버전까지는 heartbeat에서 hostname을 지원해줬다고 하지만 이제는 지원해주지 않는다.[host.name 관련 github issue 참고](https://github.com/elastic/beats/issues/12107)

그래서 나중에 시각화를 위해 hostname 필드를 수동으로 filter에서 넣어줬다.
### 11. Logstash test

```sh
sudo -u logstash /usr/share/logstash/bin/logstash --path.settings /etc/logstash -t
```

위 명령어를 입력하면 아래와 같이 cli에 나타난다. 맨아래 OK 가 보이면 된다.

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

### 12. Logstash 실행

```sh
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable logstash.service
sudo systemctl start logstash.service
```

### 13. filebeat 설치 (다른 새로운 ec2 인스턴스에 설치)

```bash
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.11.0-amd64.deb
sudo dpkg -i filebeat-8.11.0-amd64.deb
```

### 14. filebeat 설정 변경

```bash

sudo vi /etc/filebeat/filebeat.yml

```

```yml
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
당연히 http 통신을 할 줄 알았지만 tcp로 통신한다고 한다.
단순히 패킷을 전달하는거라 
### 15. filebeat 모듈 설정

```
sudo filebeat modules list
filebeat modules enable [모듈]
```
  

### 16. filebeat 시작

```bash
sudo /bin/systemctl daemon-reload

sudo /bin/systemctl enable filebeat.service

sudo systemctl start filebeat.service
```

### 17. heartbeat 설치

인스턴스의 ICMP로 Health Check를 하기 위해 logstash 서버에 heartbeat를 설치한 후 logstash로 보내는걸 목적으로 한다.

```bash
curl -L -O https://artifacts.elastic.co/downloads/beats/heartbeat/heartbeat-8.11.0-amd64.deb
sudo dpkg -i heartbeat-8.11.0-amd64.deb
sudo apt-get update
```

### 18. heartbeat 설정 변경

```
sudo vi /etc/heartbeat/heartbeat.yml
```

```yml
############################ Heartbeat ######################################

# Define a directory from which to load monitor definitions. Definitions take the form
# of individual yaml files.
heartbeat.config.monitors:
  # Directory + glob pattern to search for configuration files
  path: ${path.config}/monitors.d/*.yml
  # If enabled, heartbeat will periodically check the config.monitors path for changes
  reload.enabled: false
  # How often to check for changes
  reload.period: 5s

# Configure monitors inline
heartbeat.monitors:
- type: icmp
  id: icmp-monitor
  # Human readable display name for this service in Uptime UI and elsewhere
  name: ICMP Monitor
  # List of URLs to query
  hosts: ["모니터링할 서버 ip"]
  # Configure task schedule
  schedule: '@every 30s'
  # Total test connection and data exchange timeout
  #timeout: 16s
  # Name of corresponding APM service, if Elastic APM is in use for the monitored service.
  #service.name: my-apm-service-name

# Experimental: Set this to true to run heartbeat monitors exactly once at startup
#heartbeat.run_once: true

# ======================= Elasticsearch template setting =======================

setup.template.settings:
  index.number_of_shards: 1
  index.codec: best_compression
  #_source.enabled: false

# =================================== Kibana ===================================

# Starting with Beats version 6.0.0, the dashboards are loaded via the Kibana API.
# This requires a Kibana endpoint configuration.
setup.kibana:

  # Kibana Host
  # Scheme and port can be left out and will be set to the default (http and 5601)
  # In case you specify and additional path, the scheme is required: http://localhost:5601/path
  # IPv6 addresses should always be defined as: https://[2001:db8::1]:5601
  host: "[kibana host]"
  username: "elastic"
  password: "비밀번호"

  # Kibana Space ID
  # ID of the Kibana Space into which the dashboards should be loaded. By default,
  # the Default Space will be used.
  #space.id:

# ------------------------------ Logstash Output -------------------------------
output.logstash:
  # The Logstash hosts
  hosts: ["localhost:5044"]

  # Optional SSL. By default is off.
  # List of root certificates for HTTPS server verifications
  #ssl.certificate_authorities: ["/etc/pki/root/ca.pem"]

  # Certificate for SSL client authentication
  #ssl.certificate: "/etc/pki/client/cert.pem"

  # Client Certificate Key
  #ssl.key: "/etc/pki/client/cert.key"
# ================================= Processors =================================

processors:
  - add_observer_metadata: ~
  - add_host_metadata: ~

      # Optional, but recommended geo settings for the location Heartbeat is running in
      #geo:
        # Token describing this location
        #name: us-east-1a
        # Lat, Lon "
        #location: "37.926868, -78.024902"

```
### 19. 겪은 이슈

#### (1) logstash 에러

ssl 적용 후 filebeat 설정에서 logstash의 host에도 https를 붙였지만 logstash의 호스트는 https 프로토콜을 붙이지 말아야 한다고 에러가 떴다.

이유는 logstash는 tcp프로토콜로 통신을 하기 때문이다.

나는 aws 로드밸런서를 사용하고 있기 때문에 http/https를 위한 ALB를 구성중이었다.
조금 복잡해질것 같아서 그냥 새로운 인스턴스를 생성하고 NAB를 새로 만들었다.

그래도 logstash의 로그에서 오류가 떠서 살펴봤더니 `Invalid version of beats protocol: 69` 오류 였다.
해당 오류는 beats의 버전이 맞지 않아 값을 읽을수 없다는 오류라고 한다.
그래서 각 elk stack의 버전들을 확인해보니 filebeat만 혼자 다른 버전이었다. 버전을 똑같이 맞췄지만 그래도 protocol 관련한 오류가 떴다. 
[호환성 공식문서](https://www.elastic.co/support/matrix)를 찾아보니 ubuntu 22.04는 8.3.x 이상 버전과 호환이 된다고 해서 원래 7.17 버전으로 세팅했었지만 현재 버전인 8.11 버전으로 다시 설치했다. 
elasticsearch의 8.x 버전은 jdk 11 과 호환이 안되고 17과 호환이 된다고 해서 java도 다시 깔았다.

#### (2) ElasticSearch, Kibana 연결

7.x 버전을 하다가 8.x 버전을 세팅하니까 달라진게 많았다.
가장 대표적으로 security 설정이었는데, 7.x 버전은 증명서를 넣지 않아도 됬지만 8.x버전은 꼭 명시해줘야 했다.

그리고 kibana.yml에 명시해주는 elasticsearch.username 을 elastic 으로 사용하면 안된다.

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

나는 SSL Termination만 사용하고 있었기 때문에 elasticsearch.yml 파일에서 `xpack.security.http.ssl` 이부분을 false로 처리해줬다.


### 22. 느낀점

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
