import { useEffect, useState } from 'react';
import { TodoTableDataType } from '@type/todo';
import Table, { ColumnProps } from '@components/commons/Table';
import CheckMarkIcon from '@atlaskit/icon/core/check-mark';
import Lozenge from '@atlaskit/lozenge';
import styled from 'styled-components';
import PageHeader from '@atlaskit/page-header';
import { t } from 'i18next';
import { useGetTodos } from '@react-query/queries/todoQueries';
import { useHistory } from 'react-router-dom';
import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import { LinkButton } from '@atlaskit/button/new';
import { Box, Inline, Stack } from '@atlaskit/primitives';

const TodoList = () => {
  const history = useHistory();
  // URL 쿼리에서 userId를 추출합니다.
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId'); // userId를 쿼리 파라미터에서 가져옴

  const { todosData, isLoading } = useGetTodos(
    userId ? Number(userId) : undefined
  );
  const handleUserTodosSearch = (item: TodoTableDataType) => {
    if (!item.userId || !item.userName) return;
    history.push(`/todos?userId=${item.userId}`);
  };

  const columns: ColumnProps<TodoTableDataType>[] = [
    {
      key: 'id',
      content: 'ID',
      width: 10,
    },
    {
      key: 'title',
      content: 'title',
    },
    {
      key: 'userName',
      content: 'UserName',
      render: (_, item) => (
        <TextButton onClick={() => handleUserTodosSearch(item)}>
          {item.userName}
        </TextButton>
      ),
    },
    {
      key: 'completed',
      content: 'Completed',
      render: (_, item) => (
        <div>
          {item.completed ? (
            <Lozenge isBold appearance='success'>
              <LozengeContent>
                완료 <CheckMarkIcon label='check' />
              </LozengeContent>
            </Lozenge>
          ) : (
            <Lozenge>
              <LozengeContent>미완료</LozengeContent>
            </Lozenge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <Stack space='space.500'>
          {t('navigation.users')}
          <Inline>
            {userId && (
              <LinkButton spacing='compact' href='/todos'>
                <ArrowLeftIcon label='arrow_left' /> 전체 목록 돌아가기
              </LinkButton>
            )}
          </Inline>
        </Stack>
      </PageHeader>
      <Table columns={columns} data={todosData} isLoading={isLoading} />
    </div>
  );
};

export default TodoList;

// LozengeContent 스타일 적용
const LozengeContent = styled.div`
  display: inline-flex;
  min-width: 50px;
  padding: 4px;
  gap: 4px;
  justify-content: center;
  & svg {
    width: 10px;
  }
`;

const TextButton = styled.a`
  cursor: pointer;
`;
