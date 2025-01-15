import { useEffect, useState } from 'react';
import { PostItem } from '@type/post';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import PageHeader from '@atlaskit/page-header';
import { t } from 'i18next';
import { DatePicker } from '@atlaskit/datetime-picker';
import AutocompleteTextfield from '@components/commons/AutocompleteTextfield';
import Table, { ColumnProps } from '@components/commons/Table';
import { useGetPosts } from '@react-query/queries/postQueries';
import dayjs from 'dayjs';

const Posts = () => {
  const { postsData, isLoading } = useGetPosts();
  const [filteredData, setFilteredData] = useState<PostItem[]>(postsData || []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    if (postsData) {
      // 날짜와 제목 필터를 다시 적용
      applyFilters(postsData, selectedDate, '');
    }
  }, [postsData]);

  const goToPostDetail = (id: number) => {
    history.push(`post/${id}`);
  };

  const columns: ColumnProps<PostItem>[] = [
    {
      key: 'id',
      content: 'ID',
      isSortable: true,
      width: 5,
    },
    {
      key: 'title',
      content: 'Title',
      width: 20,
      render: (_, item) => (
        <TitleLink onClick={() => goToPostDetail(item.id)}>
          {item.title}
        </TitleLink>
      ),
    },
    {
      key: 'content',
      content: 'Content',
    },
    {
      key: 'createdAt',
      content: 'CreatedAt',
      render: (_, item) => (
        <>{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</>
      ),
    },
  ];

  const applyFilters = (
    posts: PostItem[],
    dateFilter: string | null,
    textFilter: string
  ) => {
    let filtered = posts;

    // 날짜 필터링
    if (dateFilter) {
      filtered = filtered.filter((post) =>
        dayjs(post.createdAt).isSame(dateFilter, 'day')
      );
    }

    // 제목 필터링
    if (textFilter) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(textFilter.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleDateChange = (date: string | null) => {
    setSelectedDate(date);
    applyFilters(postsData || [], date, '');
  };

  const handleTitleFilter = (text: string) => {
    applyFilters(postsData || [], selectedDate, text);
  };

  return (
    <div>
      <PageHeader>{t('navigation.posts')}</PageHeader>
      <SearchBarWrapper>
        <DatePicker
          dateFormat='YYYY-MM-DD'
          id='default-date-picker-example'
          clearControlLabel='Clear date'
          shouldShowCalendarButton
          openCalendarLabel='open calendar'
          placeholder='날짜를 선택하세요'
          spacing='compact'
          onChange={handleDateChange}
        />
        {/* 이미 날짜로 필터가 되었으면 filteredData 아니면 전체 데이터 전달*/}
        <AutocompleteTextfield
          placeholder='제목을 입력하세요'
          data={filteredData || postsData}
          keyField={'title'}
          onFilter={handleTitleFilter}
        />
      </SearchBarWrapper>
      <Table columns={columns} data={filteredData} isLoading={isLoading} />
    </div>
  );
};

export default Posts;

// 스타일 정의
const TitleLink = styled.a`
  text-decoration: underline;
  cursor: pointer;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: 10px;
  margin-bottom: 30px;
`;
