import styled from "styled-components";

// 전역 스타일을 위한 배경 컴포넌트
export const Background = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #fff5f5 0%,
    #ffe4e4 25%,
    #fff5f5 50%,
    #ffe4e4 75%,
    #fff5f5 100%
  );
  padding: 1rem;

  @media (max-width: 680px) {
    padding: 0.5rem;
  }
`;

export const Style = {
  Wrapper: styled.div`
    max-width: 28rem;
    width: 100%;
    margin: 3rem auto;
    background-color: #fff;
    border: 1px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(to right, #ffd1d1, #ffb6b6, #ffd1d1);
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(255, 182, 182, 0.2);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif;
    position: relative;
    box-sizing: border-box;

    @media (max-width: 680px) {
      margin: 1rem auto;
      border-radius: 0;
      max-width: 100%;
    }

    &::before,
    &::after {
      content: "🎄";
      position: absolute;
      top: -25px;
      font-size: 24px;

      @media (max-width: 680px) {
        display: none;
      }
    }

    &::before {
      left: 20px;
    }

    &::after {
      right: 20px;
    }
  `,

  Header: styled.div`
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #ffd1d1;
    background: linear-gradient(
      to right,
      rgba(255, 209, 209, 0.1),
      rgba(255, 182, 182, 0.2)
    );

    @media (max-width: 680px) {
      padding: 0.5rem;
      border-radius: 0;
    }
  `,

  ProfileImage: styled.img`
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    margin-right: 0.75rem;
    object-fit: cover;
    border: 2px solid #ffb6b6;
    box-shadow: 0 2px 4px rgba(255, 182, 182, 0.2);
    @media (max-width: 680px) {
      width: 5rem;
      height: 5rem;
    }
  `,

  Username: styled.div`
    font-weight: 600;
    font-size: 0.875rem;
    color: #ff8080;

    @media (max-width: 680px) {
      font-size: 2rem;
    }
  `,

  InteractionSection: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid rgba(255, 209, 209, 0.5);
    background: linear-gradient(to right, #fff, rgba(255, 209, 209, 0.1));
  `,

  InteractionButtons: styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
  `,

  Button: styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #ff8080;
    transition: all 0.2s;
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    &:hover {
      background-color: rgba(255, 209, 209, 0.2);
    }

    & > img {
      width: 1.5rem;
      height: 1.5rem;
    }
    @media (max-width: 680px) {
      & > img {
        width: 3rem;
        font-size: 3rem;
        height: 3rem;
      }
    }
  `,

  ContentSection: styled.div`
    padding: 1rem;
    background: linear-gradient(to bottom, #fff, rgba(255, 209, 209, 0.1));

    @media (max-width: 680px) {
      padding: 0.75rem;
    }
  `,
  InfoRow: styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
    font-size: 0.875rem;
    word-break: break-word;

    span {
      font-size: 1rem;
      word-break: break-all;
    }

    a {
      font-size: 1rem;
    }

    @media (max-width: 680px) {
      margin-bottom: 0.75rem;
      padding: 0.5rem;
      font-size: 1rem;
      gap: 0.75rem;

      span {
        font-size: 2rem;
        word-break: break-all;
      }
      a {
        font-size: 2rem;
      }
    }
  `,
  CommentSection: styled.div`
    padding: 1rem;
    border-top: 1px solid rgba(255, 209, 209, 0.5);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(to bottom, rgba(255, 209, 209, 0.1), #fff);

    @media (max-width: 680px) {
      padding: 0.75rem;
      flex-direction: column;
      gap: 0.75rem;
    }
  `,

  CommentInput: styled.input`
    flex-grow: 1;
    padding: 0.5rem;
    border: 1px solid rgba(255, 182, 182, 0.4);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s;

    @media (max-width: 680px) {
      width: 100%;
      padding: 0.75rem;
      font-size: 2rem;
      height: 2.5rem;
      box-sizing: border-box;
    }

    &:focus {
      outline: none;
      border-color: #ffb6b6;
      box-shadow: 0 0 0 2px rgba(255, 182, 182, 0.2);
    }
  `,

  CommentButton: styled.button`
    background: linear-gradient(to right, #ffb6b6, #ff8080);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s;
    border: none;
    cursor: pointer;

    @media (max-width: 680px) {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      height: 2.5rem;
    }

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  `,

  CommentList: styled.div`
    margin: 1rem 0.5rem;
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
    width: calc(100% - 1rem);
    background-color: #fff;
    padding: 0.5rem;
    border-radius: 10px;
    box-sizing: border-box;
    border: 1px solid rgba(255, 209, 209, 0.5);

    @media (max-width: 680px) {
      margin: 0.5rem 0;
      width: 100%;
      border-radius: 0;
    }
  `,

  CommentItem: styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    background: linear-gradient(to right, #fff, rgba(255, 209, 209, 0.1));
    border: 1px solid rgba(255, 209, 209, 0.3);
    border-radius: 8px;

    @media (max-width: 680px) {
      padding: 8px;
    }
  `,

  CommentHeader: styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  `,

  CommentAuthor: styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid #ffb6b6;
      box-shadow: 0 2px 4px rgba(255, 182, 182, 0.2);

      @media (max-width: 680px) {
        width: 4rem;
        height: 4rem;
      }
    }

    span {
      font-size: 14px;
      font-weight: bold;
      color: #ff8080;

      @media (max-width: 680px) {
        font-size: 2rem;
      }
    }
  `,
  CommentBody: styled.div`
    font-size: 14px;
    color: #2c3e50;
    word-break: break-word;
    flex: 1;
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.5rem;

    @media (max-width: 680px) {
      font-size: 2rem;
      padding: 0.5rem;
      line-height: 1.4;
    }
  `,

  ActionButtons: styled.div`
    display: flex;
    gap: 10px;

    button {
      font-size: 12px;
      padding: 5px 10px;
      border: 1px solid rgba(255, 182, 182, 0.4);
      border-radius: 5px;
      cursor: pointer;
      background-color: white;
      color: #ff8080;
      transition: all 0.2s;

      @media (max-width: 680px) {
        font-size: 0.875rem;
        padding: 0.5rem 0.75rem;
      }

      &:hover {
        background: linear-gradient(to right, #ffb6b6, #ff8080);
        color: white;
        transform: translateY(-1px);
      }
    }
  `,

  Footer: styled.div`
    text-align: center;
    padding: 1rem;
    border-top: 1px solid rgba(255, 209, 209, 0.5);
    font-size: 0.875rem;
    color: #ff8080;
    background: linear-gradient(to bottom, rgba(255, 209, 209, 0.1), #fff);
    position: relative;

    @media (max-width: 680px) {
      font-size: 2rem;
      padding: 1.25rem;
    }

    &::before,
    &::after {
      content: "🎅";
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;

      @media (max-width: 680px) {
        font-size: 2rem;
      }
    }

    &::before {
      left: 20px;
    }

    &::after {
      right: 20px;
    }
  `,

  EmptyState: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    padding: 2rem 1rem;
    text-align: center;
    background: linear-gradient(135deg, #fff5f5 0%, #ffe4e4 100%);
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(255, 182, 182, 0.2);
    margin: 3rem auto;
    max-width: 28rem;
    width: calc(100% - 2rem);
    position: relative;
    box-sizing: border-box;

    @media (max-width: 680px) {
      min-height: 200px;
      margin: 1rem auto;
      padding: 1rem;
      border-radius: 0;
      width: 100%;
    }

    &::before,
    &::after {
      @media (max-width: 680px) {
        display: none;
      }
    }
  `,

  EmptyStateMessage: styled.p`
    font-size: 1rem;
    color: #ff8080;
    margin: 1rem 0;
    font-weight: 500;
    line-height: 1.5;
    padding: 1rem;
    background-color: white;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 182, 182, 0.4);
    box-shadow: 0 2px 4px rgba(255, 182, 182, 0.1);
    width: 100%;
    max-width: 280px;
    box-sizing: border-box;

    @media (max-width: 680px) {
      font-size: 0.875rem;
      padding: 0.75rem;
      margin: 0.5rem 0;
    }
  `,
  EmptyStateIcon: styled.div`
    font-size: 2.5rem;
    margin-bottom: 1rem;
  `,
};
