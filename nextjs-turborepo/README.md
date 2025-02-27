# Nextjs 모노레포 구성 (turborepo)

모노레포로 구성하면 좋은점들이 많다.

나는 코드를 다른 프로젝트와 공유할수 있다는 점이 가장 매력적으로 느낀다.

turborepo로 모노레포를 구성해 보겠다.

난 npm 10.9.0 환경으로 진행한다.

```bash
npx create-turbo@latest
```

프로젝트 이름 입력후 패키지매니저 선택후 끝!

나는 설치하다가 실패 어쩌구 권한 어쩌구 떠서 아래 명령어 실행함

```bash
sudo chown -R 501:20 [npm 경로]
```

실행 후 apps 폴더에 docs 와 web 프로젝트가 보인다.

아래 packages 폴더에는 공통으로 쓰는 코드들로 보인다.

docs 프로젝트로 들어가 page.tsx 에서 Button을 import 해온 경로를 보면 알 수 있다.

```ts
import { Button } from "@repo/ui/button";
```

나머지 설정들은 다 되어있어서 편하다.

admin 프로젝트를 추가해보자.

```bash
# 루트 경로에서 실행
mkdir -p apps/admin
cd apps/admin
npx create-next-app@latest .
```

하고 다른 프로젝트에서 package.json 배껴와서 구성

```json
{
  "name": "web",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/ui": "*",
    "next": "^15.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@repo/eslint-config": "*",
    "@repo/typescript-config": "*",
    "@types/node": "^22",
    "@types/react": "19.0.8",
    "@types/react-dom": "19.0.3",
    "eslint": "^9.21.0",
    "typescript": "5.7.3"
  }
}
```

그리고 admin 폴더에서 npm run dev 했더니 그냥 되네. 이게 되네

그리고 dependencies 에서 "@repo/ui": "\*", 요부분으로 공통 코드 부분을 가져올수 있다.

끝!
