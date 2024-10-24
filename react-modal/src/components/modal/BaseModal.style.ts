import styled from "styled-components";

export const Wrapper = styled.div<{
  $isBackgroundBlack: boolean;
}>`
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) =>
    props.$isBackgroundBlack ? "rgba(0,0,0,0.3)" : "transparent"};
  z-index: 999;
`;

export const StepWrapper = styled.div`
  width: 200px;
  height: 200px;
  font-size: 30px;
  background-color: white;
`;

export const ConfirmWrapper = styled.div`
  width: 400px;
  height: 50px;
  font-size: 20px;
  background-color: white;
`;
