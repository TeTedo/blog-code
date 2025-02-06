import styled from "styled-components";

export const Style = {
  LoginWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #f7f8fa;
    padding: 20px;
  `,
  DashboardWrapper: styled.div`
    padding: 20px;
    text-align: center;
  `,
  Title: styled.h1`
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  `,
  Form: styled.form`
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  `,
  Input: styled.input`
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
    &:focus {
      border-color: #6b8e23;
    }
  `,
  Button: styled.button`
    padding: 10px 20px;
    font-size: 16px;
    background-color: #2a9d8f;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #21867a;
    }
  `,
  ErrorMessage: styled.p`
    color: red;
    font-size: 14px;
  `,
  Table: styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th,
    td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tr:hover {
      background-color: #f1f1f1;
    }
  `,
};
