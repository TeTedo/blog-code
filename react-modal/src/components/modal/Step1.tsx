import React from "react";
import { StepWrapper } from "./BaseModal.style";

export const Step1 = ({ moveNextStep }: { moveNextStep: () => void }) => {
  return (
    <StepWrapper>
      Step1
      <button onClick={() => moveNextStep()}>다음</button>
    </StepWrapper>
  );
};
