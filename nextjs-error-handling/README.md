# Nextjs15 에러핸들링

모든 코드는 [github](https://github.com/TeTedo/blog-code/tree/main/nextjs-error-handling)에 있습니다.

## 서론

에러 핸들링은 따지자면 **에러** 핸들링과 **예외** 핸들링이 존재한다고 한다.

구분하자면 **에러** 핸들링은 컴퓨터가, **예외** 핸들링은 개발자가 의도적으로 발생시킨다.

Nextjs 프레임워크를 쓴지 얼마 안된 뉴비 입장에서 이런 핸들링이 문득 궁금했다.

내가 생각하는 이상적인 에러 핸들링은 에러 발생 후 얼마만큼 자연스럽게 처리되는가 이다.

모든 경우를 세분화하여 예외처리하면 좋겠지만 하다보면 예상치 못한 에러들이 발생할 수 있고 이를 얼마만큼 매끄럽게 처리하냐가 관건이라고 생각한다.

그래서 예상치 못한 에러도 잡고 내가 정의한 예외들을 어떻게 nextjs 에서 녹여낼수 있을까 하는 생각으로 찾아봤다.

에러와 관련하여 react 측에는 ErrorBoundary 라는 컴포넌트가있고 react-error-boundary 라는 라이브러리도 있다.

next 공식문서의 error 처리와 react 측의 ErrorBoundary를 참고하여 에러 핸들링을 하는것이 목표이다.

## [Next 공식문서의 Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-expected-errors-from-server-actions)

Nextjs 에서는 에러를 크게 2가지로 분류한다.

- expected errors (예상되는 에러들)
- uncaught exceptions (잡지못한 예외들)

보다시피 Next 에서는 에러와 예외의 개념을 분리해서 사용하고 있는걸 알수 있다. (사실 난 이글 쓰면서 알게됨..)

```
Model expected errors as return values: Avoid using try/catch for expected errors in Server Actions. Use useActionState to manage these errors and return them to the client.

Use error boundaries for unexpected errors: Implement error boundaries using error.tsx and global-error.tsx files to handle unexpected errors and provide a fallback UI.
```

뭐 대충 서버측에서 예상할수 있는에러면 try/catch 보다 useActionState를 쓰고 예상치 못한 에러들은 error boundary 써라 라는거 같다.

### 1. expected errors

Next 에서는 예시로 서버측액션을 들었다.

```js
"use server";

import { redirect } from "next/navigation";

export async function createUser(prevState: any, formData: FormData) {
  const res = await fetch("https://...");
  const json = await res.json();

  if (!res.ok) {
    return { message: "Please enter a valid email" };
  }

  redirect("/dashboard");
}
```

```js
"use client";

import { useActionState } from "react";
import { createUser } from "@/app/actions";

const initialState = {
  message: "",
};

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState);

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite">{state?.message}</p>
      <button disabled={pending}>Sign up</button>
    </form>
  );
}
```

이 코드들을 상상해보면 잘못된 email을 적으면 message를 보여주는것 같다.

이거로 백엔드 서버와 통신할때 예외처리를 할 수 있겠다는 생각이 든다.

useActionState 자체의 자세한 설명은 생략한다.

### 2. uncaught exception

내가 처리해주지 못한 예외 즉 정상적이지 않게 생긴 에러들이다.

일반적으로 error.tsx 파일을 만들어서 예러 처리를 해주고 global-error.tsx 를 만들어서 전역으로 처리해줄수 있다고 한다.

error.tsx 작동방식은 다음에 알아보겠다..

error.tsx 파일은 React에서 클라이언트 사이드의 ErrorBoundary를 이용하기 때문에 클라이언트 컴포넌트여야 한다. ("use client")

예시코드는 [공식문서](https://nextjs.org/docs/app/building-your-application/routing/error-handling)에서 가져왔다.

```ts
"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
```

이런식으로 작성하면 props로 error 와 reset이 들어오게 되는데 reset 함수를 실행시키면 error를 null로 만들어 기존의 컴포넌트 트리를 다시 렌더링한다.

다시 컴포넌트를 렌더링시키기 때문에 '다시 시도' 가 되는것이다.

이 error.tsx는 같은 레벨에 정의되어 있지 않다면 부모의 error.tsx 를 실행시킨다고 한다.

![img](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Fnested-error-component-hierarchy.png&w=3840&q=75)

출처 : [nextjs 공식문서](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

일반적으로 최상위 layout은 global-error.ts 를 사용한다고 한다.

```ts
"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

global-error 의 특이점은 html 태그가 들어가야 한다는 점이다.

error 가 발생했을때 기존 컴포넌트가 아닌 에러 컴포넌트를 렌더링 시키기 때문이다.

여기까지 에러처리 방법이다.

## 적용

위 내용을 기반으로 에러핸들링을 샘플코드로 적용시켜보자.

- 각 페이지에서 에러 발생 -> error.tsx
- 예상치 못한 에러 -> global-error.tsx

### 1. Error 맛보기

- app/product/page.tsx

```ts
export default function Page() {
  throw new Error("에러다 이놈아");
}
```

- app/product/error.tsx

```ts
"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("에러 발생", error);
    console.log("cause : ", error.cause);
    console.log("digest : ", error.digest);
    console.log("name : ", error.name);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
```

error 안에있는 값들을 전부 로그로 찍어봤다.

출력 결과 - 서버와 브라우저 로그에 둘다 남았다.

![img](https://github.com/user-attachments/assets/483d90d1-d0b7-4963-b4d6-cc6870543880)

![img](https://github.com/user-attachments/assets/2ec974b9-aacb-4c90-a964-6b977ca17348)

여기서 digest 값은 서버에서 발생한 에러인지를 판단하는 값이라고 한다. 'digest = undefined' 이면 클라이언트에서 발생한것이다.

### 2. 커스텀 에러 만들기

내가 원하는건 커스텀으로 에러를 만들어서 던지는것이다. 해보자

- app/product/page.tsx

```ts
class ProductError extends Error {
  constructor(message: string, name: string, cause: string) {
    super(message);
    this.name = name;
    this.cause = cause;
  }
}

export default function Page() {
  throw new ProductError(
    "에러다 이놈아",
    "이름은 ProductError",
    "이것이 원인이다"
  );
}
```

- 서버

![img](https://github.com/user-attachments/assets/667b32f1-fd5d-4115-967c-503fe9a4bdd2)

- 브라우저

![img](https://github.com/user-attachments/assets/56174dd0-7011-4823-ace9-a6388af124dd)

특이점은 서버로그에는 cause가 나오지만 브라우저에서는 안나온다는 것이다.

page.tsx를 클라이언트 컴포넌트로 바꾼후 보니 브라우저에서도 cause를 출력한다. ("use client" 추가)

서버 컴포넌트에서 발생한 에러는 보안상 cause를 안넘긴다고 한다.

### 3. 에러 전파

error.tsx 에서 product error 인 경우에는 상위로 throw 해보자.

내 예상으로는 root 에 global-error.tsx 가 받아줄것이라고 예상한다. 해보자

- app/product/error.tsx - 코드 추가

```ts
if (error instanceof ProductError) {
  throw error;
}
```

- app/global-error.tsx

```ts
"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("에러 발생 - global", error);
    console.log("cause - global : ", error.cause);
    console.log("digest - global : ", error.digest);
    console.log("name - global : ", error.name);
  }, [error]);

  return (
    <html>
      <body>
        <div>
          <h2>글로발 도착완</h2>
          <div>{error.message || "예상치 못한 에러입니다."}</div>
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
```

기존 error.tsx 와 별반 다를꺼 없지만 html 태그가 추가된다

근데 이게 웬걸 global-error 에서 못잡네? 잡아준대매..

![img](https://github.com/user-attachments/assets/2fb79f09-b600-4381-9e7a-cce36fcb0825)

이것저것 찾아보다가 다시 공식문서 정독해보니 한줄을 놓치고 있었다..

![img](https://github.com/user-attachments/assets/d716a8af-9488-4e07-a495-6b2f04b9e667)

개발모드에서는 error overlay가 대신 뜬다는디?? -> 이거 확인하려고 vercel 에 연결해서 배포해봄

아 그냥 로컬에서 빌드하고 실행시켰으면 됬었네..

page에서 그냥 throw error 를 하면 빌드가 안되서 다른 방식으로 처리했다.

- app/product/[id]/page.tsx

```ts
import { ProductError } from "../product-error";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "error") {
    throw new ProductError("에러 발생", "ProductError", "ProductError Cause");
  }

  return <h1>Product: {id}</h1>;
}
```

http://localhost:3000/product/error 접속 결과 global-error.tsx 에서 잘 잡는다.

추가로 global-error.tsx는 루트에 있는 layout의 에러도 잡는다고 한다.

### 4. 커스텀 에러 정리

- app/product/layout.tsx

```ts
export enum ProductErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  PRODUCT_ERROR = "PRODUCT_ERROR",
}

