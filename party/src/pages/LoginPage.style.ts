import styled from "styled-components";

export const Style = {
  LoginWrapper: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #e6f2ff, #ffe6e6);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d3e0ea' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v-1h9v-9h1v9h9v1h-9v9h-1v-9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    padding: 20px;
  `,
  LoginCard: styled.div`
    background: white;
    padding: 40px 30px;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    text-align: center;
    max-width: 400px;
    width: 100%;

    h1 {
      font-size: 28px;
      color: #c41e3a;
      margin-bottom: 10px;
      font-family: "Dancing Script", cursive;
    }

    p {
      font-size: 16px;
      color: #2c3e50;
      margin-bottom: 20px;
    }
  `,
  LoginForm: styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;

    label {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      color: #2c3e50;

      span {
        margin-bottom: 5px;
      }

      input {
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        font-size: 14px;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: #2a5298;
          box-shadow: 0 0 5px rgba(42, 82, 152, 0.3);
        }
      }
    }
  `,
  SubmitButton: styled.button`
    margin-top: 10px;
    padding: 12px 20px;
    background-color: #c41e3a;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #2a5298;
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    }
  `,
};
