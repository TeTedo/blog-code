# ZK - Noir 시작해보기

## 서론

영지식 증명 교육 프로그램을 듣게 되었는데 cairo, noir, halo2 중에 하나를 선택해 예시 코드를 짜보라는 과제를 받았다.

셋다 처음들어보고 뭔지 모르지만 무지성 돌격하는편..

gpt 한테 입문자에게 젤 만만한게 뭔지 물어보니 noir 라고 한다.

그래서 일단 웹 언어에 익숙하기 때문에 예제 프로젝트를 따라해보며 이해해보려고 한다.

## 1. Noir 설치

```bash
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
```

```bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1423  100  1423    0     0  57270      0 --:--:-- --:--:-- --:--:-- 59291
Installing noirup...
######################################################################## 100.0%

Detected your preferred shell is zsh and added noirup to PATH. Run 'source ~/.zshrc' or start a new terminal session to use noirup.
Then, simply run 'noirup' to install Nargo.
```

나는 zsh 을 쓰는데 적용하기 위해서 **source ~/.zshrc** 명령어를 실행하라고 한다. noirup 이라는 명령어를 쓰기 위함.

```
source ~/.zshrc
```

그다음 최신 nightly 버전을 받아준다.

```
noirup --version nightly
```

## 2. 프로젝트 시작

예제로 있는 프로젝트는 나이를 증명하는 프로젝트다.

예를 들면 20세이상만 들어갈수 있는 술집에 내 실제나이는 밝히지 않고 20세 이상인지만 증명하는 것이다.

root 프로젝트 생성후

```bash
yarn add @noir-lang/noir_js@1.0.0-beta.6 @aztec/bb.js@0.84.0
```

```bash
mkdir -p circuit/src
touch circuit/src/main.nr circuit/Nargo.toml
```

main.nr - 자동완성 따위도 없는 nr 파일 야생이다

```nr
fn main(age: u8) {
  assert(age >= 20);
}
```

Nargo.toml

```
[package]
name = "circuit"
type = "bin"
```

circuit 폴더 들어가서 compile - 공식문서 예제에 circuits로 오타난거 킹받네

```
cd circuit
nargo compile
```

compile 하면 target 폴더가 생기고 circuit.json 파일이 생긴다. 그래서 이게 뭔데 ㅡㅡ

```json
{
  "noir_version": "1.0.0-beta.7+f645c2892dff4b4a15d58cecfc4f7cc406424720",
  "hash": "5850458033700657672",
  "abi": {
    "parameters": [
      {
        "name": "age",
        "type": { "kind": "integer", "sign": "unsigned", "width": 8 },
        "visibility": "private"
      }
    ],
    "return_type": null,
    "error_types": {}
  },
  "bytecode": "H4sIAAAAAAAA/7VTWwrDIBCMJqVtQr96kV0fif71Kg019z9CI11BFpuf6MAyyi7DOKrofpB7XWgt9uqJI257DdkcR5p7EcM5YD2tEAp262gjgCxkIHmAkgLM0TcMTMNsTFhUQI1vUH51FoxdZ4cOrbMf5bQOzrjFr34Bj0YH3KzXYYsAFBW0NjImG10kf3BnfYqKdxG1BubzCPkni7gTj1m/r+dPJf2pjT5cC2ccs/XEeukTDd3/bPheMj6aFQe6j0IvaT6Jc7/pHF+/t959NQUAAA==",
  "debug_symbols": "dZDdCoMwDIXfJde98Gdjw1cZQ2qNUghtie1giO++WHRzF96cNDn9kqYz9NilsbVu8BM0jxk6tkR2bMkbHa13Up0XBXvaRkaUEhx8oYJmdBEal4gUvDSlfGkK2uUYNYtbKEDXS5SGgyVcT4v60cU5Wt03tr594avQT8m0sfz3XiihKRVUWeusF9Flbc9Wd4TbVkNy5rBkfIfd2b8hsDfYJ8Z1QPZk5Ac=",
  "file_map": {
    "50": {
      "source": "fn main(age: u8) {\n  assert(age >= 18);\n}",
      "path": "{작고소중한 내 경로}/blog-code/zk-start-noir/circuit/src/main.nr"
    }
  },
  "names": ["main"],
  "brillig_names": ["directive_integer_quotient"]
}
```

다시 상위폴더로 돌아가서 이제 html 이랑 Js 를 만들어본다.

```
touch index.html index.js
```

index.html

```html
<!DOCTYPE html>
<head>
  <style>
    .outer {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .inner {
        width: 45%;
        border: 1px solid black;
        padding: 10px;
        word-wrap: break-word;
    }
  </style>
</head>
<body>
  <script type="module" src="/index.js"></script>
  <h1>Noir app</h1>
  <div class="input-area">
    <input id="age" type="number" placeholder="Enter age" />
    <button id="submit">Submit Age</button>
  </div>
  <div class="outer">
    <div id="logs" class="inner"><h2>Logs</h2></div>
    <div id="results" class="inner"><h2>Proof</h2></div>
  </div>
</body>
</html>
```

아래는 공식문서에 있는 얘기 -

```
It could be a beautiful UI... Depending on which universe you live in.
```

## 레퍼런스

- [Noir getting_started](https://noir-lang.org/docs/getting_started/noir_installation)

- [Noir tutorials](https://noir-lang.org/docs/tutorials/noirjs_app)
