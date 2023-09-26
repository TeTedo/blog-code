# React 최적화

React는 부모가 렌더링 될때마다 자식들도 렌더링 되는 특징을 가지고 있다.

이러한 렌더링을 최적화하는 방법은 여러가지가 있다.

그 중 대표적인 React.memo, useMemo, useCallback을 소개하려고 한다.

## React.memo

React.memo는 props가 변하지 않으면 리렌더링을 스킵한다.

memo로 감싼 컴포넌트는 메모이제이션으로 이전 props와 새로운 props를 비교하여 같은 값이라면 리렌더링을 하지 않고 기존 컴포넌트를 반환한다.

여기서 props를 비교하는 함수로는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 를 사용하기 때문에 Object를 props로 넘기는거 보단 primitive 타입을 넘기는게 관리하기 편하다고 생각한다.

### React.memo 사용

#### sample code

> userData.json

```json
{
  "data": [
    { "id": 1, "name": "teddy", "age": 20 },
    { "id": 2, "name": "tom", "age": 24 },
    { "id": 3, "name": "max", "age": 26 }
  ]
}
```

> ReactMemo.jsx

```js
import React, { useState } from "react";
import userDataJson from "../userData.json";
import { ReactMemoDetail } from "./ReactMemoDetail";

export const ReactMemo = () => {
  const [userData, setUserData] = useState(userDataJson.data);

  const addUser = () => {
    setUserData([...userData, { id: 4, name: "temp", age: 25 }]);
  };

  return (
    <div>
      <div>ReactMemo Test</div>
      <button onClick={addUser}>유저 추가</button>

      {userData.map((user, idx) => (
        <ReactMemoDetail
          key={user.id}
          id={user.id}
          name={user.name}
          age={user.age}
        />
      ))}
    </div>
  );
};
```

> ReactMemoDetail.jsx

```js
import React from "react";

export const ReactMemoDetail = ({ id, name, age }) => {
  console.log("ReactMemoDetail rendering id : ", id);
  return (
    <div>
      <span>{id}</span>
      <span>{name}</span>
      <span>{age}</span>
    </div>
  );
};
```

![image](https://github.com/TeTedo/blog-code/assets/107897812/a6c30fa9-edbe-421c-aeca-d9ca991bbf75)

화면은 간단하게 구성했다.

![image](https://github.com/TeTedo/blog-code/assets/107897812/69647197-6b12-40c8-a81c-52530e09e7dd)

화면에 접근시 처음 3개의 컴포넌트가 생성되므로 3개의 디테일 컴포넌트가 렌더링된다.

![image](https://github.com/TeTedo/blog-code/assets/107897812/0ff1bd04-e338-4c66-897b-5536b4f54877)

유저를 추가할 경우 모든 디테일 컴포넌트가 리렌더링이 된다.

React.memo는 위와 같은 경우일때 유용하다.

미리 렌더링이 되어있던 컴포넌트의 데이터가 바뀌지 않는다면 리렌더링을 일으키지 않는 것이다.

```js
export const ReactMemoDetail = React.memo(({ id, name, age }) => {
  console.log("ReactMemoDetail rendering id : ", id);
  return (
    <div>
      <span>{id}</span>
      <span>{name}</span>
      <span>{age}</span>
    </div>
  );
});
```

위와 같이 메모이제이션을 적용할 컴포넌트를 `React.memo()` 의 파람스로 넘긴다.

![image](https://github.com/TeTedo/blog-code/assets/107897812/5ada0d05-7e2d-4bf4-aa76-68c0451179cb)

첫 렌더링은 위와 같이 3번의 렌더링이 일어난다.

![image](https://github.com/TeTedo/blog-code/assets/107897812/ed50bab5-2ec9-49d4-aab4-e0e17b9be2c0)

기존 코드와 다르게 유저를 추가한 경우 4번의 디테일 컴포넌트 콘솔만 추가된걸 볼 수 있다.

### 주의사항

React.memo가 너무 좋은 나머지 모든 컴포넌트에 적용하면 안된다.

메모이제이션을 적용하기 위해 React.memo가 적용된 컴포넌트를 메모리에 복사하여 가지고 있는다.

그리고 해당 컴포넌트가 렌더링 될때 이전값을 가진 컴포넌트가 있다면 기존의 컴포넌트를 반환하는 것이다.

이렇기 때문에 데이터가 계속 바뀌는 컴포넌트라면 메모이제이션을 적용하는 것이 오히려 메모리 낭비가 될 수 있는 것이다.

## useMemo

## useCallback

## 참고

[리액트 공식문서](https://react.dev/reference/react)
