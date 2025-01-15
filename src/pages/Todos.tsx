import { useHistory, useLocation } from 'react-router-dom';
import { TodoTableDataType } from '@type/todo';
import Table, { ColumnProps } from '@components/commons/Table';

import styled from 'styled-components';
import PageHeader from '@atlaskit/page-header';
import { useGetTodos } from '@react-query/queries/todoQueries';
import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import Lozenge from '@atlaskit/lozenge';
import CheckMarkIcon from '@atlaskit/icon/core/check-mark';

import { useTranslation } from 'react-i18next';

const TodoList = () => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  // URL 쿼리에서 userId를 추출합니다.
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId'); // userId를 쿼리 파라미터에서 가져옴

  const { todosData, isLoading } = useGetTodos(
    userId ? Number(userId) : undefined
  );

  // 사용자 이름 클릭시 사용자가 작성한 할일 목록 노출
  const handleUserTodosSearch = (item: TodoTableDataType) => {
    if (!item.userId || !item.userName) return;
    history.push(`${location.pathname}?userId=${item.userId}`);
  };

  const columns: ColumnProps<TodoTableDataType>[] = [
    {
      key: 'id',
      content: t('todos.columns.id'),
      width: 10,
    },
    {
      key: 'title',
      content: t('todos.columns.title'),
    },
    {
      key: 'userName',
      content: t('todos.columns.user_name'),
      render: (_, item) => (
        <TextButton onClick={() => handleUserTodosSearch(item)}>
          {item.userName}
        </TextButton>
      ),
    },
    {
      key: 'completed',
      content: t('todos.columns.completed'),
      render: (_, item) => (
        <div>
          {item.completed ? (
            <Lozenge isBold appearance='success'>
              <LozengeContent>
                {t('todos.completed_status.done')}{' '}
                <CheckMarkIcon label='check' />
              </LozengeContent>
            </Lozenge>
          ) : (
            <Lozenge>
              <LozengeContent>
                {t('todos.completed_status.not_done')}
              </LozengeContent>
            </Lozenge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        {t('todos.page_header', { user: userId })}
        {userId && (
          <BackButton
            onClick={() => {
              history.goBack();
            }}
          >
            <ArrowLeftIcon label='arrow_left' /> {t('back_to_list')}
          </BackButton>
        )}
      </PageHeader>
      <Table
        columns={columns}
        data={todosData}
        isLoading={isLoading}
        emptyMessage={t('todos.table_empty_message')}
      />
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

const BackButton = styled.button`
  border: 0;
  background-color: #fff;
  position: absolute;
  top: 10px;
  left: 15px;
  cursor: pointer;
  & svg {
    margin-right: 3px;
  }
`;
