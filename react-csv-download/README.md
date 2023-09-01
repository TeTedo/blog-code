# React-CSV-Download + React recoil

## react-csv를 선택한 이유

여러 라이브러리중 react-csv를 선택한 이유는 사용이 간편해보여서이다.

react-csv의 마지막 업데이트는 2022년 1월이지만 지금도 문제없이 사용된다.

추후 react와의 호환성이나 csv파일과의 호환성에 문제가 생긴다면 대처가 늦을수 있겠지만 추후 고민해보려고 한다.

## react-csv 사용

### Install

```
npm install react-csv --save;
```

### Import

```
import { CSVLink, CSVDownload } from "react-csv";
```

> CSVLink : 클릭시 다운로드
>
> CSVDownload : 마운트시 다운로드

보통 다운로드 버튼으로 구현을 하기 때문에 CSVLink만 사용할 것이다.

Import 후 해당 컴포넌트를 사용하면 끝이다.

```js
<CSVLink header={csvHeader} data={csvData}>
  Download me
</CSVLink>;
// or
<CSVDownload header={csvHeader} data={csvData} target="_blank" />;
```

### Header

Header로 넣어줄 값과 data를 넣어줄 key값을 정의해야 한다.

```js
csvHeader = [
  { label: "First Name", key: "firstname" },
  { label: "Last Name", key: "lastname" },
  { label: "Email", key: "email" },
];
```

label값이 실제로 적히게 되고 key값은 data를 넣기 위한 값이라고 보면 된다.

### Data

data에 들어가는 양식은 array로 넣어도 되고 string 으로 넣어도 된다.

header의 키값과 매칭되게 작성만 하면 된다.

#### 1. array로 넣기

```js
csvData = [
  ["firstname", "lastname", "email"],
  ["Ahmed", "Tomi", "ah@smthing.co.com"],
  ["Raed", "Labes", "rl@smthing.co.com"],
  ["Yezzi", "Min l3b", "ymin@cocococo.com"],
];
```

```js
csvData = [
  { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
  { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
  { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" },
];
```

#### 2. string으로 넣기

string으로 넣을때는 json2csv라는 서드파티 라이브러리를 사용해야 한다.

```js
data = `firstname,lastname
Ahmed,Tomi
Raed,Labes
Yezzi,Min l3b
`;

// or using 3rd party package
import json2csv from "json2csv";
data = json2csv(arrayOfLiteralObjects);
```

## react에서 예시

```js
import { CSVLink } from "react-csv";
import "./App.css";

const headers = [
  { label: "First Name", key: "details.firstName" },
  { label: "Last Name", key: "details.lastName" },
  { label: "Job", key: "job" },
];

const data = [
  { details: { firstName: "Ahmed", lastName: "Tomi" }, job: "manager" },
  { details: { firstName: "John", lastName: "Jones" }, job: "developer" },
];

function App() {
  return (
    <div className="App">
      <CSVLink data={data} headers={headers}>
        다운로드 버튼
      </CSVLink>
    </div>
  );
}

export default App;
```

다운로드 버튼을 클릭하면 아래 이미지와 같이 csv가 다운로드 된다.

![image](https://github.com/TeTedo/blog-code/assets/107897812/6c3623db-87c7-4859-819c-d6c470aca3f3)

여기까지가 공식문서에서 제공하는 예시이다.

실제로는 더 복잡한 과정이 있기 때문에 각자 커스텀해서 써야할 것이다.

그리고 react-csv 문서에 들어가보면 설정할 수 있는 옵션들도 많으니 보고 하면 된다.

지금부터는 내가 실제로 사용한 예시를 작성하려고 한다.

## recoil + react-csv 활용

다운로드 버튼 클릭시 recoil에 있는 값을 csv로 다운받는 기능을 만드려고 한다.

CSVLink는 클릭시 작동되는 컴포넌트이다.

이를 useRef에 담아 클릭시 useRef.current.link.click()으로 CSVLink에 존재하는 a태그의 링크로 클릭한다.

### recoil install

```
npm install recoil
```

### recoil Root 설정

```js
// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);

reportWebVitals();
```

### recoil state 설정

```js
// downloadDataState.js

import { atom } from "recoil";

export const dataState = atom({
  key: "downloadData",
  default: {
    headers: [
      { label: "First Name", key: "details.firstName" },
      { label: "Last Name", key: "details.lastName" },
      { label: "Job", key: "job" },
    ],
    data: [
      { details: { firstName: "Ahmed", lastName: "Tomi" }, job: "manager" },
      { details: { firstName: "John", lastName: "Jones" }, job: "developer" },
    ],
  },
});
```

```js
// App.js
import { useRef } from "react";
import { CSVLink } from "react-csv";
import { useRecoilValue } from "recoil";
import "./App.css";
import { dataState } from "./downloadDataState";

function App() {
  const csvRef = useRef();
  const downloadData = useRecoilValue(dataState);

  const csvDownloadHandler = () => {
    csvRef.current.link.click();
  };
  return (
    <div className="App">
      <div onClick={csvDownloadHandler}>진짜 다운로드 버튼</div>
      <CSVLink
        data={downloadData.data}
        headers={downloadData.headers}
        hidden={true}
        ref={csvRef}
      />
    </div>
  );
}

export default App;
```

CSVLink의 클릭시점을 조절하여 값을 전달한다.

### 참고

[react-csv npm 문서](https://www.npmjs.com/package/react-csv)

[react-csv github](https://github.com/react-csv/react-csv#readme)
