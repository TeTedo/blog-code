import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Style } from "./QRPage.style";
import { Style as SecondStyle } from "./Second.style";

export const QRPage: React.FC = () => {
  const secondPageUrl = "https://invitation.tetedo.com/second";

  const renderBackgroundEmojis = () => {
    return Array.from({ length: 50 }).map((_, i) => (
      <SecondStyle.FloatingEmoji
        key={i}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${5 + Math.random() * 2}s`,
        }}
      >
        {["🎄", "⭐", "🎅", "🎁"][Math.floor(Math.random() * 4)]}
      </SecondStyle.FloatingEmoji>
    ));
  };

  return (
    <Style.Container>
      <SecondStyle.BackgroundDecoration>
        {renderBackgroundEmojis()}
      </SecondStyle.BackgroundDecoration>
      <Style.Card>
        <Style.Title>2차 투표하기 🎉</Style.Title>
        <Style.QRWrapper>
          <QRCodeSVG
            value={secondPageUrl}
            size={200}
            level="H"
            includeMargin
            bgColor="#FFFFFF"
            fgColor="#ff8080"
          />
        </Style.QRWrapper>
        <Style.Description>
          QR코드를 스캔하여 2차 참여 여부를 알려주세요!
        </Style.Description>
      </Style.Card>
    </Style.Container>
  );
};

export default QRPage;