const ProductErrorMessages: Record<ProductErrorType, string> = {
  [ProductErrorType.VALIDATION_ERROR]: "유효성 검사 오류가 발생했습니다",
  [ProductErrorType.NOT_FOUND_ERROR]: "요청한 리소스를 찾을 수 없습니다",
  [ProductErrorType.SERVER_ERROR]: "서버 오류가 발생했습니다",
  [ProductErrorType.PRODUCT_ERROR]: "프로덕트 에러가 발생했습니다",
};

export class ProductError extends Error {
  type: ProductErrorType;
  cause: string;

  constructor(type: ProductErrorType, cause: string) {
    super(ProductErrorMessages[type]);
    this.type = type;
    this.cause = cause;
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

- app/product/page.tsx

```ts
"use client";

import { ProductError, ProductErrorType } from "./layout";

export default function Page() {
  throw new ProductError(ProductErrorType.PRODUCT_ERROR, "원인이야~");
}
```

- app/product/error.tsx

```ts
"use client"; // Error boundaries must be Client Components

import { ProductError, ProductErrorType } from "./layout";

export default function Error({
  error,
  reset,
}: {
  error: ProductError & { digest?: string };
  reset: () => void;
}) {
  if (!(error instanceof ProductError)) {
    throw error;
  }
  return (
    <>
      {error.type === ProductErrorType.PRODUCT_ERROR && (
        <div>
          <h2>다른에러는 안보임</h2>
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </button>
        </div>
      )}
    </>
  );
}
```

이런식으로 내가 커스텀에러를 만들어서 throw 하면 error.tsx 에서 에러별로 화면을 지정해줄수 있다.

한가지 이슈는 서버측 에러, 이벤트 핸들러 안에서의 에러는 이런식으로 잡지 못한다.

서버에서 클라이언트로 직렬화 하는데 이슈가 있다고 한다.

이벤트 핸들러는 [리액트측에서 설계해놨다고함](https://legacy.reactjs.org/docs/error-boundaries.html#how-about-event-handlers).

한가지 대안점으로 이벤트 핸들러에서 에러가 발생하면 state 값을 갱신해 리렌더링시켜서 에러를 throw 하는 방법이 있다.

```ts
"use client";

import { useState } from "react";
import { ProductError, ProductErrorType } from "./layout";

export default function Page() {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error;
  }

  return (
    <div
      onClick={() =>
        setError(new ProductError(ProductErrorType.PRODUCT_ERROR, "원인이야~"))
      }
    >
      <div>gg</div>
    </div>
  );
}
```

## 결론

- 클라이언트 + 이벤트핸들러 -> 커스텀에러 처리
- 서버 -> useActionState 처리

## 참고

- [Next Error Handling 공식문서](https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-expected-errors-from-server-actions)
