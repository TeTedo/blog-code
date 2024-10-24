# React Modal 어디까지 만들어봤니?

모든 코드는 [github](https://github.com/TeTedo/blog-code/tree/main/react-modal)에 있습니다.

## 서론

나는 개인적으로 모달창을 좋아한다.

페이지 이동없이 내가 의도한대로 데이터를 전달받을수 있고 다른 화면을 클릭하면 모달이 꺼지는등 키고 끄는 동작을 간편하게 설정할 수 있기 때문이다.

<img src="https://github.com/user-attachments/assets/de0fe426-f351-4b59-9535-3094a6107509" alt="image" width="300" />

backdrop-filter에 blur를 설정하여 위와 같이 모달에 집중하게 할 수 도있고 아닐수도 있다.

지금까지 간단히 모달을 띄우는 작업을 하다가 복잡한 모달의 요청을 받아서 하나의 리액트 훅으로 처리했던 코드를 공유하려고 한다.

## 요구 사항

- 모달이 아닌 부분 클릭하면 '작성 중이던 글을 취소하시겠습니까?' 라는 새로운 모달 띄우고 닫기 or 유지하기

- 모달 step 만들기 - 1단계 -> 2단계 -> 3단계 (완료)

단일 모달만 만들어본 나에게는 모달지옥처럼 보였고 이를 깔끔하게 정리하고 싶어서 훅을 만들게 되었다.

## 개발

### 1. 필요한 라이브러리 설치

```bash
npm i styled-components
npm i --save -dev @types/styled-components
```

- typescript를 사용한다.

### 1. BaseModal

먼저 Modal의 root가 되는 BaseModal 을 만든다.

BaseModal은 React Node를 받으며 받은 컴포넌트를 모달로 띄우는 컴포넌트이다.

필요에 따라 모달을 닫을때 콜백 함수도 받을수 있고 backdrop-filter 등 커스텀해서 받으면 된다.

```ts
interface IBaseModalProps {
  closeCallBack: () => void;
  children: ReactNode;
  isBackgroundBlack: boolean;
}

export const BaseModal = ({
  closeCallBack,
  children,
  isBackgroundBlack,
}: IBaseModalProps) => {
  const closeHandler = (event: React.MouseEvent) => {
    if (event.currentTarget === event.target) {
      closeCallBack();
    }
  };

  return (
    <Wrapper
      $isBackgroundBlack={isBackgroundBlack}
      onClick={(event) => {
        event.preventDefault();
        closeHandler(event);
      }}
    >
      {children}
    </Wrapper>
  );
};
```

```ts
export const Wrapper = styled.div<{
  $isBackgroundBlack: boolean;
}>`
  position: fixed;
  display: flex;
  justify-content: "center";
  align-items: "center";
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) =>
    props.$isBackgroundBlack ? "rgba(0,0,0,0.3)" : "transparent"};
  z-index: 999;
`;
```

### 2. useModal 훅 만들기

훅을 만드는 이유는 모달을 개발해보면서 모달을 열고 닫는 타이밍을 내가 지정해주고 싶기 때문이 크다고 생각한다.

모달의 단계가 있기 때문에 모달을 띄울 컴포넌트들을 배열로 받고 창을 닫을 때 띄어주는 모달도 따로 받을거다.

생각해보니 창을 닫을때도 1단계, 2단계 가 있을수도 있을거라 생각해서 이것도 배열로 받아주었다.

