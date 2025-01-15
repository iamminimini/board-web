import Button from '@atlaskit/button/new';
import Comment from '@atlaskit/comment';
import { Flex } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';
import { CommentType } from '@type/post';
import dayjs from 'dayjs';
import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { Stack, Text } from '@atlaskit/primitives';

interface CommentItemProps {
  comment: CommentType;
  onSave: (id: number, updatedContent: string) => void;
}

const CommentItem = ({ comment, onSave }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSave = () => {
    setIsEditing(false);
    onSave(comment.id, editContent); // 수정 내용 저장
  };

  return (
    <CommentEditWrapper>
      {isEditing ? (
        <>
          <TextField
            value={editContent}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEditContent(e.target.value)
            }
            rows={3}
          />
          <Button appearance='primary' onClick={handleSave}>
            저장
          </Button>
        </>
      ) : (
        <>
          <Comment
            author={
              <Flex gap={'space.100'} alignItems='center'>
                <Text weight='bold'>{comment.userId}</Text>
                <Text size='small' weight='regular' color='color.text.subtlest'>
                  {dayjs(comment?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </Flex>
            }
            content={comment.content}
            avatar={<></>}
          />
          <Flex>
            <Button appearance='subtle' onClick={() => setIsEditing(true)}>
              수정
            </Button>
          </Flex>
        </>
      )}
    </CommentEditWrapper>
  );
};

export default CommentItem;

const CommentEditWrapper = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  min-height: 60px;
  justify-content: space-between;
  background-color: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #d7d7d7;
`;
