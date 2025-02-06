import React from "react";
import { Link } from "react-router-dom";
import { Style } from "./RegistrationPage.style";

export const RegistrationSuccessPage: React.FC = () => {
  return (
    <Style.Wrapper>
      <Style.SuccessWrapper>
        <Style.Title>접수 완료!</Style.Title>
        <div>크리스마스 파티 접수가 성공적으로 완료되었습니다.</div>
        <div style={{ marginTop: "1rem" }}>
          입금 확인 후 초대장을 발송해드리겠습니다.
        </div>
        <div style={{ marginTop: "1rem" }}>
          문의사항이 있으시면 (번호) (한다연)으로 연락주세요.
        </div>
        <Style.Button
          as={Link}
          to="/registration"
          style={{ fontSize: "1.5rem", marginTop: "3rem" }}
        >
          홈으로 돌아가기
        </Style.Button>
      </Style.SuccessWrapper>
    </Style.Wrapper>
  );
};
