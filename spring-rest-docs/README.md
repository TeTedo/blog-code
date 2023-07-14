# Spring REST Docs

## REST Docs란?

- 이름 그대로 REST 문서이다.

- REST API를 문서화하여 input, output, 파라미터 세부정보 등을 팀원과 공유할 수 있다.

- REST Docs는 테스트 코드를 통과하여야 문서로 작성되기 때문에 검증된 문서를 작성할 수 있다.

## REST Docs를 선택한 이유?

Spring에서 문서화를 할때 Swagger와 Rest Docs를 많이 사용한다.

개인적으로 Swagger UI가 더 보기 좋다.

그리고 Swagger는 curl을 통해 API를 바로 테스트 해볼 수 있지만 REST Docs는 단순히 문서만 제공한다.

여기까지 보고 나는 Swagger로 해야겠다는 생각을 하고 어떻게 코드를 작성하나 찾아봤다.

근데 Swagger는 기존 코드에 어노테이션을 덕지덕지 붙어야 한다는 단점이 있다.

코드의 가독성을 떨어뜨리면서까지 API문서를 만들어야 할까? 라는 생각이 컸고 결국 REST Docs로 선택을 바꿨다.

| ![swagger-api](https://github.com/TeTedo/blog-code/assets/107897812/1ee60465-bc76-4195-9f34-2383e16a0d2e) |
| :-------------------------------------------------------------------------------------------------------: |
|                                             <b>Swagger UI</b>                                             |

asdf
asdf
asdf
