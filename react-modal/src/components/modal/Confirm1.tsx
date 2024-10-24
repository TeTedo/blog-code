import React from "react";
import { ConfirmWrapper } from "./BaseModal.style";

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
