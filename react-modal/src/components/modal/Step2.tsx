import React from "react";
import { StepWrapper } from "./BaseModal.style";

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
