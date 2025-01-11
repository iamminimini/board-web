import { useState, useEffect, ChangeEvent } from 'react';
import DynamicTable from '@atlaskit/dynamic-table';
import Button from '@atlaskit/button/new';
import { ButtonGroup } from '@atlaskit/button';
import Avatar from '@atlaskit/avatar';
import TextField from '@atlaskit/textfield';
import '@atlaskit/css-reset'; // 스타일 추가
import { RowType } from '@atlaskit/dynamic-table/dist/types/types';
import { User } from '@type/user';
import EditUserModal from '@components/EditUserModal';
import PageHeader from '@atlaskit/page-header';
import { useTranslation } from 'react-i18next';

function Users() {
  const initialData: User[] = [
    { id: 1, name: 'John Doe', age: 28 },
    { id: 2, name: 'Jane Smith', age: 34 },
    { id: 3, name: 'Sam Johnson', age: 45 },
    { id: 3, name: 'Sam Johnson', age: 45 },
    { id: 3, name: 'Sam Johnson', age: 45 },
    { id: 3, name: 'Sam Johnson', age: 45 },
    { id: 3, name: 'Sam Johnson', age: 45 },
    { id: 3, name: 'Sam Johnson', age: 45 },
  ];

  const [data, setData] = useState<User[]>(initialData);
  const [rows, setRows] = useState<RowType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  // 행 삭제 함수
  const deleteRow = (id: number) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
  };

  // 사용자 정보 수정 함수
  const editUser = (updatedUser: User) => {
    setData((prevData) =>
      prevData.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  // 테이블 컬럼 정의
  const head = {
    cells: [
      {
        key: 'profile',
        content: 'Profile',
        width: 10,
      },
      {
        key: 'id',
        content: 'ID',
        isSortable: true,
        width: 10,
      },
      { key: 'name', content: 'Name' },
      { key: 'age', content: 'Age' },
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
        { key: `${row.id}-id`, content: row.id },
        { key: `${row.id}-name`, content: row.name },
        { key: `${row.id}-age`, content: row.age },
        {
          key: `${row.id}-content`,
          content: (
            <ButtonGroup>
              <Button onClick={() => openModal(row)} appearance='default'>
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
  const openModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // 사용자 정보 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <PageHeader>{t('navigation.users')}</PageHeader>
      검색
      <TextField
        placeholder='Search users'
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        width='300px'
      />
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
      {isModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={closeModal}
          onSave={editUser}
        />
      )}
    </div>
  );
}

export default Users;
