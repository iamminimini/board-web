import { useEffect, useState } from 'react';
import { User } from '@type/user';
import Table, { ColumnProps } from '@components/Table';
import Avatar from '@atlaskit/avatar';
import Button, { ButtonGroup } from '@atlaskit/button';

const Board = () => {
  const initialData: User[] = [
    { id: 1, name: 'John Doe', age: 28 },
    { id: 2, name: 'Jane Smith', age: 34 },
    { id: 3, name: 'Sam Johnson', age: 45 },
  ];

  const [data, setData] = useState<User[]>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [data]);

  const columns: ColumnProps<User>[] = [
    {
      key: 'profile',
      content: 'Profile',
      width: 10,
      render: (_, item) => (
        <Avatar
          appearance='circle'
          src='https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg'
          size='large'
          name={item.name}
        />
      ),
    },
    {
      key: 'id',
      content: 'ID',
      isSortable: true,
      width: 10,
    },
    {
      key: 'name',
      content: 'Name',
    },
    {
      key: 'age',
      content: 'Age',
    },
    {
      key: 'actions',
      content: 'Actions',
      render: (_, item) => (
        <ButtonGroup>
          <Button onClick={() => {}} appearance='default'>
            수정
          </Button>
          <Button onClick={() => {}} appearance='danger'>
            삭제
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <div>
      <h1>게시물 목록!!!</h1>
      <Table columns={columns} data={data}></Table>
    </div>
  );
};

export default Board;
