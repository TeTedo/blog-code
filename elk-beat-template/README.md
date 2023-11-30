# ELK 구축후 각 인스턴스에 세팅해줄 템플릿

## 0-1. 호스트 네임 설정

```bash
sudo hostnamectl set-hostname [호스트 이름]
```

## 0-2. 인스턴스 시간 설정 (서울)

```bash
sudo timedatectl set-timezone Asia/Seoul
```

## 1. metric beat 세팅 - CPU, 메모리, 디스크 사용량
### (1) metric beat 설치

```bash
curl -L -O https://artifacts.elastic.co/downloads/beats/metricbeat/metricbeat-8.11.0-amd64.deb
sudo dpkg -i metricbeat-8.11.0-amd64.deb
sudo apt-get update
```


### (2) metric beat 설정

```bash
sudo rm -rf /etc/metricbeat/metricbeat.yml
sudo vi /etc/metricbeat/metricbeat.yml
```


```yml
setup.kibana:
  host: "[kibana host]:443"
  username: "elastic"
  password: "password"

output.logstash:
  hosts: ["logstashhost:port"]
  ssl.enabled: true

processors:
  - add_host_metadata: ~

metricbeat.modules:
- module: system
  metricsets:
    - cpu
    - memory
    - network
    - fsstat
  period: 30s

```

### (3) metric beat 실행

```bash
sudo systemctl start metricbeat.service
sudo systemctl enable metricbeat.service
```

```bash
sudo systemctl status metricbeat.service
```


## 2. filebeat 설치 - application log 전송
### (1) filebeat 설치

```bash
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.11.0-amd64.deb
sudo dpkg -i filebeat-8.11.0-amd64.deb
```

### (2) filebeat 설정

```bash
sudo rm -rf /etc/filebeat/filebeat.yml
sudo vi /etc/filebeat/filebeat.yml
```

```yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - 전체로그경로.log # 전체 쌓는 로그 경로
    fields:
      log_level: info

  - type: log
    enabled: true
    paths:
      - 에러로그경로.log # 에러 로그 경로
    fields:
      log_level: error

setup.kibana:
  host: "[kibana host]:443"
  username: "elastic"
  password: "password"

output.logstash:
  hosts: ["logstash host"]
  ssl.enabled: true

processors:
  - add_host_metadata: ~

```

### (3) filebeat 실행

```bash
sudo systemctl start filebeat.service
sudo systemctl enable filebeat.service
```

```bash
sudo systemctl status filebeat.service
```

## 3. heartbeat 설정

### (1) ping 허용

Aws security 인바운드 규칙 추가 ->  Custom ICMP - ip는 logstash ip 받으면 됨.

### (2) heartbeat 설치 -  logstash 서버에 설치하기 때문에 application 서버는 해당사항 없음.

```
curl -L -O https://artifacts.elastic.co/downloads/beats/heartbeat/heartbeat-8.11.0-amd64.deb
sudo dpkg -i heartbeat-8.11.0-amd64.deb
```
### (3) heartbeat.yml

```bash
sudo rm -rf /etc/heartbeat/heartbeat.yml
sudo vi /etc/heartbeat/heartbeat.yml
```

```yml
heartbeat.monitors:
- type: icmp
  id: icmp-monitor
  name: filebeat-test
  hosts: ["monitoring할 서버ip"]
  schedule: '@every 30s'

setup.kibana:
  host: "[kibana host]"
  username: "elastic"
  password: "password"


output.logstash:
  hosts: ["localhost:5044"]

```

```bash
sudo systemctl start heartbeat-elastic.service 
```

## 4. 결과

### (1) metricbeat - 30초
### (2) filebeat - 10초에 한번씩 로그 파일이 변경되는지 확인
### (3) heartbeat(ICMP) 30초
### (4) 최종 logstash.conf 파일

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
    hosts => ["es host"]
    index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"
    user => "elastic"
    password => "password"
  }
}

```