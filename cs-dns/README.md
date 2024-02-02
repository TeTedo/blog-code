# DNS란 무엇인가?

## 발단 
route53 에서 여러가지 실험을 해보다가 hostzone을 삭제하고 다시 생성 후 ALB를 적용하여 요청했는데 dns를 못찾음.

검색을 해보다가 [AWS Route53에서 Record 변경 사항이 적용되는 시간](https://support.bespinglobal.com/ko/support/solutions/articles/73000544731--aws-route53%EC%97%90%EC%84%9C-record-%EB%B3%80%EA%B2%BD-%EC%82%AC%ED%95%AD%EC%9D%B4-%EC%A0%81%EC%9A%A9%EB%90%98%EB%8A%94-%EC%8B%9C%EA%B0%84)의 질문을 보고 DNS 캐시를 인지했고 예전에 들어보기만 했던 DNS 캐시에 대해서 찾아보다가 DNS의 동작방식에 대해 알게 됨.

문제의 원인은 route53과 등록된 도메인의 네임서버가 다른게 원인이었지만 문제를 해결하며 알게된 DNS와 관련된 내용을 정리하려고 한다.

## DNS란?
DNS란 Domain Name System의 도메인 이름을 ip로 바꾸거나 그 반대의 변환을 수행할 수 있도록 하기 위해 개발되었다고 한다.

사람이 이해하기 쉬운 도메인 이름을 IP 주소로 변환하는 흔히 "전화번호부"에 비유된다.

"naver.com" 입력시 브라우저는 naver.com에 해당하는 ip를 찾아 그 ip에 요청을 하여 받은 html을 화면에 뿌려준다.
## DNS 동작 방식
ip를 찾기 위해서는 4개의 서버가 동작한다.
### (1) DNS Resolver 
클라이언트의 요청으로 DNS를 받아 ip를 응답해준다.

DNS Resolver는 다른 서버들에게 DNS를 보내면서 해당하는 ip를 찾는 역할이다.

Root Server, TLD Server, Name Server 순으로 요청하여 ip를 받아온다.

### (2) Root Server
DNS Resolver로부터 DNS를 받아 루트 도메인(.com 또는 .org 등등)에 대한 최상위 도메인 서버(TLD Server)를 알려준다.

### (3) TLD Server
DNS Resolver로부터  DNS를 받아 해당 도메인의 권한 있는 서버인 네임서버의 주소를 알려준다.

### (3) Name Server
DNS Resolver로부터 DNS를 받아 하위 도메인의 ip를 return 한다.

---
![what_is_a_dns_server_dns_lookup](https://github.com/TeTedo/blog-code/assets/107897812/b3d55ba3-5ae8-4170-8c35-6766ba333436)
출처 : https://www.cloudflare.com/ko-kr/learning/dns/what-is-a-dns-server/

위 그림처럼 소통을 하는 것이다.
## DNS 캐싱
위처럼 DNS를 통해 도메인의 ip를 찾는 건 꽤 복잡한 과정이 이루어진다.

그래서 도메인 이름과 ip를 저장해놓는데 이를 다른말로 캐싱이라고 표현한다.

브라우저 캐싱, os 캐싱, 라우터 캐싱 등등 캐싱은 생각보다 많은 곳에서 이루어졌다.

이때 중요한건 얼마나 캐시를 들고 있냐가 중요한데 이 시간을 TTL(Time to live)이라 하고, 도메인에 TTL을 지정을 해둘 수 있다. 보통 24~48시간 정도로 설정해놓는다고 한다.

해커가 도메인에 대한 ip를 다른곳으로 매핑을 해놓는다면 유저는 아무리 시도해도 원하는 ip에 도달할 수 없을것이다.

이때는 캐시를 지워 다시 ip를 받아와야 할것인데 대표적으로 크롬에 chrome://net-internals/#dns 주소로 들어가보면 캐시를 지울수 있다.

### 참고
[위키백과 - 도메인 네임 시스템](https://ko.wikipedia.org/wiki/%EB%8F%84%EB%A9%94%EC%9D%B8_%EB%84%A4%EC%9E%84_%EC%8B%9C%EC%8A%A4%ED%85%9C)
[DNS 서버란? (cloud flare)](https://www.cloudflare.com/ko-kr/learning/dns/what-is-a-dns-server/)
[KT Cloud Dev Tools - DNS 기술 소개](https://tech.ktcloud.com/46?category=428559)