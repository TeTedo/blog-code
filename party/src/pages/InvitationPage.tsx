import React, { useEffect, useRef, useState } from "react";
import { Style } from "./InvitationPage.style";
import { useNavigate, useParams } from "react-router-dom";
import {
  get_survey_response,
  post_survey_response,
} from "repository/survey_repository";
import { get_registration_by_id } from "repository/registration_repository";
import { useToastCustom } from "hooks/toast/useToastCustom";
import { post_talk } from "repository/talk_repository";
import { uploadImageToStorage } from "repository/storage_repository";

export const InvitationPage: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const [personalNumber, setPersonalNumber] = useState<number>(0);
  const { code } = useParams<{ code: string }>();
  const nav = useNavigate();
  const toast = useToastCustom();

  const [talk, setTalk] = useState<string>("");

  const [isModifiedImg, setIsModifiedImg] = useState<boolean>(false);
  const [surveyForm, setSurveyForm] = useState<SurveyResponse>({
    id: code || "", // registration id와 동일
    name: name || "",
    hobby: "",
    des: "",
    insta: "",
    personalNumber: personalNumber.toString(),
    mbti: "",
    profileImg: "https://api.dicebear.com/5.x/adventurer/svg?seed=default",
    drink: "",
  });

  const imgRef = useRef<HTMLInputElement | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // 미리보기 이미지 상태
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSurveyForm({ ...surveyForm, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let profileImg = surveyForm.profileImg;

      setLoading(true);
      if (isModifiedImg && imgRef.current?.files?.[0] && personalNumber) {
        profileImg = await uploadImageToStorage(
          imgRef.current.files[0],
          personalNumber.toString()
        );
      }

      await post_survey_response({
        ...surveyForm,
        profileImg,
        name: name!,
        personalNumber: personalNumber.toString(),
      });
      if (talk.trim()) {
        await post_talk({ name: name!, talk });
      }
      setSubmitted(true);
      setLoading(false);
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !code) return;
    const file = e.target.files[0];

    try {
      // 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // 파일을 Base64 URL로 변환
      };
      reader.readAsDataURL(file);

      setIsModifiedImg(true);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (!code) {
      nav("/registration");
      return;
    } // code가 없는 경우 반환

    // fetch registration
    (async () => {
      try {
        const registration = await get_registration_by_id(code); // Firebase에서 조회
        if (registration) {
          setSurveyForm({
            ...surveyForm,
            name: registration.name,
            personalNumber: registration.personalNumber!.toString(),
          });
          setName(registration.name); // name 가져오기
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

    // fetch survey
    (async () => {
      try {
        const survey = await get_survey_response(code); // Firebase에서 조회
        if (survey && personalNumber) {
          setSurveyForm({
            id: code,
            name: survey.name,
            des: survey.des,
            hobby: survey.hobby,
            insta: survey.insta,
            personalNumber: personalNumber.toString(),
            profileImg: survey.profileImg,
            mbti: survey.mbti,
            drink: survey.drink,
          });

          setSubmitted(true);
        } else {
        }
      } catch (error) {
        toast("프로필 불러오는데 오류...! 어서 알려주세요..ㅠ ㅠ", "error");
      }
    })();
  }, [code, nav, personalNumber]);

  return (
    <Style.InvitationWrapper>
      <Style.InvitationCard>
        <Style.InvitationHeader>🎄 개인 초대장 🎄</Style.InvitationHeader>

        {!submitted ? (
          <>
            {loading ? (
              <p>저장중.... 둑흔둑흔🎉🎉🎉</p>
            ) : (
              <>
                <Style.InvitationBody>
                  <div>아래 작성해주시는 내용을 토대로</div>
                  <div>개인 페이지가 생성될 예정이에요!</div>
                </Style.InvitationBody>
                <Style.SurveyForm onSubmit={handleSubmit}>
                  <Style.ImgContainer>
                    <img
                      src={previewImage || surveyForm.profileImg}
                      alt="프로필"
                    />
                    <label htmlFor="imageUpload">대표 이미지 바꾸기</label>
                    <input
                      ref={imgRef}
                      id="imageUpload"
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Style.ImgContainer>
                  <label>
                    <span>MBTI</span>
                    <input
                      type="text"
                      name="mbti"
                      placeholder="예: EnfP"
                      value={surveyForm.mbti}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    <span>취미</span>
                    <input
                      type="text"
                      name="hobby"
                      placeholder="예: 독서, 영화 감상"
                      value={surveyForm.hobby}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    <span>자기 소개</span>
                    <textarea
                      name="des"
                      placeholder="간단한 자기 소개를 작성해주세요."
                      value={surveyForm.des}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    <span>인스타그램 아이디 (선택)</span>
                    <input
                      type="text"
                      name="insta"
                      placeholder="예: taes__eok"
                      value={surveyForm.insta}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    <div>급 밸런스게임! 와인 vs 하이볼</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "2rem",
                      }}
                    >
                      <label>
                        <input
                          type="radio"
                          value={"와인"}
                          name="drink"
                          checked={surveyForm.drink === "와인"}
                          onChange={handleChange}
                        />
                        와인
                      </label>
                      <label>
                        <input
                          type="radio"
                          value={"하이볼"}
                          name="drink"
                          checked={surveyForm.drink === "하이볼"}
                          onChange={handleChange}
                        />
                        하이볼
                      </label>
                    </div>
                  </label>
                  <label>
                    <div>
                      주최에게 하고 싶은 말! (비공개로 저희만 볼게요! 😍)
                    </div>
                    <div>궁금하신점 있으시면 Q&A 로도 만들 생각이에요!</div>

                    <input
                      type="text"
                      placeholder="예: 다연님은 뭐 입고 올거에요?"
                      value={talk}
                      onChange={(e) => setTalk(e.target.value)}
                    />
                  </label>
                  <Style.SubmitButton type="submit">
                    프로필 저장
                  </Style.SubmitButton>
                </Style.SurveyForm>
              </>
            )}
          </>
        ) : (
          <>
            <p>🎉 저장이 완료되었습니다! 감사합니다! 🎉</p>
            <div
              style={{
                display: "flex",
                gap: "2rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Style.SubmitButton onClick={() => setSubmitted(false)}>
                프로필 다시 작성
              </Style.SubmitButton>
              <Style.SubmitButton
                onClick={() => {
                  nav(`/landing/${code}`);
                }}
              >
                초대장으로 돌아가기
              </Style.SubmitButton>
            </div>
          </>
        )}
      </Style.InvitationCard>
    </Style.InvitationWrapper>
  );
};
