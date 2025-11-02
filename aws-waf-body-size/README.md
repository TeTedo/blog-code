# 10kb 이상 파일 업로드가 안되는데요?

백엔드 서버는 spring boot를 사용하고 있고 파일업로드 기능은 multipart로 파일을 받아 s3에 업로드하는 형식이다.

파일 업로드가 안되는 이슈를 계속 테스트 해봤고 10kb 이상 파일부터 안올라 가는걸 확인했다.

나는 어플리케이션의 문제로 인지했고 파일 크기관련 설정을 넣어줬지만 여전히 계속 실패했다.

```yaml
spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 20MB
      max-request-size: 20MB
```

진짜 삽질 너무많이 했는데 결국엔 WAF 문제였다.

WAF 규칙에 AWSManagedRulesCommonRuleSet 중 SizeRestrictions_BODY 설정이 10kb 이상의 body값은 차단하도록 설정되어있었다.

이걸 풀어주니 잘 성공했다.

## 교훈

미루고 미뤘던 s3 pre signed url 을 적용할때가 온거같다..
