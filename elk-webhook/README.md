유료버전이라면 [watcher 만들기](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/watcher-api-put-watch.html)를 참고해서 watcher를 만들거나 kibana에서 webhook connector 를 만들어서 사용하면 된다.

나는 무료버전이었기 때문에 다른 방법을 찾아야 했고 제일 원초적으로 어떠한 툴도 쓰지 않고 cron으로 해결하는 방법으로 직접 webhook을 호출하는 방법을 사용하려고 한다.

사내에서 잔디라는 메신저를 쓰는데 webhook으로 error로그 발생시 메신저에 보내는 shell 을 구현할 것이다.

아래 스크립트는 잔디에 맞춘내용이라 알아서 커스텀해서 쓰면 될것 같다.

그전에 먼저 jq를 설치해서 json 을 편하게 사용하도록 한다.

```
sudo apt-get install jq
```

### (1) error-log bash

```sh
#!/bin/bash

ES_USER='elastic'
ES_PASS='비밀번호'
ES_HOST='http://localhost:9200'
INDEX='filebeat-*'
WEBHOOK_URL='발급받은 webhook url'

QUERY='{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "fields.log_level": "error"
          }
        },
        {
          "range": {
            "@timestamp": {
              "gte": "now-1m/m",
              "lte": "now/m"
            }
          }
        }
      ]
    }
  },
  "_source": ["host.hostname", "message"],
  "size": 10 
}'

RESULT=$(curl -s -u $ES_USER:$ES_PASS -X GET "$ES_HOST/$INDEX/_search" -H 'Content-Type: application/json' -d "$QUERY")
echo $RESULT


ERROR_COUNT=$(echo $RESULT | jq '.hits.total.value')

if [[ $ERROR_COUNT -gt 10 ]]; then
        ERROR_COUNT=10
fi

echo "ERROR COUNT : $ERROR_COUNT"


if [[ $ERROR_COUNT -gt 0 ]]; then
  for ((i=0; i<$ERROR_COUNT; i++))
  do
    # Extract hostname and message from each hit
    HIT=$(echo $RESULT | jq ".hits.hits[$i]._source")
    HOSTNAME=$(echo $HIT | jq -r '.host.hostname')
    MESSAGE=$(echo $HIT | jq -r '.message' | tr '\n' ' '  | jq -sR .)
    ESCAPED_MESSAGE=$(echo $MESSAGE | sed 's/\"/\\"/g')

    echo "MESSAGE : $ESCAPED_MESSAGE"

    WEBHOOK_PAYLOAD='{
      "body": "Error log detected!",
      "connectColor": "#FF0000",
      "connectInfo": [
        {
          "title": "Hostname",
          "description": "'$HOSTNAME'"
        },
        {
          "title": "Message",
          "description": "'$ESCAPED_MESSAGE'"
        }
      ]
    }'

    echo "WEBHOOK PAYLOAD : $WEBHOOK_PAYLOAD"

    echo "Sending Webhook for $HOSTNAME"
    curl -X POST $WEBHOOK_URL \
     -H 'Accept: application/vnd.tosslab.jandi-v2+json' \
     -H 'Content-Type: application/json' \
     --data-binary "$WEBHOOK_PAYLOAD"

  done
fi

```


### (2) crontab 작성

```
sudo crontab -e
```

아래 내용을 추가한다.

```
* * * * * bash 경로/errorlog.sh
```


### 마치며

이제는 cron 사용에 좀 익숙해졌다.
처음으로 ElasticSearch의 쿼리문도 작성해봤는데 너무 익숙하지가 않다.
좀더 하다보면 괜찮아지겠지 라는 생각으로 계속 만질 예정이긴하다.