```ts
interface UseModalProps {
  children: ReactNode[];
  closeCallBack: () => void;
  isBackgroundBlack: boolean;
  confirmationSteps?: ReactNode[];
}
export const useModal = ({
  children,
  closeCallBack,
  isBackgroundBlack,
  confirmationSteps = [],
}: UseModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [currentConfirmStep, setCurrentConfirmStep] = useState<number>(0);

  const closeAllModals = () => {
    setIsOpen(false);
    setIsConfirmOpen(false);
    setCurrentConfirmStep(0);
    setCurrentStep(0);
    closeCallBack();
  };

  const closeModal = () => {
    if (confirmationSteps.length > 0) {
      setIsConfirmOpen(true);
    } else {
      setIsOpen(false);
      setCurrentStep(0);
      closeCallBack();
    }
  };

  const moveNextStep = () => {
    if (currentStep < children.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCurrentStep(children.length - 1);
    }
  };

  const movePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setCurrentStep(0);
    }
  };

  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      if (currentConfirmStep < confirmationSteps.length - 1) {
        setCurrentConfirmStep((prev) => prev + 1);
      } else {
        setIsOpen(false);
        setIsConfirmOpen(false);
        setCurrentConfirmStep(0);
        setCurrentStep(0);
        closeCallBack();
      }
    } else {
      setIsConfirmOpen(false);
      setCurrentConfirmStep(0);
    }
  };

  const modal =
    isOpen && children[currentStep] ? (
      <BaseModal
        children={children[currentStep]}
        closeCallBack={closeModal}
        isBackgroundBlack={isBackgroundBlack}
      />
    ) : null;

  const confirmModal =
    isConfirmOpen && confirmationSteps[currentConfirmStep] ? (
      <BaseModal
        children={confirmationSteps[currentConfirmStep]}
        closeCallBack={() => handleConfirmation(false)}
        isBackgroundBlack={true}
      />
    ) : null;

  return {
    modal,
    confirmModal,
    setIsOpen,
    handleConfirmation,
    moveNextStep,
    movePrevStep,
    closeAllModals,
  };
};
```

#### 함수 분석

앞으로 모달과 컨펌모달로 분리하겠다. 모달은 내가 띄우려는 모달 그 자체고 창을 닫을때 나타나는 모달을 컨펌모달로 칭하겠다.

#### 1. closeAllModals

열려있는 모달, 컨펌모달들을 모두 닫는 함수다.

#### 2. closeModal

컨펌모달이 있다면 컨펌모달을 열고 없다면 모달을 닫는 함수다.

#### 3. moveNextStep

모달의 다음 단계가 있다면 다음단계를 보여주고 없다면 마지막 스텝을 유지한다.

#### 4. movePrevStep

모달의 이전페이지로 이동한다.

#### 5. handleConfirmation

컨펌이 true 라면 컨펌모달의 단계를 높이거나 모달을 닫고 false 면 컨펌 모달만 닫는다.

#### 6. 컴포넌트

```ts
const modal =
  isOpen && children[currentStep] ? (
    <BaseModal
      children={children[currentStep]}
      closeCallBack={closeModal}
      isBackgroundBlack={isBackgroundBlack}
    />
  ) : null;

const confirmModal =
  isConfirmOpen && confirmationSteps[currentConfirmStep] ? (
    <BaseModal
      children={confirmationSteps[currentConfirmStep]}
      closeCallBack={() => handleConfirmation(false)}
      isBackgroundBlack={true}
    />
  ) : null;
```

현재 step 과 컨펌 step 에 따라서 모달과 컨펌모달이 나오게끔 했다.

### 3. 모달 사용

모달 사용은 모달 3개 (Step1, Step2, Step3)와 컨펌 모달 2개(Confirm1, Confirm2)를 사용하여 총 5개의 컴포넌트를 사용한다.

훅 사용은 다음과 같이 App.tsx에 정의했다.

```ts
const {
  closeAllModals,
  confirmModal,
  handleConfirmation,
  modal,
  moveNextStep,
  movePrevStep,
  setIsOpen,
} = useModal({
  children: [
    <Step1 moveNextStep={() => moveNextStep()} />,
    <Step2
      moveNextStep={() => moveNextStep()}
      movePrevStep={() => movePrevStep()}
    />,
    <Step3 movePrevStep={() => movePrevStep()} />,
  ],
  closeCallBack: () => {},
  isBackgroundBlack: true,
  confirmationSteps: [
    <Confirm1
      handleConfirmation={(confirm: boolean) => handleConfirmation(confirm)}
    />,
    <Confirm2
      handleConfirmation={(confirm: boolean) => handleConfirmation(confirm)}
    />,
  ],
});
```

