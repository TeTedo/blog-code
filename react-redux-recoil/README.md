# **Redux vs Recoil**

> 모든 코드는 [Github](https://github.com/TeTedo/blog-code/tree/main/react-redux-recoil)에 저장되어 있습니다.

나는 리액트로 개발을 할때 redux밖에 사용하지 않았었다.

Redux는 검증되어있는 느낌이었고 커뮤니티 풀도 Redux가 우세했기 때문에 처음에 Redux를 공부하여 Redux만 사용했다.

최근 React-query를 사용하여 서버데이터와 클라이언트 내부데이터의 상태관리를 나누는 방법으로 개발을 하고 있다.

그래서 내부 상태저장을 할때 상대적으로 코드가 적은 recoil에 관심을 가지게 되었고 redux와 recoil의 차이점을 알아보려고 한다.

## **1. Redux**

![flux패턴 전](https://github.com/TeTedo/blog-code/assets/107897812/7538e088-a31a-482d-a1c4-0d96ecb8034a)

기존 양방향 데이터 흐름

Meta(전 Facebook)는 상태관리 문제를 해결하기 위해 Flux 패턴을 만들어 양방향 데이터 흐름에서 벗어나 단방향으로만 데이터를 변경할 수 있도록 만들었다.

Redux는 이 Flux패턴으로 단방향 데이터 흐름으로 Reducer에게 값을 전달 후 View에 값을 띄운다.

그래서 Reducer + Flux = Redux 라는 이름이 탄생했다.

![Redux 데이터 흐름](https://github.com/TeTedo/blog-code/assets/107897812/099a12f8-e50c-4494-89a3-a6a244ff04ca)

리덕스의 데이터 흐름은 위와 같다.

View 화면에서 액션을 취하면 state값을 바꾸고 그걸 view에 적용한다.

이 내용을 세부적으로 파본다면 아래와 같다.

![Redux 데이터 흐름](https://github.com/TeTedo/blog-code/assets/107897812/57e6274d-01a7-475d-a636-10463aac0454)

1.  사용자가 상태가 바뀌는 액션을 취하면 변경될 상태의 정보를 가진 Action 객체가 생성된다.

2.  생성된 객체는 Dispatcher 함수가 전역 상태 저장소인 store에 전달한다.

3.  store는 Reducer함수를 실행하고 발생한 상황에 따라 상태가 업데이트 된다.

4.  바뀐 State 값을 받아 View에서 다시 렌더링한다.

#### **View -> Action -> Dispatcher -> Store -> Reducer -> Store -> View**

<br />

> **Reducer가 왜 Reducer로 불리는가?**
>
> - javascript의 Array.reduce()와 같은 아이디어이기 때문에!
>
> Array.reduce()는 배열의 여러값들을 하나의 값으로 줄여준다. -> Reducer에서 이전의 값과 다음값을 합친 하나의 값을 저장
>
> 그리고 초기값이 없다면 초기값도 설정해줄 수 있다. -> Reducer 초기값 설정

### Redux 구현

> 이 예제에서는 내부데이터만 저장하는 용도로 사용할 것이므로 Redux-thunk같은 미들웨어는 사용하지 않는다.

#### **(1) counterReducer.js**

```js
const initState = { value: 0 };

export const counterReducer = (state = initState, action) => {
  if (action.type === "counter/increment") {
    return {
      ...state,
      value: state.value + 1,
    };
  }

  return state;
};

export const selectCounterValue = (state) => state.counter.value;
```

초기값과 counter의 value값을 가져올 select함수를 지정했다.

#### **(2) reducer**

```js
import { combineReducers } from "@reduxjs/toolkit";
import { counterReducer } from "./counterReducer";

const rootReducer = combineReducers({
  counter: counterReducer,
});

export default rootReducer;
```

combineReducers를 사용하여 reducer가 추가 되는 경우를 미리 고려함.

#### **(3) ConfigureStore.js**

```js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { composeWithDevTools } from "@redux-devtools/extension";

export default function config() {
  const store = configureStore({
    reducer: rootReducer,
    devTools: composeWithDevTools(),
  });

  return store;
}
```

#### **(5) store.js**

```js
import configureStore from "./configureStore";
export const store = configureStore();
```

#### **(6) index.js**

Provider 추가

```js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

#### **(9) View 추가**

```js
import React from "react";
import { store } from "..";
import { useSelector } from "react-redux";
import { selectCounterValue } from "../reducer/counterReducer";

export const ReduxCounter = () => {
  const increment = () => {
    return {
      type: "counter/increment",
    };
  };

  const clickHandler = () => {
    store.dispatch(increment());
  };

  // counter state가 바뀌면 리렌더링
  const counter = useSelector(selectCounterValue);

  return (
    <div>
      Value : {counter}
      <button onClick={clickHandler}>increment Btn</button>
    </div>
  );
};
```

---

Redux를 위와 같이 구성 후 새로운 Reducer가 추가 될때마다 함수를 새로 작성해야 한다.

Redux는 Devtools를 제공하는데 크롬 확장프로그램으로 쉽게 디버깅이 가능하다.

![Redux DevTools](https://github.com/TeTedo/blog-code/assets/107897812/4bd69f5f-22b4-4357-b5e9-fe17f2ba5747)

지금은 간단한 Reducer로 만들었지만 여기서 미들웨어도 추가되면 써야할 코드의 양이 늘어난다.

그러다보니 자연스럽게 러닝커브가 길다.

개인적으로 오랜만에 Reducer를 추가할때 어디서부터 코드를 작성해야할지 헷갈린다.

Recoil과 비교한다면 리덕스는 데브툴즈를 지원하기 때문에 디버깅이 쉽다는 장점이 있다.

---

## **2. Recoil**

Recoil은 React를 위한 상태관리 라이브러리이다.

전역 state라는 개념만 이해하면 atom 정도는 쉽게 사용할 수 있다.

React의 기본 hook인 useState와 유사한 형태를 가지고 있어 더 친숙하기도 했다.

![recoil 데이터 흐름](https://github.com/TeTedo/blog-code/assets/107897812/d8aa7a84-8e7c-442c-b0cc-7e40ded30950)

Recoil에서는 Atom이라는 상태를 공유하여 사용한다.

selector로 atom의 값을 읽어 컴포넌트로 data-flow graph를 만들수 있다.

그 과정에서 selector는 동기, 비동기로 변환할 수 있다.

### **atom**

atom은 업데이트 및 구독할수 있는 상태의 단위이다.

atom이 업데이트 된다면 atom을 구독하고 있던 컴포넌트에서도 다시 렌더링된다.

useState와 비슷하다고 느꼈다.

### **Recoil 구현**

#### **(1) index.js**

```js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./redux";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </Provider>
);
```

RecoilRoot 컴포넌트로 감싸줘서 recoil을 사용

#### **(2) countState.js**

```js
import { atom } from "recoil";

export const countState = atom({
  key: "countState",
  default: { value: 0 },
});
```

atom값을 정의한다.

#### **View 구현**

```js
import React from "react";
import { countState } from "../atom/countState";
import { useRecoilState } from "recoil";

export const RecoilCounter = () => {
  const [counter, setCounter] = useRecoilState(countState);
  const clickHandler = () => {
    setCounter({
      value: counter.value + 1,
    });
  };

  return (
    <div>
      Value : {counter.value}
      <button onClick={clickHandler}>increment Btn</button>
    </div>
  );
};
```

Recoil은 이게 끝이다.

---

## 결론

간단한 예시코드지만 Redux와 Recoil의 코드차이는 분명하게 느껴진다.

또 useState처럼 직관적으로 사용할 수 있기 때문에 좋았다.

recoil의 selector를 사용해도 코드의 양은 크게 늘어나지 않는다.

앞으로 프로젝트에서 둘중 하나를 고른다고 한다면 디버깅에 초점을 두고 원래 Redux에 대한 지식이 있는 팀이라면 Redux를 Redux를 모른다면 러닝커브가 짧은 recoil을 염두해 볼만한 것 같다.

#### 참고

[Redux의 데이터 흐름](https://velog.io/@jos9187/Redux%EC%9D%98-%EB%8D%B0%EC%9D%B4%ED%84%B0-%ED%9D%90%EB%A6%84)

[Redux 공식문서](https://redux.js.org/introduction/getting-started)

[Recoil Recoil 200 활용하기](https://velog.io/@juno7803/Recoil-Recoil-200-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0)

[Recoil 공식문서](https://recoiljs.org/docs/introduction/core-concepts)
