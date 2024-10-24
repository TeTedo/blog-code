import React, { ReactNode } from "react";
import { Wrapper } from "./BaseModal.style";

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
