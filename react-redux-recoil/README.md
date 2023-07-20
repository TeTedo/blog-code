# **Redux vs Recoil**

나는 리액트로 개발을 할때 redux밖에 사용하지 않았었다.

Redux는 검증되어있는 느낌이었고 커뮤니티 풀도 Redux가 우세하다고 생각했기 때문에 처음에 Redux를 공부하여 Redux만 사용했다.

최근 React-query를 사용하여 서버데이터와 클라이언트 내부데이터의 상태관리를 나누는 방법으로 개발을 하고 있다.

그래서 내부 상태저장을 할때 코드가 적은 recoil에 관심을 가지게 되었고 redux와 recoil의 차이점을 알아보려고 한다.

## **1. Redux**

![flux패턴 전](https://github.com/TeTedo/blog-code/assets/107897812/7538e088-a31a-482d-a1c4-0d96ecb8034a)

기존 양방향 데이터 흐름

Meta(전 Facebook)는 상태관리 문제를 해결하기 위해 Flux 패턴을 만들어 양방향 데이터 흐름에서 벗어나 단방향으로만 데이터를 변경할 수 있도록 만들었다.

Redux는 이 Flux패턴으로 단방향 데이터 흐름으로 Reducer에게 값을 전달 후 View에 값을 띄운다.

![Redux 데이터 흐름](https://github.com/TeTedo/blog-code/assets/107897812/099a12f8-e50c-4494-89a3-a6a244ff04ca)

리덕스의 데이터 흐름은 위와 같다.

View 화면에서 액션을 취하면 state값을 바꾸고 그걸 view에 적용한다.

이 내용을 세부적으로 파본다면 아래와 같다.

![Redux 데이터 흐름](https://github.com/TeTedo/blog-code/assets/107897812/57e6274d-01a7-475d-a636-10463aac0454)

1.  사용자가 상태가 바뀌는 액션을 취하면 변경될 상태의 정보를 가진 Action 객체가 생성된다.

2.  생성된 객체는 Dispatcher 함수가 Reducer함수에 전달한다.

3.  Reducer함수는 전달된 객체로 전역 상태 저장소인 Store의 상태 값을 바꾸고 이를 View에 전달한다.

4.  바뀐 State 값을 받아 View에서 다시 렌더링한다.

참고

[Redux의 데이터 흐름](https://velog.io/@jos9187/Redux%EC%9D%98-%EB%8D%B0%EC%9D%B4%ED%84%B0-%ED%9D%90%EB%A6%84)

[Redux 공식문서](https://redux.js.org/introduction/getting-started)
