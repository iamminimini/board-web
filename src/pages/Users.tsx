import { useState, useEffect, ChangeEvent } from 'react';
import DynamicTable from '@atlaskit/dynamic-table';
import Button from '@atlaskit/button/new';
import { ButtonGroup } from '@atlaskit/button';
import Avatar from '@atlaskit/avatar';
import TextField from '@atlaskit/textfield';
import '@atlaskit/css-reset'; // 스타일 추가
import { RowType } from '@atlaskit/dynamic-table/dist/types/types';
import { User } from '@type/user';
import EditUserModal from '@components/Users/EditUserModal';
import PageHeader from '@atlaskit/page-header';
import { t } from 'i18next';
import styled from 'styled-components';
import { useGetUsers } from '@react-query/queries/userQueries';

function Users() {
  const { usersData, isLoading } = useGetUsers();

  const [data, setData] = useState<User[]>(usersData || []);
  const [rows, setRows] = useState<RowType[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 행 삭제 함수
  const deleteRow = (id: number) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
  };

  useEffect(() => {
    if (usersData) setData(usersData);
  }, [usersData]);

  // 테이블 컬럼 정의
  const head = {
    cells: [
      {
        key: 'id',
        content: 'ID',
        isSortable: true,
        width: 10,
      },
      {
        key: 'profile',
        content: '',
        width: 10,
      },
      { key: 'name', content: 'Name' },
      {
        key: 'actions',
        content: 'Actions',
      },
    ],
  };

  // 행 렌더링
  useEffect(() => {
    if (!data) return;
    const newRows = data.map((row) => ({
      key: row.id.toString(),
      cells: [
        { key: `${row.id}-id`, content: row.id },
        {
          key: `${row.id}-image`,
          content: (
            <Avatar
              appearance='circle'
              src='https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg'
              size='large'
              name={row.name}
            />
          ),
        },
        { key: `${row.id}-name`, content: row.name },
        { key: `${row.id}-email`, content: row.email },
        {
          key: `${row.id}-action`,
          content: (
            <ButtonGroup>
              <Button onClick={() => openModal(row.id)} appearance='default'>
                수정
              </Button>
              <Button onClick={() => deleteRow(row.id)} appearance='danger'>
                삭제
              </Button>
            </ButtonGroup>
          ),
        },
      ],
    }));
    setRows(newRows);
  }, [data]);

  // 사용자 정보 모달 열기
  const openModal = (id: number) => {
    if (!id) return;
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  // 사용자 정보 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <PageHeader>{t('navigation.users')}</PageHeader>
      <SearchBarWrapper>
        <TextField
          placeholder='사용자 이름을 입력하세요'
          value={searchKeyword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchKeyword(e.target.value)
          }
          width={300}
        />
      </SearchBarWrapper>
      <DynamicTable
        isFixedSize
        head={head}
        rows={rows}
        rowsPerPage={5}
        page={1}
        // onPageChange={(newPage: number) => setPage(newPage + 1)}
        defaultPage={0}
        loadingSpinnerSize='large'
        isLoading={false}
        emptyView={<div>데이터가 없습니다.</div>}
      />
      {/* 사용자 상세보기 모달 */}
      {isModalOpen && selectedUserId && (
        <EditUserModal userId={selectedUserId} onClose={closeModal} />
      )}
    </div>
  );
}

export default Users;

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: 10px;
  margin-bottom: 30px;
`;
