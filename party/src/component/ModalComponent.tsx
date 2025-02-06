import React from "react";
import ReactModal from "react-modal";
import styled from "styled-components";

type ModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
};

const Style = {
  ModalContent: styled.div`
    position: relative;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    margin: auto;
  `,
  ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  CloseButton: styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    &:hover {
      color: #e63946;
    }
  `,
};

export const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onRequestClose,
  children,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="Overlay"
      className="Content"
      ariaHideApp={false}
      style={{
        overlay: { zIndex: 1000 },
      }}
    >
      <Style.ModalOverlay onClick={onRequestClose}>
        <Style.ModalContent onClick={(e) => e.stopPropagation()}>
          <Style.CloseButton onClick={onRequestClose}>×</Style.CloseButton>
          {children}
        </Style.ModalContent>
      </Style.ModalOverlay>
    </ReactModal>
  );
};
