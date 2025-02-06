import React, { useEffect, useState } from "react";
import { Style } from "./LandingPage.style";
import { useNavigate, useParams } from "react-router-dom";
import { get_registration_by_id } from "repository/registration_repository";
import { useToastCustom } from "hooks/toast/useToastCustom";

export const LandingPage: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const [personalNumber, setPersonalNumber] = useState<number>(0);
  const { code } = useParams<{ code: string }>();
  const nav = useNavigate();
  const toast = useToastCustom();

  useEffect(() => {
    if (!code) {
      nav("/registration");
      return;
    } // code가 없는 경우 반환

    (async () => {
      try {
        const registration = await get_registration_by_id(code);
        if (registration) {
          setName(registration.name);
          setPersonalNumber(registration.personalNumber!);
        } else {
          toast("이상한데 들어오지 말라구!", "error");
          nav("/registration");
        }
      } catch (error) {
        toast("오류 났다...! 어서 알려주세요..ㅠ ㅠ", "error");
        nav("/registration");
      }
    })();
  }, [nav, code]);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

  const schedule = [
    { start: "18:00", end: "18:10", activity: "입장" },
    { start: "18:10", end: "18:30", activity: "아이스브레이킹" },
    { start: "18:30", end: "18:40", activity: "오프닝" },
    { start: "18:40", end: "19:30", activity: "자유로운 네트워킹" },
    { start: "19:30", end: "20:00", activity: "스탠딩 파티(이벤트)" },
    { start: "20:00", end: "21:00", activity: "자유로운 네트워킹" },
    { start: "21:00", end: "21:30", activity: "스탠딩 파티(이벤트)" },
    { start: "21:30", end: "22:30", activity: "자유로운 네트워킹" },
    {
      start: "22:30",
      end: "23:00",
      activity: "추첨권, 베스트 드레서, 단체사진",
    },
    { start: "23:00", end: "23:30", activity: "2차 인원 접수" },
  ];

  return (
    <Style.LandingWrapper>
      <Style.HeroSection>
        <h1>🎄 2024 크리스마스 파티 🎄</h1>
        <p>
          올해 가장 빛나는 파티에 <strong>{name}</strong>님을 초대합니다!
        </p>
        <p>
          <div>
            {name}님의 개인번호는 <strong>{personalNumber}</strong>번이에요.
          </div>
          <div>개인번호는 추후 이벤트에 활용됩니다!</div>
        </p>
        <p>파티에서 다른사람들의 마이페이지도 볼 수 있어요!</p>
        <Style.ButtonGroup>
          <Style.PrimaryButton onClick={() => nav(`/invite/${code}`)}>
            마이 페이지 등록/수정
          </Style.PrimaryButton>
          <Style.SecondaryButton
            onClick={() => nav(`/mini-homepage/${personalNumber}`)}
          >
            마이 페이지 보기
          </Style.SecondaryButton>
        </Style.ButtonGroup>

        <p> 🌟일시 및 장소🌟 </p>
        <p>일시: 12월 21일 토요일 18시 ~ 23시 30분</p>

        <Style.PrimaryButton onClick={handleNaverMapRedirect}>
          네이버지도로 보기
        </Style.PrimaryButton>
      </Style.HeroSection>
      <Style.ScheduleSection>
        <h2>🎅 파티 일정표</h2>
        <Style.ScheduleList>
          {schedule.map((item, index) => (
            <Style.ScheduleItem key={index}>
              <span>
                {item.start} ~ {item.end}
              </span>
              <p>{item.activity}</p>
            </Style.ScheduleItem>
          ))}
        </Style.ScheduleList>
      </Style.ScheduleSection>
      <Style.FeatureSection>
        <Style.FeatureCard>
          <h3>🎁 선물 이벤트</h3>
          <p>다양한 경품과 함께 추억을 만드세요.</p>
        </Style.FeatureCard>
        <Style.FeatureCard>
          <h3>📸 포토존</h3>
          <p>크리스마스 테마의 특별한 사진을 남겨보세요.</p>
        </Style.FeatureCard>
        <Style.FeatureCard>
          <h3>🍷 와인 & 🍹하이볼</h3>
          <p>무제한 제공되는 음료와 함께 파티를 즐기세요.</p>
        </Style.FeatureCard>
      </Style.FeatureSection>
    </Style.LandingWrapper>
  );
};