각 컴포넌트들의 코드는 다음과 같다.

```ts
export const Step1 = ({ moveNextStep }: { moveNextStep: () => void }) => {
  return (
    <StepWrapper>
      Step1
      <button onClick={() => moveNextStep()}>다음</button>
    </StepWrapper>
  );
};

export const Step2 = ({
  movePrevStep,
  moveNextStep,
}: {
  movePrevStep: () => void;
  moveNextStep: () => void;
}) => {
  return (
    <StepWrapper>
      Step2
      <button onClick={() => movePrevStep()}>이전</button>
      <button onClick={() => moveNextStep()}>다음</button>
    </StepWrapper>
  );
};

export const Step3 = ({ movePrevStep }: { movePrevStep: () => void }) => {
  return <StepWrapper>Step3</StepWrapper>;
};

export const Confirm1 = ({
  handleConfirmation,
}: {
  handleConfirmation: (confirm: boolean) => void;
}) => {
  return (
    <ConfirmWrapper>
      Confirm1
      <button onClick={() => handleConfirmation(false)}>컨펌 취소</button>
      <button onClick={() => handleConfirmation(true)}>다음 스텝</button>
    </ConfirmWrapper>
  );
};

export const Confirm2 = ({
  handleConfirmation,
}: {
  handleConfirmation: (confirm: boolean) => void;
}) => {
  return (
    <ConfirmWrapper>
      Confirm2
      <button onClick={() => handleConfirmation(false)}>컨펌 취소</button>
      <button onClick={() => handleConfirmation(true)}>모달 닫기</button>
    </ConfirmWrapper>
  );
};
```

마지막으로 App.tsx

※주의※ **modal이 confirmModal 보다 위에 있어야 한다.**

```ts
return (
  <div className="App">
    {modal}
    {confirmModal}
    <button onClick={() => setIsOpen(true)}>모달 띄우기</button>
  </div>
);
```

실제 화면을 보면 다음과 같다.

#### (1) 모달 띄우기 클릭하면 아래 화면이 나온다

![image](https://github.com/user-attachments/assets/66420241-941d-46b1-b4b7-ea788afa0d72)

#### (2) 다음을 클릭하면 Step2로 이동

![image](https://github.com/user-attachments/assets/8d4841f5-f84d-40b8-ae45-9354c855ac40)

#### (3) 다음을 클릭하면 Step3로 이동

![image](https://github.com/user-attachments/assets/f9fa6644-9120-4147-89f2-111aa04dc171)

#### (4) 모달이 아닌 바깥쪽을 클릭하면 컨펌모달 등장

![image](https://github.com/user-attachments/assets/f00a1b5c-c9b7-44d8-a8f4-98c59dbc2f42)

#### (5) 컨펌모달 다음스텝 클릭하면 Confirm2로 이동

![image](https://github.com/user-attachments/assets/fe5b1ab8-d9a8-4d28-a7d2-15316449b675)

#### (6) 컨펌 취소를 누르면 컨펌모달만 꺼지고 모달은 유지된다.

![image](https://github.com/user-attachments/assets/5d3d5645-02d1-4ce0-b792-a1448f942d12)

#### (7) 다시 들어가서 모달닫기를 누르면 모든 모달이 꺼진다.

![image](https://github.com/user-attachments/assets/614ff592-6cda-4be6-aae6-c29074d6da5e)

기호에 맞게 기능을 추가해도되고 모달에 모달에 모달을 띄어도 된다.

하다가 또 갈아엎을 일이 생긴다면 갈아 엎겠지만 지금은 제일 편해보인다.

끝
