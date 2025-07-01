# ZK - Noir 시작해보기

모든 코드는 [깃허브](https://github.com/TeTedo/blog-code/tree/main/zk-start-noir)에서 볼수 있습니다.

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

예를 들면 20세이상만 들어갈수 있는 술집에 내 실제나이는 밝히지 않고 20세 이상인지만 증명하는 것이다. 라고 설명에 되어있음

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

![Image](https://github.com/user-attachments/assets/9148f991-1de7-4de2-8a81-0763d82721dd)

아래는 공식문서에 있는 얘기 - 어느세계에서 봐야 아름다울수 있는걸까.. 귀찮다는 얘기를 잘도 써놨군.

거의 몇년만에 이놈 덕분에 vscode live server 를 쓰는군 추억의 html

```
It could be a beautiful UI... Depending on which universe you live in.
```

index.js

```js
const show = (id, content) => {
  const container = document.getElementById(id);
  container.appendChild(document.createTextNode(content));
  container.appendChild(document.createElement("br"));
};

document.getElementById("submit").addEventListener("click", async () => {
  try {
    // noir goes here
  } catch {
    show("logs", "Oh 💔");
  }
});
```

그래서 뭐 어쩌라고.. 이걸로 뭐하라고.. 는 뒤에 또 코드 추가할게 있네 - 한번에 줘라 팍-시

```js
import { UltraHonkBackend } from "@aztec/bb.js";
import { Noir } from "@noir-lang/noir_js";
import circuit from "./circuit/target/circuit.json";
```

console 에서 404 뜨는거 실화냐

```bash
GET http://127.0.0.1:5500/index.js net::ERR_ABORTED 404 (Not Found)
```

일단 해보자..

다음은 울트라 백엔드 추가 - 기존에 있던 try 문 안에 넣으라는듯

```js
try {
const noir = new Noir(circuit);
const backend = new UltraHonkBackend(circuit.bytecode);
}
```

요놈도 추가

```js
const age = document.getElementById("age").value;
show("logs", "Generating witness... ⏳");
const { witness } = await noir.execute({ age });
show("logs", "Generated witness... ✅");

show("logs", "Generating proof... ⏳");
const proof = await backend.generateProof(witness);
show("logs", "Generated proof... ✅");
show("results", proof.proof);
```

vite config 추가

```bash
touch vite.config.js
```

```js
export default {
  optimizeDeps: {
    esbuildOptions: { target: "esnext" },
    exclude: ["@noir-lang/noirc_abi", "@noir-lang/acvm_js"],
  },
};
```

드디어 실행

```js
yarn dlx vite
```

```
yarn run v1.22.22
warning package.json: No license field
error Command "dlx" not found.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

yarn version 이 낮네.. 귀찮아서 npx vite 로 실행

```bash
npx vite
```

얘네들도 ui가 부끄러웠나봄

```
You should now see the worst UI ever, with an ugly input.
```

코드하나 더 넣고 input 에 암거나 넣어보자

```js
show("logs", "Verifying proof... ⌛");
const isValid = await backend.verifyProof(proof);
show("logs", `Proof is ${isValid ? "valid" : "invalid"}... ✅`);
```

성공 결과

![Image](https://github.com/user-attachments/assets/a3d90e7b-47d7-401a-b62e-95514c0180e9)

실패 결과

![Image](https://github.com/user-attachments/assets/cca2110d-1aeb-473c-b80b-41ca5dab105d)

## 3. 그래서 저기 Proof 쪽에 뜨는건 뭐임

일단 실패하면 어떤 메시지가 뜨는지 궁금해서 catch 문에서 error 출력해봤다.

```js
catch (e) {
  show("logs", e);
  show("logs", "Oh 💔");
}
```

![Image](https://github.com/user-attachments/assets/dbfb246b-bc76-4c6f-aac8-baf056808130)

먼저 noir 에서 witness(증인)를 생성한다

```js
const { witness } = await noir.execute({ age });
```

이 과정은 사용자의 입력을 받아 나이가 20살이 넘는다 라는걸 증명해주는 증인이라고 이해했다.

그다음 이 증인을 데려가서 proof 라는 증명을 만든다.

witness(증인)은 내 나이를 입력받아 만들어진것으로 내 나이를 안다.

그래서 내 나이를 숨기기위해 proof를 만든다고 이해했다.

```js
const proof = await backend.generateProof(witness);
```

이 증명을 가지고 다니면서 내가 20살이 넘는다 라는걸 입증할수 있다.

```js
const isValid = await backend.verifyProof(proof);
```

결론적으로 Proof 쪽에 뜨는건 내 proof 의 바이트코드이다.

## 레퍼런스

- [Noir getting_started](https://noir-lang.org/docs/getting_started/noir_installation)

- [Noir tutorials](https://noir-lang.org/docs/tutorials/noirjs_app)
