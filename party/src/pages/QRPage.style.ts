import styled from "styled-components";

export const Style = {
  Container: styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #fff5f5 0%, #ffe4e4 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  `,

  Card: styled.div`
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(255, 182, 182, 0.2);
    padding: 2rem;
    max-width: 28rem;
    width: 100%;
    text-align: center;
    border: 2px solid rgba(255, 182, 182, 0.4);
    z-index: 10;
  `,

  Title: styled.h1`
    font-size: 1.5rem;
    font-weight: bold;
    color: #ff8080;
    margin-bottom: 2rem;
  `,

  QRWrapper: styled.div`
    display: flex;
    justify-content: center;
    margin: 2rem 0;
    padding: 1rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 6px rgba(255, 182, 182, 0.1);
  `,

  Description: styled.p`
    font-size: 1rem;
    color: #666;
    margin-top: 1.5rem;
    line-height: 1.5;
  `,
};
