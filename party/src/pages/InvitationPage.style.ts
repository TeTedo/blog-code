import styled from "styled-components";

export const Style = {
  InvitationWrapper: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, white 0%, #e6f2ff 100%);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d3e0ea' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v-1h9v-9h1v9h9v1h-9v9h-1v-9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    padding: 20px;
  `,
  InvitationCard: styled.div`
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 400px;
    width: 100%;
    border: 3px solid #c41e3a;
    position: relative;
    overflow: hidden;

    &::before,
    &::after {
      content: "❄️";
      position: absolute;
      font-size: 24px;
      opacity: 0.5;
    }

    &::before {
      top: 10px;
      left: 10px;
    }

    &::after {
      bottom: 10px;
      right: 10px;
    }
  `,
  InvitationHeader: styled.h1`
    font-size: 32px;
    color: #c41e3a;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    background: linear-gradient(to right, #c41e3a, #2a5298);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `,
  InvitationBody: styled.div`
    font-size: 16px;
    color: #2c3e50;
    line-height: 1.6;
    background-color: #f0f4f8;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
  `,
  ImgContainer: styled.div`
    display: flex;
    gap: 30px;
    justify-content: center;
    align-items: center;
    position: relative;

    & > img:first-child {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 3px solid #c41e3a;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    & > label {
      display: flex;
      align-items: center;
      cursor: pointer;
      justify-content: center;
      border: 2px dashed #c41e3a;
      padding: 10px 15px;
      border-radius: 12px;
      color: #c41e3a;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(196, 30, 58, 0.1);
      }
    }
  `,
  SurveyForm: styled.form`
    margin-top: 20px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 15px;

    label {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      color: #2c3e50;
    }

    input,
    textarea {
      margin-top: 5px;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #c41e3a;
      font-size: 14px;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #2a5298;
        box-shadow: 0 0 5px rgba(42, 82, 152, 0.3);
      }
    }

    textarea {
      resize: none;
    }
  `,
  SubmitButton: styled.button`
    margin-top: 10px;
    padding: 12px 20px;
    background-color: #c41e3a;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      background-color: #2a5298;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    }
  `,
};
