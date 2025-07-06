# ZK - STARKNET SEPOLIA에 배포해보기

## 0. 환경 설정

배포 전 로컬에서 배포를 진행해 볼건데 관련 환경설정은 아래에서 한다.

[starknet environment-setup](https://docs.starknet.io/guides/quickstart/environment-setup/)

## 1. 프로젝트 생성

```
scarb new deploy
```

모든 명령어는 deploy 폴더에서 진행된다.

## 2. Local 배포

Local devnet 띄우기

```bash
starknet-devnet --seed=0
```

이러면 devent 이 세팅되고 지갑주소들이 보인다.

그중 하나를 선택해서 address와 private key를 입력하면된다.

```bash
sncast account import \
    --address=0x064b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691 \
    --type=oz \
    --url=http://127.0.0.1:5050 \
    --private-key=0x0000000000000000000000000000000071d7bb07b9a64f6f78ac4c816aff4da9 \
    --add-profile=devnet \
    --silent
```

결과

```bash
command: account import
account_name: account-1
add_profile: Profile devnet successfully added to snfoundry.toml
```

그러면 snfoundry.toml 파일에 추가된다.

```toml
[sncast.devnet]
account = "account-1"
accounts-file = "{경로}/.starknet_accounts/starknet_open_zeppelin_accounts.json"
url = "http://127.0.0.1:5050"

```

배포하기전에 컴파일된 코드를 네트워크에 먼저 제출해야 한다. 이 과정을 declare 라고 한다.

```bash
sncast --profile=devnet declare \
    --contract-name=HelloStarknet
```

명령어를 실행하면 compile 하고 class_hash 와 transaction_hash 가 생성된다.

```bash
   Compiling deploy v0.1.0 ({작고 소중한 내 경로}/deploy/Scarb.toml)
    Finished `release` profile target(s) in 6 seconds
[WARNING] Profile devnet does not exist in scarb, using 'release' profile.
command: declare
class_hash: 0x0344d356a0ac8f4d35ee8c5bc89b421e3e6f55fa5f03849d92910f6c1630f9ae
transaction_hash: 0x01318d76ee9b4973767151c94e15f10ea8c08b158ed60412df5c73da2143745c

To see declaration details, visit:
class: https://sepolia.starkscan.co/class/0x0344d356a0ac8f4d35ee8c5bc89b421e3e6f55fa5f03849d92910f6c1630f9ae
transaction: https://sepolia.starkscan.co/tx/0x01318d76ee9b4973767151c94e15f10ea8c08b158ed60412df5c73da2143745c
```

여기서 class hash는 컨트랙트의 클래스 해시라고 한다. 배포할때 쓰인다고 함.

배포

```bash
sncast --profile=devnet deploy \
    --class-hash=0x0344d356a0ac8f4d35ee8c5bc89b421e3e6f55fa5f03849d92910f6c1630f9ae \
    --salt=0
```

결과

```bash
command: deploy
contract_address: 0x048e14287b783120c33c1f63a12fdae883f5197ffbbc7d0ecde7060ec3494ad4
transaction_hash: 0x06fe8b71ef34f4323ef2018c75f69904bb8b0ba3edf1d4983e6ae0cb1b89bf95
```

스마트 컨트랙트 호출해보기 - contract address 부분만 바꿔주면 된다.

```bash
sncast --profile=devnet call \
    --contract-address=0x048e14287b783120c33c1f63a12fdae883f5197ffbbc7d0ecde7060ec3494ad4 \
    --function=get_balance
```

결과

```
command: call
response: 0x0
response_raw: [0x0]
```

상태값 바꿔보기 - invoke 라고 한다.

```bash
sncast --profile=devnet invoke \
    --contract-address=0x048e14287b783120c33c1f63a12fdae883f5197ffbbc7d0ecde7060ec3494ad4 \
    --function=increase_balance \
    --arguments=42
```

결과

```bash
command: invoke
transaction_hash: 0x06d81096712b6973731cab80ed7eaa9fec0867225fb552f881a4574a6382c95e
```

다시 balance를 조회해보면 값이 늘어나있는걸 볼수 있다. hex 값으로 제공되는듯.

```bash
command: call
response: 0x2a
response_raw: [0x2a]
```

## 3. sepolia 에 배포해보기

account create 후 deploy 까지 필요하다. 나는 agent x 라는 지갑에서 계정 생성후 배포했다.

```bash
sncast account create \
    --network=sepolia \
    --name=sepolia
```

sncast accont list 로 account 확인 가능

create -> deploy 하면 된다. STRK 를 가스비로 사용해서 faucet을 받아야한다.

[starknet sepolia faucet](https://starknet-faucet.vercel.app/)

```bash
sncast account deploy \
    --network sepolia \
    --name sepolia
```

나의 경우에는 agent x 라는 지갑에 sepolia 네트워크에서 지갑을 생성 후 배포해줬다. - 계정 상세정보에 deploy account 메뉴 있음.

![Image](https://github.com/user-attachments/assets/ad2e2fd4-2d90-4ef1-bc95-eae97fafb101)

deploy account 를 성공하면 View on Voyager 메뉴가 생긴다. 거기에 들어가면 class hash 를 가져올수 있다.

account import

```bash
sncast account import \
    --address=address \
    --private-key=privatekey \
    --class-hash=classhash \
    --network sepolia \
    --silent \
    --type=oz \
    --name sepolia
```

먼저 devnet과 똑같이 declare를 먼저 해준다.

```bash
sncast --account=sepolia declare \
    --contract-name=HelloStarknet \
    --network=sepolia
```

결과

```bash
    Finished `release` profile target(s) in 5 seconds
command: declare
error: Transaction execution error = TransactionExecutionErrorData { transaction_index: 0, execution_error: Message("Class with hash 0x0344d356a0ac8f4d35ee8c5bc89b421e3e6f55fa5f03849d92910f6c1630f9ae is already declared.") }
```

누군가 이미 declare 했다고한다. 바이트코드로 컴파일 시킨걸 제출한것이므로 이미 존재할 가능성도 있다.

배포

```bash
sncast --account=sepolia deploy \
    --class-hash=0x0344d356a0ac8f4d35ee8c5bc89b421e3e6f55fa5f03849d92910f6c1630f9ae \
    --network=sepolia
```

결과

```bash
command: deploy
contract_address: 0x06445b2f04abaab412ea6881978415bfa4b5b7ee9439ae6e2af9b76c44f8c575
transaction_hash: 0x06c88270d8f165219de7b9986fae0efb90f5760f094bd10d082123cbc0576aab

To see deployment details, visit:
contract: https://sepolia.starkscan.co/contract/0x06445b2f04abaab412ea6881978415bfa4b5b7ee9439ae6e2af9b76c44f8c575
transaction: https://sepolia.starkscan.co/tx/0x06c88270d8f165219de7b9986fae0efb90f5760f094bd10d082123cbc0576aab
```

![Image](https://github.com/user-attachments/assets/c46f211c-8585-420a-87ab-f1160fbbd600)

내 agent x 계정으로 배포한것 확인

마지막으로 call, invoke 까지 해보자.

increase balance

```bash
sncast --account=sepolia invoke \
    --contract-address=0x06445b2f04abaab412ea6881978415bfa4b5b7ee9439ae6e2af9b76c44f8c575 \
    --function=increase_balance \
    --arguments=66 \
    --network=sepolia
```

결과

```bash
command: invoke
transaction_hash: 0x01401c177bdef1f7cbd07f864af43a6aeccad78dd7dcb06383f8b9980a7edb05

To see invocation details, visit:
transaction: https://sepolia.starkscan.co/tx/0x01401c177bdef1f7cbd07f864af43a6aeccad78dd7dcb06383f8b9980a7edb05
```

get balance

```bash
sncast call \
    --contract-address=0x06445b2f04abaab412ea6881978415bfa4b5b7ee9439ae6e2af9b76c44f8c575 \
    --function=get_balance \
    --network=sepolia
```

결과

```bash
command: call
response: 0x42
response_raw: [0x42]
```

sepolia 에 배포 성공
