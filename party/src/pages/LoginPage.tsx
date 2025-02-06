import React, { useState } from "react";
import { Style } from "./LoginPage.style";
import { useNavigate } from "react-router-dom";
import { useToastCustom } from "hooks/toast/useToastCustom";
import { validateLogin } from "repository/auth_repository";
import { LocalStorageId } from "const/const";
import { post_check } from "repository/check_repository";

export const LoginPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const nav = useNavigate();
  const toast = useToastCustom();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!name || !phoneNumber) return;

      const isValid = await validateLogin({ name, phoneNumber });
      if (isValid) {
        localStorage.setItem(LocalStorageId, isValid.id);

        const checkInData = {
          id: isValid.id,
          name: isValid.name,
          checkIn: true,
        };
        await post_check(checkInData);
        toast("체크인 성공! 환영합니다!", "success");
        nav(`/final`);
      } else {
        toast("이름 또는 개인 번호가 올바르지 않습니다.", "error");
      }
    } catch (error) {
      toast("로그인 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <Style.LoginWrapper>
      <Style.LoginCard>
        <h1>🎄 크리스마스 파티 로그인 🎄</h1>
        <p>이름과 개인 번호를 입력해 로그인하세요!</p>
        <Style.LoginForm onSubmit={handleLogin}>
          <label>
            <span>이름</span>
            <input
              type="text"
              placeholder="예: tetedo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            <span>핸드폰 번호</span>
            <input
              type="text"
              placeholder="예: 01012341234 (숫자만 입력)"
              value={phoneNumber || ""}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </label>
          <Style.SubmitButton type="submit">체크인</Style.SubmitButton>
        </Style.LoginForm>
      </Style.LoginCard>
    </Style.LoginWrapper>
  );
};
