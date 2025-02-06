import styled from "styled-components";

export const Style = {
  LandingWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #e6f2ff, #ffe6e6);
    min-height: 100vh;
    padding: 20px;
    gap: 50px;
  `,
  HeroSection: styled.div`
    background: white;
    padding: 40px 20px;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    width: 100%;
    h1 {
      font-size: 36px;
      color: #c41e3a;
      margin-bottom: 10px;
      font-family: "Dancing Script", cursive;
    }
    p {
      font-size: 18px;
      color: #2c3e50;
    }
  `,
  ButtonGroup: styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  `,
  PrimaryButton: styled.button`
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
  `,
  SecondaryButton: styled.button`
    padding: 12px 20px;
    background-color: #2a5298;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #c41e3a;
    }
  `,
  FeatureSection: styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    max-width: 800px;
  `,
  FeatureCard: styled.div`
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    max-width: 250px;
    width: 100%;
    h3 {
      font-size: 20px;
      color: #c41e3a;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      color: #2c3e50;
    }
  `,
  ScheduleSection: styled.div`
    width: 100%;
    max-width: 600px;
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    text-align: center;

    h2 {
      font-size: 24px;
      color: #c41e3a;
      margin-bottom: 20px;
    }
  `,

  ScheduleList: styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
  `,

  ScheduleItem: styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 10px 20px;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    span {
      font-size: 18px;
      font-weight: bold;
      color: #c41e3a;
    }

    p {
      font-size: 16px;
      color: #2c3e50;
      text-align: left;
      margin: 0;
    }
  `,
};
