import React from "react";
import { ConfirmWrapper } from "./BaseModal.style";

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
