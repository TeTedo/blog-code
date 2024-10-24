import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useModal } from "hook/useModal";
import { Step1 } from "components/modal/Step1";
import { Step2 } from "components/modal/Step2";
import { Step3 } from "components/modal/Step3";
import { Confirm1 } from "components/modal/Confirm1";
import { Confirm2 } from "components/modal/Confirm2";

function App() {
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

  return (
    <div className="App">
      {modal}
      {confirmModal}
      <button onClick={() => setIsOpen(true)}>모달 띄우기</button>
    </div>
  );
}

export default App;
