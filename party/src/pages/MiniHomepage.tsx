import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Background, Style } from "./MiniHomepage.style";
import {
  get_survey_response,
  get_survey_response_by_personal_number,
} from "repository/survey_repository";
import {
  get_comments_by_personal_number,
  post_comment,
  patch_comment,
  delete_comment,
} from "repository/comment_repository";
import {
  get_likes_by_personal_number,
  post_like,
  delete_like,
} from "repository/like_repository";

import { debounce, throttle } from "utils/utils";
import { useToastCustom } from "hooks/toast/useToastCustom";
import { Timestamp } from "@firebase/firestore";
import { LocalStorageId } from "const/const";

export const MiniHomepage: React.FC = () => {
  const { personalNumber } = useParams<{ personalNumber: string }>();
  const [surveyData, setSurveyData] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [likes, setLikes] = useState<ILike[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [writerInfo, setWriterInfo] = useState<SurveyResponse>();

  const toast = useToastCustom();

  const handleLike = async () => {
    if (!writerInfo) {
      toast("체크인 이후 사용가능합니다.", "error");
      return;
    }

    const fromPersonalNumber = parseInt(writerInfo.personalNumber);
    const toPersonalNumber = parseInt(personalNumber!);

    const existingLike = likes.find(
      (like) => like.fromPersonalNumber === fromPersonalNumber
    );

    if (existingLike) {
      // Unlike
      const success = await delete_like(existingLike.id);
      if (success) {
        setLikes((prev) => prev.filter((like) => like.id !== existingLike.id));
        toast("좋아요를 취소했습니다.", "warning");
      }
    } else {
      // Like
      const likeData = {
        fromPersonalNumber,
        toPersonalNumber,
      };

      const docRef = await post_like(likeData);
      if (docRef) {
        setLikes((prev) => [
          ...prev,
          { ...likeData, id: docRef.id, createdAt: Timestamp.now() },
        ]);
        toast("좋아요를 눌렀습니다.", "success");
      }
    }
  };

  const handleEditComment = (id: string) => {
    const commentToEdit = comments.find((c) => c.id === id);
    if (commentToEdit) {
      setEditingCommentId(id);
      setEditingCommentText(commentToEdit.comment);
    }
  };

  const handleSaveComment = async () => {
    if (!editingCommentId) return;

    const success = await patch_comment(editingCommentId, editingCommentText);
    if (success) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === editingCommentId ? { ...c, comment: editingCommentText } : c
        )
      );
      setEditingCommentId(null);
      setEditingCommentText("");
      toast("댓글이 수정되었습니다.", "success");
    } else {
      toast("댓글 수정에 실패했습니다.", "error");
    }
  };

  const handleDeleteComment = async (id: string) => {
    const success = await delete_comment(id);
    if (success) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast("댓글이 삭제되었습니다.", "success");
    } else {
      toast("댓글 삭제에 실패했습니다.", "error");
    }
  };

  const handleAddComment = async () => {
    if (!writerInfo) {
      toast("체크인 이후 사용가능합니다.", "error");
      return;
    }

    if (!comment.trim()) {
      toast("댓글을 작성해주세요", "warning");
      return;
    }

    const commentObj = {
      writerId: writerInfo.id,
      writerName: writerInfo.name,
      writerImg: writerInfo.profileImg,
      writerPersonalNumber: parseInt(writerInfo.personalNumber),
      comment: comment,
      personalNumber: parseInt(personalNumber!),
    };

    const docRef = await post_comment(commentObj);
    if (docRef) {
      setComment("");
      setComments((prev) => [
        ...prev,
        { ...commentObj, createdAt: Timestamp.now(), id: docRef.id },
      ]);
      toast("댓글을 작성했습니다.", "success");
    } else {
      toast("댓글 작성에 실패했습니다.", "error");
    }
  };

  const addComment = () => {
    throttle(handleAddComment, 1000)();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!personalNumber) return;

      try {
        setLoading(true);
        const [surveyResponse, commentsData, likesData] = await Promise.all([
          get_survey_response_by_personal_number(personalNumber),
          get_comments_by_personal_number(parseInt(personalNumber)),
          get_likes_by_personal_number(parseInt(personalNumber)),
        ]);

        setSurveyData(surveyResponse);
        setComments(commentsData || []);
        setLikes(likesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast("데이터 로딩 중 오류가 발생했습니다.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [personalNumber]);

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

  if (loading) return <p>로딩 중...</p>;
  if (!surveyData)
    return (
      <Background>
        <Style.EmptyState>
          <Style.EmptyStateIcon>🎅</Style.EmptyStateIcon>
          <Style.EmptyStateMessage>
            마이페이지 등록 후 이용할 수 있습니다
          </Style.EmptyStateMessage>
        </Style.EmptyState>
      </Background>
    );

  const isLiked =
    writerInfo &&
    likes.some(
      (like) => like.fromPersonalNumber === parseInt(writerInfo.personalNumber)
    );

  return (
    <Background>
      <Style.Wrapper>
        <Style.Header>
          <Style.ProfileImage src={surveyData.profileImg} alt="Profile" />
          <Style.Username>{surveyData.name}</Style.Username>
        </Style.Header>

        <Style.ContentSection>
          <Style.InfoRow>
            <span>☝️</span>
            <span>번호: {surveyData.personalNumber}</span>
          </Style.InfoRow>
          <Style.InfoRow>
            <span>🎨</span>
            <span>취미: {surveyData.hobby}</span>
          </Style.InfoRow>
          <Style.InfoRow>
            <span>✨</span>
            <span>자기 소개: {surveyData.des}</span>
          </Style.InfoRow>
          <Style.InfoRow>
            <span>🔍</span>
            <span>MBTI: {surveyData.mbti}</span>
          </Style.InfoRow>
          {surveyData.insta && (
            <Style.InfoRow>
              <span>📸</span>
              <a
                href={`https://www.instagram.com/${surveyData.insta}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram: @{surveyData.insta}
              </a>
            </Style.InfoRow>
          )}
        </Style.ContentSection>

        <Style.InteractionSection>
          <Style.InteractionButtons>
            <Style.Button onClick={handleLike} color="#ff0000">
              {isLiked ? (
                <img src="/heart-full.svg" alt="좋아요" />
              ) : (
                <img src="/heart.svg" alt="좋아요" />
              )}
              <span>{likes.length}</span>
            </Style.Button>
            <Style.Button color="#0000ff">
              <img src="/chat.svg" alt="댓글" />
              <span>{comments.length}</span>
            </Style.Button>
          </Style.InteractionButtons>
        </Style.InteractionSection>

        {writerInfo?.personalNumber && (
          <Style.CommentSection>
            <Style.CommentInput
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글 작성..."
            />
            <Style.CommentButton onClick={addComment}>게시</Style.CommentButton>
          </Style.CommentSection>
        )}

        {comments.length > 0 && (
          <Style.CommentList>
            {comments.map((c) => (
              <Style.CommentItem key={c.id}>
                <Style.CommentHeader>
                  <Style.CommentAuthor>
                    <img src={c.writerImg} alt="Author" />
                    <span>{c.writerName}</span>
                  </Style.CommentAuthor>
                </Style.CommentHeader>
                {editingCommentId === c.id ? (
                  <>
                    <Style.CommentInput
                      type="text"
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                    />
                    <Style.ActionButtons>
                      <button onClick={handleSaveComment}>저장</button>
                      <button onClick={() => setEditingCommentId(null)}>
                        취소
                      </button>
                    </Style.ActionButtons>
                  </>
                ) : (
                  <>
                    <Style.CommentBody>{c.comment}</Style.CommentBody>
                    {writerInfo?.personalNumber ===
                      String(c.writerPersonalNumber) && (
                      <Style.ActionButtons>
                        <button onClick={() => handleEditComment(c.id)}>
                          수정
                        </button>
                        <button onClick={() => handleDeleteComment(c.id)}>
                          삭제
                        </button>
                      </Style.ActionButtons>
                    )}
                  </>
                )}
              </Style.CommentItem>
            ))}
          </Style.CommentList>
        )}

        <Style.Footer>
          <p>🎄 크리스마스 파티 미니홈피 🎄</p>
        </Style.Footer>
      </Style.Wrapper>
    </Background>
  );
};
