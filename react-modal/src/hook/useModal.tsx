import { BaseModal } from "components/modal/BaseModal";
import React, { ReactNode, useState } from "react";

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
