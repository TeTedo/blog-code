import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Style } from "./AdminPage.style";
import { auth } from "repository/firebase";
import {
  patch_personal_number,
  get_registrations,
  patch_deposit_state,
  delete_registration,
} from "repository/registration_repository";
import { useToastCustom } from "hooks/toast/useToastCustom";
import { get_talks } from "repository/talk_repository";
import { get_survey_responses } from "repository/survey_repository";

const AdminDashboardPage: React.FC = () => {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>([]);
  const [talks, setTalks] = useState<ITalk[]>([]);
  const navigate = useNavigate();
  const toast = useToastCustom();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Fetch admin authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAdminEmail(user.email);
      } else {
        navigate("/admin/login"); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch registrations using pre-built function
  useEffect(() => {
    const fetchData = async () => {
      try {
        const registrationData = await get_registrations();
        setRegistrations(registrationData);
        const talkData = await get_talks();
        setTalks(talkData);
        const surveyData = await get_survey_responses();
        setSurveyData(surveyData);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };
    fetchData();
  }, []);

  // Assign a personal number
  const assignPersonalNumberHandler = async (id: string) => {
    try {
      const personalNumber = await patch_personal_number(id); // Update Firestore
      setRegistrations((prev) =>
        prev.map((reg) => (reg.id === id ? { ...reg, personalNumber } : reg))
      );
      alert(`Personal number ${personalNumber} assigned successfully!`);
    } catch (error) {
      console.error("Error assigning personal number:", error);
    }
  };

  // Update deposit status
  const toggleDepositStatus = async (id: string, currentStatus: boolean) => {
    await patch_deposit_state(id, currentStatus);
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === id ? { ...reg, deposit: !currentStatus } : reg
      )
    );
  };

  // Delete a registration
  const deleteUser = async (id: string) => {
    if (window.confirm("진짜로 삭제해요??? 진짜???")) {
      try {
        await delete_registration(id);
        setRegistrations((prev) => prev.filter((reg) => reg.id !== id));
        toast("삭제 완료", "success");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Logout admin
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  const invitationWord = `🎄도파민에 절여진 다연이의 크리스마스 파티 마무리🎄%0A%0A
안녕하세요! 즐거운 크리스마스 파티에 함께해주셔서 정말 감사합니다 🙌🏻%0A%0A
어제 여러분 덕분에 정말 즐겁고 행복한 시간이었어요! 💝%0A
모두가 함께 만들어준 특별한 추억, 잊지 못할 것 같습니다 ✨%0A%0A
파티의 마지막 선물로 작은 페이지를 준비했어요!%0A
서로에게 남기고 싶은 이야기나 사진들을 공유하면서,%0A
우리의 추억을 더 오래 간직했으면 좋겠어요 🫶🏻%0A%0A
아래 링크에서 서로의 페이지를 방문하고 하고 싶은 말을 남겨주세요!%0A
🌟추억 공유 페이지🌟%0A`;

  const numbers = registrations.map((reg) => reg.contact).join(";");

  return (
    <Style.DashboardWrapper>
      <Style.Title>Admin Dashboard</Style.Title>
      <p>Welcome, {adminEmail}</p>
      <Style.Button onClick={handleLogout}>Logout</Style.Button>

      <span style={{ marginLeft: "3rem" }}>{registrations.length}명 접수!</span>

      <a
        href={`sms:${numbers}?body=${invitationWord}https://invitation.tetedo.com/login`}
        style={{
          textDecoration: "none",
          color: "white",
          backgroundColor: "#ff8080",
          padding: "8px 16px",
          borderRadius: "8px",
          display: "inline-block",
        }}
      >
        {"문자 보내기"}
      </a>
      <Style.Table>
        <thead>
          <tr>
            {isMobile && <th>문자 보내기</th>}
            <th>id</th>
            <th>설문조사여부</th>
            <th>이름</th>
            <th>연락처</th>
            <th>성별</th>
            <th>추천인</th>
            <th>입금 여부</th>
            <th>개인 번호</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {[...registrations]
            .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
            .map((reg) => (
              <tr key={reg.id}>
                {isMobile && (
                  <td>
                    <a
                      href={`sms:${reg.contact}?body=${invitationWord}https://invitation.tetedo.com/landing/${reg.id}`}
                      style={{
                        textDecoration: "none",
                        color: "white",
                        backgroundColor: "#ff8080",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        display: "inline-block",
                      }}
                    >
                      {"문자 보내기"}
                    </a>
                  </td>
                )}
                <td>{reg.id}</td>
                <td>{surveyData.some((s) => s.id === reg.id) ? "O" : "X"}</td>
                <td>{reg.name}</td>
                <td>{reg.contact}</td>
                <td>{reg.gender}</td>
                <td>{reg.recommender}</td>
                <td>{reg.deposit ? "입금완료" : "미입금"}</td>
                <td>{reg.personalNumber ? reg.personalNumber : "미배정"}</td>
                <td>
                  {!reg.personalNumber && (
                    <Style.Button
                      onClick={() => assignPersonalNumberHandler(reg.id)}
                    >
                      개인 번호 배정
                    </Style.Button>
                  )}
                  {!reg.deposit && (
                    <Style.Button
                      onClick={() => toggleDepositStatus(reg.id, reg.deposit)}
                    >
                      입금 완료로 변경
                    </Style.Button>
                  )}
                  <Style.Button
                    onClick={() => deleteUser(reg.id)}
                    style={{ backgroundColor: "red", color: "white" }}
                  >
                    유저 삭제
                  </Style.Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Style.Table>
      <Style.Table>
        <thead>
          <tr>
            <th>이름</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          {[...talks].map((tk, idx) => (
            <tr key={idx}>
              <td>{tk.request.name}</td>
              <td>{tk.request.talk}</td>
            </tr>
          ))}
        </tbody>
      </Style.Table>
    </Style.DashboardWrapper>
  );
};

export default AdminDashboardPage;
