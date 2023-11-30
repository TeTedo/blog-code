

![image](https://github.com/TeTedo/blog-code/assets/107897812/6f9811b3-0dfe-4b78-b83f-681b477499dc)

어느날 kibana에서 위와 같은 오류가 떴다.

디스크의 용량이 부족하다는 이슈라고 추측.


디스크 용량 확인
```
df -h
```

![image](https://github.com/TeTedo/blog-code/assets/107897812/9d05f21d-f3ce-4eb8-8566-be5569808a5b)

ec2 생성시 default 값인 8GB로 설정되어 있었다.

[AWS Ec2 디스크 용량 늘리기](https://leonkim.dev/aws/ce2-increase-disk-space/)를 참고해서 기존 ec2의 volume을 20GB로 늘렸다.

## 1. 로그 삭제

계속 로그파일을 저장하다보면 언젠가는 늘려놓은 volume도 가득 찰것이다.

그래서 주기적으로 s3에 백업한 후 log를 삭제하는 프로세스를 만드려고 한다.

## S3 등록

먼저 access_key, secret_key를 등록한다.

```sh
sudo /usr/share/elasticsearch/bin/elasticsearch-keystore add s3.client.default.access_key
sudo /usr/share/elasticsearch/bin/elasticsearch-keystore add s3.client.default.secret_key
```

- 참고

나는 위 명령어 입력시 오타로 잘못 입력함

```sh
sudo /usr/share/elasticsearch/bin/elasticsearch-keystore add s3.client.deflaut.access_key
```

근데 계속 secret key가 없다면서 elasticsearch가 재시작이 안되는 오류를 겪었다.

항상 오타조심.


## S3 백업 등록
```sh
curl -u 'elastic:비밀번호'-X PUT 'http://127.0.0.1:9200/_snapshot/s3_elk_backup' -H 'Content-Type: application/json' -d '{

      "type":"s3",

      "settings":{

        "bucket":"YOUR_BUCKET",

        "region":"YOUR_REGION",

        "base_path":"snapshot",

        "max_retries":3

      }

   }'
```


응답으로 `{"acknowledged":true}` 가 온다면 성공적으로 요청이 완료 된것이다.

권한때문에 이 curl 을 실행하는데 삽질좀 했지만 IAM 으로 S3FullAccess권한으로 성공했다.

## 스케줄러 등록(cron)

cron을 읽어 특정 주기마다 실행시켜준다고 한다.
cron과 스케줄러는 다음에 자세히 알아볼 예정이다.

```sh
sudo crontab -e
```

양식을 고르라고 하는데 나는 easiest라고 써져있던걸 선택했다.
주석 마지막줄에 cron을 추가했다.

```sh
0 0 * * * bash /home/ubuntu/daily_elk_backup.sh >> /home/ubuntu/log/elk_backup.log 2>&1
```

/home/ubuntu 경로에 daily_elk_backup.sh을 매일 0시 0분에 실행한다는 의미이다.
그 결과를 /home/ubuntu/log/elk_backup.log에 저장한다는 script이다.

#### daily_elk_backup.sh
```sh
sudo vi /home/ubuntu/daily_elk_backup.sh
```

```sh
TODAY=$(date +'%Y.%m.%d')
YESTERDAY=$(date --date="1 days ago" +'%Y.%m.%d')
BEATS_VERSION="8.11.0" # Update this as needed

echo Today is $TODAY
echo Yesterday $YESTERDAY indices will be stored in S3

INDEX_PREFIXES=''
INDEX_PREFIXES+="metricbeat-${BEATS_VERSION}- "
INDEX_PREFIXES+="filebeat-${BEATS_VERSION}- "

for prefix in $INDEX_PREFIXES;
do
  INDEX_NAME=${prefix}$YESTERDAY
  SNAPSHOT_NAME="${INDEX_NAME}-snapshot"
  echo Start Snapshot $INDEX_NAME
  curl -u "elastic:비밀번호" -X PUT "http://localhost:9200/_snapshot/s3_elk_backup/$SNAPSHOT_NAME?wait_for_completion=true" -H 'Content-Type: application/json' -d '{
  "indices": "'"$INDEX_NAME"'",
  "ignore_unavailable": "true",
  "include_global_state": false
  }'

  echo Successfully completed storing "$INDEX_NAME" in S3
done

```

나는 metricbeat와 filebeat 두개를 받고 있다.
sh를 보면 전날 로그들을 snapshot에 저장하는 스크립트이다.
[Create snapshot API 공식문서](https://www.elastic.co/guide/en/elasticsearch/reference/current/create-snapshot-api.html)를 참고하면 된다.

추가로 cron에서 실행할 수 있도록 권한을 부여한다.

```
sudo chmod +x /home/ubuntu/daily_elk_backup.sh
```

S3에 성공적으로 저장되는지 테스트는 sh를 실행시켜 보면 된다.
```bash
bash /home/ubuntu/daily_elk_backup.sh
```

```bash
curl -u "elastic:비밀번호" -X GET "localhost:9200/_snapshot/s3_elk_backup/_all?pretty"
```

스냅샷 정보도 조회할 수 있다.

스냅샷 저장 후 인덱스를 삭제해도 스냅샷에 저장된 인덱스로 다시 원상복구를 할 수 있다.

테스트 과정은 sh가 잘 작동하는지 확인한다 -> crontab -e 로 시간을 현재시간 기준 1분뒤에 실행되도록 작성한다. -> 0시 0분에 작동하도록 하고 다음날에 와서 확인한다.

위 순서로 테스트를 진행했다.

스냅샷 이름이 같으면 오류를 뱉으므로 중간중간 kibana에서 생성된 snapshot을 삭제하면서 진행했다.

다음은 스냅샷을 저장했으니 인덱스의 라이프사이클을 조정해서 인덱스의 삭제를 조정할 수 있다.

[ILM(Index Lifecycle Manage 공식문서)](https://www.elastic.co/guide/en/elasticsearch/reference/current/set-up-lifecycle-policy.html)를 참고하면 라이프사이클을 키바나에서도 관리할 수 있다.

## 2. Index 삭제

나는 s3에 저장하는것과 마찬가지로 크론으로 삭제하는것도 작성해보도록 하겠다.

### week_elk_delete.sh 파일 작성

```bash
sudo vi /home/ubuntu/week_elk_delete.sh
```

```sh
TODAY=$(date +'%Y.%m.%d')
ONEWEEKAGO=$(date --date="7 days ago" +'%Y.%m.%d')
BEATS_VERSION="8.11.0"

echo Today is $TODAY
echo Delete date is $ONEWEEKAGO 

INDEX_PREFIXES=''
INDEX_PREFIXES+="metricbeat-${BEATS_VERSION}- "
INDEX_PREFIXES+="filebeat-${BEATS_VERSION}- "

for prefix in $INDEX_PREFIXES;
do
  INDEX_NAME=${prefix}$ONEWEEKAGO
  echo Deleting index $INDEX_NAME
  response=$(curl -u "elastic:비밀번호" -X DELETE "http://localhost:9200/$INDEX_NAME" -w "%{http_code}" -o /dev/null -s)
  if [ "$response" -eq 200 ]; then
        echo "Deleteion of $INDEX_NAME was seccessful"
  elif [ "$response" -eq 404 ]; then
        echo "$INDEX_NAME did not exitst."
  else
        echo "Failed to delete $INDEX_NAME. HTTP response code: $response"
  fi

  echo "Successfully processed deletion for $INDEX_NAME in Elasticsearch"
done

```

elastic 의 비밀번호 부분만 바꾸면 된다.
security 설정이 안되어있다면 -u 부분을 없애면 됨.

### sh 파일 권한 부여

```
sudo chmod +x /home/ubuntu/week_elk_delete.sh
```

### cron 등록

```
sudo crontab -e
```

```
0 0 * * * bash /home/ubuntu/week_elk_delete.sh >> /home/ubuntu/log/elk_delete.log 2>&1
```

위내용을 추가해준다.

나의 crontab파일의 결과는 아래와 같다.

```sh
# Edit this file to introduce tasks to be run by cron.
# 
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
# 
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
# 
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
# 
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
# 
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
# 
# For more information see the manual pages of crontab(5) and cron(8)
# 
# m h  dom mon dow   command
0 0 * * * bash /home/ubuntu/daily_elk_backup.sh >> /home/ubuntu/log/elk_backup.log 2>&1
0 0 * * * bash /home/ubuntu/week_elk_delete.sh >> /home/ubuntu/log/elk_delete.log 2>&1
```

매일 일주일 전 인덱스를 삭제하면 되기 때문에 삭제 또한 매일 실행시켜준다.

## 3. 필요한 필드만 받아오기

용량 부족의 가장큰 원인은 metricbeat였다.
system module 내용을 전부 받아왔기 때문에 그만큼 엄청난 수의 beat를 받게 되었다.
이를 해결하기 위해 필요한 필드만 받아오게끔 metricbeat.yml 파일을 수정해줬다.

### metricbeat.yml

```yml
setup.kibana:
  host: "[kibana host]"
  username: "elastic"
  password: "password"

output.logstash:
  hosts: ["[logstash host]"]
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

## 후기

sh 파일을 작성해서 cron으로 등록하여 백업과 인덱스 삭제를 해봤다.

이를 커스텀하여 주기적으로 s3 용량관리도 할수 있을거라고 생각한다.
생각보다 어렵지 않았고 공식문서에서 설명하는 kibana로 하는게 더 어려웠다.
먼저 rollover라는 용어가 너무 생소했고 아직도 잘 와닿지 않는다..

처음 elk를 설치하면서 tls 때문에 고생했던거에 비해 매우 스무스하게 오류를 해결했다.

생각해보지 않았던 디스크 용량의 이슈를 겪어보며 경험의 폭이 늘어난것 같다.

## 참고
[AWS Ec2 디스크 용량 늘리기](https://leonkim.dev/aws/ce2-increase-disk-space/)
[ElasticSearch s3 repository 공식문서](https://www.elastic.co/guide/en/elasticsearch/reference/current/repository-s3.html)
[AWS S3를 활용한 ELK 스택 로그 백업 및 복원](https://bkjeon1614.tistory.com/319)
[Create snapshot API 공식문서](https://www.elastic.co/guide/en/elasticsearch/reference/current/create-snapshot-api.html)
[ILM(Index Lifecycle Manage 공식문서)](https://www.elastic.co/guide/en/elasticsearch/reference/current/set-up-lifecycle-policy.html)
[GPT](https://chat.openai.com/)
