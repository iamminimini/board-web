import { useState, useEffect } from 'react';
import Button from '@atlaskit/button/new';
import { ButtonGroup } from '@atlaskit/button';
import Avatar from '@atlaskit/avatar';
import { User } from '@type/user';
import EditUserModal from '@components/Users/EditUserModal';
import PageHeader from '@atlaskit/page-header';
import { t } from 'i18next';
import styled from 'styled-components';
import { useGetUsers } from '@react-query/queries/userQueries';
import AutocompleteTextfield from '@components/commons/AutocompleteTextfield';
import Dropdown from '@components/commons/DropDown';
import Table, { ColumnProps } from '@components/commons/Table';

function Users() {
  const { usersData, isLoading } = useGetUsers();
  const [data, setData] = useState<User[]>(usersData || []);
  // 검색 관련 state
  const [searchCategory, setSearchCategory] = useState<keyof User>('name');
  const [selectedUserId, setSelectedUserId] = useState<number>();
  // 모달 관련 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 검색어 카테고리
  const searchCategoryOptions = [
    { key: 'name', label: t('users.search_category_options.name') },
    { key: 'email', label: t('users.search_category_options.email') },
  ];

  // 행 삭제 함수
  const deleteRow = (id: number) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
  };

  // 테이블 컬럼 정의
  const columns: ColumnProps<User>[] = [
    {
      key: 'id',
      content: t('users.columns.id'),
      isSortable: true,
      width: 5,
    },
    {
      key: 'profile',
      content: t('users.columns.profile'),
      render: (_, item) => (
        <Avatar
          appearance='circle'
          src='https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg'
          size='large'
          name={item.name}
        />
      ),
    },
    { key: 'name', content: t('users.columns.name'), width: 5 },
    { key: 'email', content: t('users.columns.email'), width: 75 },
    {
      key: 'actions',
      content: t('users.columns.actions'),
      width: 10,
      render: (_, item) => (
        <ButtonGroup>
          <Button onClick={() => openModal(item.id)} appearance='default'>
            {t('buttons.edit')}
          </Button>
          <Button onClick={() => deleteRow(item.id)} appearance='danger'>
            {t('buttons.delete')}
          </Button>
        </ButtonGroup>
      ),
    },
  ];

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

  const handleFilter = (filteredData: string) => {
    // 필터된 데이터가 비었을 경우 모든 데이터로 복원
    if (!filteredData) {
      setData(usersData || []); // usersData가 undefined일 경우 빈 배열을 설정
      return;
    }
    // 이름이 정확히 일치하는 사용자만 필터링
    const filteredUsers = usersData?.filter((user) =>
      user[searchCategory]
        .toString()
        .toLowerCase()
        .includes(filteredData.toLowerCase())
    );

    setData(filteredUsers || []);
  };

  const handleCategoryChange = (key: string) => {
    setSearchCategory(key as keyof User);
  };

  useEffect(() => {
    if (usersData) setData(usersData);
  }, [usersData]);

  return (
    <div>
      <PageHeader>{t('users.page_header')}</PageHeader>
      <SearchBarWrapper>
        <Dropdown
          options={searchCategoryOptions}
          selectedKey={searchCategory}
          onChange={handleCategoryChange}
        />
        <AutocompleteTextfield
          placeholder={t('users.search_placeholder')}
          data={usersData || []} // 모든 데이터 전달
          keyField={searchCategory} // 필터링 기준 필드
          onFilter={handleFilter} // 필터링된 데이터를 처리할 콜백
        />
      </SearchBarWrapper>
      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyMessage={t('users.table_empty_message')}
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
