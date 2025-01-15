import { ChangeEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CommentItem from '@components/Posts/CommentItem';
import { CommentType } from '@type/post';

import styled from 'styled-components';
import Button from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';
import { Stack, Text } from '@atlaskit/primitives';
import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import PageHeader from '@atlaskit/page-header';
import {
  useGetPost,
  useGetPostComment,
} from '@react-query/queries/postQueries';

import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const PostDetail = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { postData } = useGetPost(Number(id));
  const { commentsData } = useGetPostComment(Number(id));

  // 댓글 상태 관리
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    if (!commentsData) return;
    setComments(commentsData);
  }, [commentsData]);

  // 댓글 작성
  const handleCommentSubmit = () => {
    const comment: CommentType = {
      id: comments.length + 1,
      postId: Number(id),
      userId: 1,
      content: newComment,
      createdAt: dayjs().toString(),
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  // 댓글 수정 (API X)
  const handleCommentSave = (id: number, updatedContent: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content: updatedContent } : c))
    );
  };

  const actionsContent = (
    <BackButton
      onClick={() => {
        history.goBack();
      }}
    >
      <ArrowLeftIcon label={t('back_to_list')} />
      <Text> {t('back_to_list')}</Text>
    </BackButton>
  );

  return (
    <Container>
      <PageHeader actions={actionsContent}>{postData?.title || '-'}</PageHeader>
      <Stack space='space.100'>
        <BoardContentWrapper>
          <Text>{postData?.content}</Text>
        </BoardContentWrapper>
        <Text size='small' color='color.text.accent.gray' align='end'>
          <b>
            {t('post_detail.created_at', {
              date: dayjs(postData?.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            })}
          </b>
        </Text>
      </Stack>
      <Stack space='space.150'>
        <Text weight='bold'>
          {t('post_detail.comments_count', { count: comments.length || 0 })}
        </Text>
        {/* 댓글 입력 */}
        <CommentInputWrapper>
          <TextField
            value={newComment}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewComment(e.target.value)
            }
            placeholder={t('post_detail.comment_placeholder')}
            rows={3}
          />
          <Button appearance='default' onClick={handleCommentSubmit}>
            {t('post_detail.comment_submit')}
          </Button>
        </CommentInputWrapper>
        {/* 댓글 목록 */}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onSave={handleCommentSave}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default PostDetail;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding-top: 20px;
`;

const BoardContentWrapper = styled.div`
  min-height: 300px;
  padding: 16px 5px;
  border-top: 1px solid #e0e0e0;
`;

const CommentInputWrapper = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 10px;
`;

const BackButton = styled.button`
  border: 0;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
`;
