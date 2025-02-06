import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { get_survey_responses } from "repository/survey_repository";
import {
  getGalleryImages,
  uploadImageToStorage,
} from "repository/storage_repository";
import { Style } from "./Final.style";

export const Final = () => {
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [partyImages, setPartyImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const responses = await get_survey_responses();
        setSurveyData(responses);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        const images = await getGalleryImages();
        setPartyImages(images);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();

    fetchSurveyData();
  }, []);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);

      // 선택된 모든 파일을 순차적으로 업로드
      const uploadPromises = Array.from(files).map((file) =>
        uploadImageToStorage(file, "party-gallery")
      );

      const uploadedUrls = await Promise.all(uploadPromises);

      setPartyImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // 입력 초기화
      }
    }
  };

  if (loading) {
    return <Style.LoadingWrapper>로딩 중...</Style.LoadingWrapper>;
  }

  return (
    <Style.Container>
      <Style.Header>
        <Style.Title>🎄 크리스마스 파티 참가자 미니홈피 🎄</Style.Title>
        <Style.Subtitle>모두의 미니홈피를 구경해보세요!</Style.Subtitle>
      </Style.Header>

      {/* 이미지 갤러리 섹션 */}
      <Style.GallerySection>
        <Style.GalleryTitle>🎉 파티 사진 갤러리 🎉</Style.GalleryTitle>

        <Style.UploadSection>
          <Style.UploadButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "업로드 중..." : "파티 사진 업로드하기"}
          </Style.UploadButton>

          <Style.FileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            multiple // 여러 장의 이미지를 한 번에 선택할 수 있도록 추가
          />
        </Style.UploadSection>

        <Style.ImageGrid>
          {partyImages.map((url, index) => (
            <Style.ImageCard key={index}>
              <Style.Image src={url} alt={`파티 사진 ${index + 1}`} />
              <Style.DownloadButton
                href={url}
                download={`party-photo-${index + 1}.jpg`}
                target="_blank"
                rel="noopener noreferrer"
              >
                다운로드
              </Style.DownloadButton>
            </Style.ImageCard>
          ))}
        </Style.ImageGrid>
      </Style.GallerySection>

      {/* 참가자 목록 섹션 */}
      <Style.List>
        {surveyData.map((person) => (
          <Style.ListItem key={person.id}>
            <Link to={`/mini-homepage/${person.personalNumber}`}>
              <Style.Card>
                <Style.ProfileSection>
                  <Style.ProfileImage
                    src={person.profileImg}
                    alt={person.name}
                  />
                  <Style.ProfileInfo>
                    <Style.Name>{person.name}</Style.Name>
                    <Style.Info>
                      <span>🎯 {person.mbti}</span>
                      <span>🎨 {person.hobby}</span>
                    </Style.Info>
                  </Style.ProfileInfo>
                </Style.ProfileSection>
                <Style.ViewButton>구경가기 →</Style.ViewButton>
              </Style.Card>
            </Link>
          </Style.ListItem>
        ))}
      </Style.List>
    </Style.Container>
  );
};
