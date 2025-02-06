import React, { useState } from "react";
import { Style } from "./RegistrationPage.style";
import { ModalComponent } from "component/ModalComponent";
import { useToastCustom } from "hooks/toast/useToastCustom";
import { post_registration } from "repository/registration_repository";
import { useNavigate } from "react-router-dom";

export const RegistrationPage: React.FC = () => {
  const toast = useToastCustom();
  const navigate = useNavigate();
  const [form, setForm] = useState<IPostRegistration>({
    name: "",
    contact: "",
    gender: "",
    recommender: "",
  });
  const [modalImage, setModalImage] = useState<string | null>(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, gender: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await post_registration(form);
    navigate("/registration-success");
  };

  const handleCopyAccount = async (): Promise<void> => {
    try {
      const account = "계좌번호";
      await navigator.clipboard.writeText(account);
      toast("게좌번호 복사 완료!", "success");
    } catch (error) {
      toast("계좌번호 복사 오류", "error");
    }
  };

  const handleNaverMapRedirect = () => {
    const pcLink =
      "https://map.naver.com/p/search/%EA%B1%B4%EB%8C%80%20%ED%95%98%EC%9D%B4%EB%93%9C%EC%95%84%EC%9B%83%20%ED%8C%8C%ED%8B%B0%EB%A3%B8/place/1693918204?c=15.00,0,0,0,dh&isCorrectAnswer=true"; // 네이버 지도 웹사이트 링크
    const mobileLink = "nmap://place?id=1693918204"; // 네이버 지도 앱 링크 (place ID 필요)

    if (!isMobile) {
      window.open(pcLink);

      return;
    }
    window.location.href = isMobile ? mobileLink : pcLink;
  };

  return (
    <>
      <Style.Wrapper>
        <Style.ContentBox>
          <Style.TitleImg src="/christmas_party.png" />
          <Style.TextDiv style={{ fontSize: "2.3rem", marginTop: "-2rem" }}>
            🎄 도파민에 절여진 다연이를 위한 크리스마스 파티 🎄
          </Style.TextDiv>
          <Style.TextDiv style={{ fontSize: "1.6rem", marginTop: "1rem" }}>
            ✨다연이의 도파민 충족을 위한 특별한 연말 크리스마스 파티에
            초대합니다!✨
          </Style.TextDiv>
          <Style.TextDiv style={{ fontSize: "1.6rem" }}>
            친구의 친구의 친구와 함께하는 즐거운 파티!
          </Style.TextDiv>
          <Style.TextDiv style={{ fontSize: "1.6rem" }}>
            다양한 직종의 새로운 사람들과 소중한 추억을 만들어보세요.
          </Style.TextDiv>
          <Style.TextDiv style={{ fontSize: "1.6rem" }}>
            친구, 애인과 함께 동참 대환영! 파티장과 모르는 사이면 더욱 환영! 🎁
          </Style.TextDiv>
          <Style.TextWrapper style={{ marginTop: "3rem" }}>
            <Style.TextDiv>🎁 [파티 하이라이트]</Style.TextDiv>
            <Style.TextDiv style={{ fontSize: "1.6rem" }}>
              🍷 와인, 하이볼 무제한 제공
            </Style.TextDiv>
            <Style.TextDiv style={{ fontSize: "1.6rem" }}>
              🎲 다양한 이벤트, 추첨과 상품 증정
            </Style.TextDiv>
            <Style.TextDiv style={{ fontSize: "1.6rem" }}>
              💃 베스트 드레서 선정
            </Style.TextDiv>
            <Style.TextDiv style={{ fontSize: "1.6rem" }}>
              📸 크리스마스 컨셉 포토존
            </Style.TextDiv>

            <Style.TextDiv style={{ marginTop: "2rem" }}>
              👗 드레스코드:
            </Style.TextDiv>
            <Style.TextDiv>
              크리스마스룩 🎅 (포인트 컬러: 레드 OR 그린)
            </Style.TextDiv>
          </Style.TextWrapper>

          {/* 시간 */}
          <Style.DateImg src="/date.png" style={{ marginTop: "3rem" }} />

          {/* 참가안내 */}
          <Style.TextDiv style={{ fontSize: "1.6rem", marginTop: "2.5rem" }}>
            🎄 [참가 안내]
          </Style.TextDiv>
          <Style.TextDiv style={{ fontSize: "1.6rem" }}>
            접수 및 입금 확인 후, 개인 번호가 부여된 초대장을 보내드립니다.
          </Style.TextDiv>
          <Style.TextDiv style={{ fontSize: "1.6rem" }}>
            📌 이후 2차는 인원 조사 후 근처 술집으로 이동할 예정입니다.
          </Style.TextDiv>

          {/* 장소 */}
          <Style.TextDiv style={{ marginTop: "2rem" }}>📍 장소:</Style.TextDiv>
          <Style.TextDiv>건대 하이드아웃 파티룸</Style.TextDiv>
          <Style.TextDiv>(서울 광진구 아차산로 327, 2층)</Style.TextDiv>

          <Style.Location>
            <Style.NaverMapButton onClick={handleNaverMapRedirect}>
              네이버지도로 보기
            </Style.NaverMapButton>
          </Style.Location>

          <Style.TextDiv style={{ fontSize: "2rem", marginTop: "2.5rem" }}>
            💶 참가비: 40,000won
          </Style.TextDiv>

          {/* 계좌번호 */}
          <Style.TextDiv style={{ marginTop: ".5rem" }}>
            계좌번호:
          </Style.TextDiv>
          <Style.TextDiv>(카카오뱅크) 한다연</Style.TextDiv>

          <Style.Button onClick={handleCopyAccount}>계좌번호 복사</Style.Button>

          {/* 문의 */}
          <Style.TextDiv style={{ marginTop: "2rem" }}>
            문의 : (번호) (한다연)
          </Style.TextDiv>

          <Style.Form onSubmit={handleSubmit}>
            <Style.Input
              type="text"
              name="name"
              placeholder="이름"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Style.Input
              type="text"
              name="contact"
              placeholder="연락처"
              value={form.contact}
              onChange={handleChange}
              required
            />

            <Style.RadioGroup>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="남성"
                  checked={form.gender === "남성"}
                  onChange={handleGenderChange}
                  required
                />
                남성
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="여성"
                  checked={form.gender === "여성"}
                  onChange={handleGenderChange}
                  required
                />
                여성
              </label>
            </Style.RadioGroup>
            <Style.Input
              type="text"
              name="recommender"
              placeholder="추천인 이름"
              value={form.recommender}
              onChange={handleChange}
            />
            <Style.TextDiv style={{ fontSize: "1.6rem", marginTop: "1rem" }}>
              입금 후 접수 신청 부탁드립니다!
            </Style.TextDiv>
            <Style.Button type="submit">접수하기</Style.Button>
          </Style.Form>
        </Style.ContentBox>
      </Style.Wrapper>
    </>
  );
};
