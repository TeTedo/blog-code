import React, { useEffect, useState } from "react";
import { Style } from "./Second.style";
import { LocalStorageId } from "const/const";
import { get_survey_response } from "repository/survey_repository";
import { post_second } from "repository/second_repository";
import { useToastCustom } from "hooks/toast/useToastCustom";

export const Second: React.FC = () => {
  const [answer, setAnswer] = useState("");
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [writerInfo, setWriterInfo] = useState<SurveyResponse>();

  const toast = useToastCustom();

  const handleYesClick = async () => {
    if (!writerInfo) {
      toast("체크인 이후 사용가능합니다.", "error");
      return;
    }
    setAnswer("Yes");

    const data = {
      id: writerInfo.id,
      name: writerInfo.name,
    };
    await post_second(data);
  };

  const handleNoHover = () => {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    setNoButtonPosition({ x, y });
  };

  const renderBackgroundEmojis = () => {
    return Array.from({ length: 50 }).map((_, i) => (
      <Style.FloatingEmoji
        key={i}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${5 + Math.random() * 5}s`,
        }}
      >
        {["🎄", "⭐", "🎅", "🎁"][Math.floor(Math.random() * 4)]}
      </Style.FloatingEmoji>
    ));
  };

  useEffect(() => {
    const fetchWriterInfo = async () => {
      const id = localStorage.getItem(LocalStorageId);
      if (!id) return;

      const writer = await get_survey_response(id);
      if (writer) {
        setWriterInfo(writer);
      }
    };

    fetchWriterInfo();
  }, []);

  return (
    <Style.Container>
      <Style.BackgroundDecoration>
        {renderBackgroundEmojis()}
      </Style.BackgroundDecoration>

      <Style.Card>
        {!answer ? (
          <>
            <Style.Title>{writerInfo?.name}님! 2차 가시죠?? 🎉</Style.Title>
            <Style.ButtonContainer>
              <Style.YesButton onClick={handleYesClick}>
                네! 당연하죠! 🎄
              </Style.YesButton>
              <Style.NoButton
                onMouseEnter={handleNoHover}
                x={noButtonPosition.x}
                y={noButtonPosition.y}
              >
                글쎄요... 🤔
              </Style.NoButton>
            </Style.ButtonContainer>
          </>
        ) : (
          <Style.ResultContainer>
            <Style.ResultTitle>좋은 선택이에요! 🎉</Style.ResultTitle>
            <Style.ResultText>함께 즐거운 시간 보내요! 🎄</Style.ResultText>
            <Style.ResultEmoji>🎁</Style.ResultEmoji>
          </Style.ResultContainer>
        )}
      </Style.Card>
    </Style.Container>
  );
};

export default Second;
