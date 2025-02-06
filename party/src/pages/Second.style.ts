import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

export const Style = {
  Container: styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #fff5f5 0%, #ffe4e4 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 1rem;
  `,

  BackgroundDecoration: styled.div`
    position: absolute;
    inset: 0;
    overflow: hidden;
  `,

  FloatingEmoji: styled.div`
    position: absolute;
    animation: ${float} 5s ease-in-out infinite;
    font-size: 1.5rem;
  `,

  Card: styled.div`
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(255, 182, 182, 0.2);
    padding: 2rem;
    max-width: 28rem;
    width: 100%;
    position: relative;
    z-index: 10;
    border: 2px solid rgba(255, 182, 182, 0.4);
  `,

  Title: styled.h1`
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
    color: #ff8080;
  `,

  ButtonContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `,

  YesButton: styled.button`
    width: 100%;
    padding: 1rem 1.5rem;
    background: linear-gradient(to right, #ffb6b6, #ff8080);
    color: white;
    border-radius: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
  `,

  NoButton: styled.button<{ x?: number; y?: number }>`
    width: 100%;
    padding: 1rem 1.5rem;
    background-color: #f3f4f6;
    color: #4b5563;
    border-radius: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    position: ${(props) => (props.x ? "absolute" : "relative")};
    left: ${(props) => props.x}px;
    top: ${(props) => props.y}px;

    &:hover {
      background-color: #e5e7eb;
    }
  `,

  ResultContainer: styled.div`
    text-align: center;
  `,

  ResultTitle: styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    color: #ff8080;
    margin-bottom: 1rem;
  `,

  ResultText: styled.p`
    font-size: 1.125rem;
    color: #4b5563;
  `,

  ResultEmoji: styled.div`
    margin-top: 2rem;
    font-size: 3rem;
    animation: ${bounce} 2s ease-in-out infinite;
  `,
};
