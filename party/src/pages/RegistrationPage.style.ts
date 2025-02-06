import styled from "styled-components";
import bgImage from "../image/background.png";
import cardBgImage from "../image/card.png";
export const Style = {
  TextDiv: styled.div`
    color: white;
    font-size: 1.8rem;
    font-weight: 900;
  `,
  TextWrapper: styled.div`
    margin-top: 2rem;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.2);
    min-width: 30rem;
    max-width: 50rem;
    border-radius: 12px;
    width: 50rem;
  `,
  DateImg: styled.img`
    margin-top: 2rem;
    height: 18rem;
  `,
  SuccessWrapper: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;

    padding: 3rem;
    border-radius: 1.2rem;
    background-color: rgba(255, 255, 255, 1);
  `,
  Wrapper: styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url(${bgImage}); /* 배경 이미지 경로 */
    background-size: cover; /* 이미지가 전체 화면을 덮도록 설정 */
    background-position: center; /* 이미지 중심 배치 */
    background-repeat: no-repeat; /* 이미지 반복 방지 */
  `,

  Title: styled.h1`
    font-size: 2.5rem;
    color: black;
    margin-bottom: 2rem;
  `,
  TitleImg: styled.img`
    height: 33rem;
    margin-left: 4rem;
    padding-top: 25rem;
  `,
  Form: styled.form`
    margin-bottom: 23rem;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 40rem;
  `,
  Input: styled.input`
    margin: 1rem 0;
    padding: 1rem;
    width: 70%;
    font-size: 1.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  `,
  Button: styled.button`
    margin-top: 1rem;
    padding: 1rem 2.5rem;
    background-color: #e63946;
    color: white;
    font-size: 1.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #0056b3;
    }
  `,
  ContentBox: styled.div`
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-image: url(${cardBgImage}); /* 배경 이미지 경로 */
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    width: 112%;
    margin-top: 0rem;
    box-sizing: border-box;
  `,

  ShareSection: styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  ShareButton: styled.button`
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
  CopyMessage: styled.span`
    margin-top: 10px;
    font-size: 14px;
    color: #6b8e23;
  `,
  PhotoGallery: styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    img {
      width: 30%;
      height: auto;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: transform 0.2s;
      &:hover {
        transform: scale(1.05);
      }
    }
  `,
  ModalImage: styled.img`
    width: 100%;
    height: auto;
    max-width: 600px;
    margin: 0 auto;
    display: block;
    border-radius: 10px;
  `,
  ModalCloseButton: styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #e63946;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #d62828;
    }
  `,
  Location: styled.div`
    h3 {
      font-size: 16px;
      margin-bottom: 10px;
      color: #333;
    }

    iframe {
      border-radius: 10px;
    }
  `,
  NaverMapButton: styled.button`
    margin-top: 1rem;
    padding: 1rem 2.5rem;
    font-size: 1.5rem;
    background-color: #2a9d8f;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #21867a;
    }
  `,
  RadioGroup: styled.div`
    display: flex;
    gap: 15px;
    label {
      display: flex;
      align-items: end;
      justify-content: center;
      font-size: 1.6rem;
      color: white;
      font-weight: bold;
    }

    input {
      margin-right: 5px;
    }
  `,
};
