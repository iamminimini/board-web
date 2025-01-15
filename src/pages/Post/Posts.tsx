import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PostItem } from '@type/post';
import AutocompleteTextfield from '@components/commons/AutocompleteTextfield';
import Table, { ColumnProps } from '@components/commons/Table';
import { useGetPosts } from '@react-query/queries/postQueries';

import styled from 'styled-components';
import PageHeader from '@atlaskit/page-header';
import { DatePicker } from '@atlaskit/datetime-picker';

import { t } from 'i18next';
import dayjs from 'dayjs';

const Posts = () => {
  // postsData와 isLoading을 useGetPosts 훅을 통해 가져옴
  const { postsData, isLoading } = useGetPosts();
  // 필터링된 데이터를 저장하는 상태
  const [filteredData, setFilteredData] = useState<PostItem[]>(postsData || []);
  // 선택된 날짜 상태
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // history는 페이지 이동을 위해 사용
  const history = useHistory();

  // 테이블에 표시할 데이터 열 정의
  const columns: ColumnProps<PostItem>[] = [
    {
      key: 'id',
      content: t('posts.columns.id'),
      width: 5,
    },
    {
      key: 'title',
      content: t('posts.columns.title'),
      width: 20,
      render: (_, item) => (
        <TitleLink onClick={() => goToPostDetail(item.id)}>
          {item.title}
        </TitleLink>
      ),
    },
    {
      key: 'content',
      content: t('posts.columns.content'),
    },
    {
      key: 'createdAt',
      content: t('posts.columns.createdAt'),
      render: (_, item) => (
        // 날짜 포맷팅
        <>{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</>
      ),
    },
  ];

  // 게시글에 필터를 적용하는 함수
  const updateFilteredPosts = (
    posts: PostItem[],
    dateFilter: string | null,
    textFilter: string
  ) => {
    let filtered = posts;

    // 날짜 필터링: 날짜 필터가 있다면 해당 날짜와 동일한 게시글만 필터링
    if (dateFilter) {
      filtered = filtered.filter((post) =>
        dayjs(post.createdAt).isSame(dateFilter, 'day')
      );
    }

    // 제목 필터링: 제목에 입력된 텍스트가 포함된 게시글만 필터링
    if (textFilter) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(textFilter.toLowerCase())
      );
    }

    // 필터링된 데이터 상태 업데이트
    setFilteredData(filtered);
  };

  // 게시글 상세 페이지로 이동하는 함수
  const goToPostDetail = (id: number) => {
    history.push(`post/${id}`);
  };

  // 날짜 필터가 변경되었을 때 호출되는 함수
  const handleDateChange = (date: string | null) => {
    setSelectedDate(date);
    // 필터 업데이트
    updateFilteredPosts(postsData || [], date, '');
  };

  // 제목 필터가 변경되었을 때 호출되는 함수
  const handleTitleFilter = (text: string) => {
    updateFilteredPosts(postsData || [], selectedDate, text);
  };

  // postsData가 변경될 때마다 필터를 다시 적용
  useEffect(() => {
    if (postsData) {
      updateFilteredPosts(postsData, selectedDate, '');
    }
  }, [postsData]);

  return (
    <div>
      {/* 페이지 헤더 */}
      <PageHeader>{t('posts.page_header')}</PageHeader>
      <SearchBarWrapper>
        {/* 날짜 선택 필터 */}
        <DatePicker
          dateFormat='YYYY-MM-DD'
          id='default-date-picker-example'
          clearControlLabel='Clear date'
          shouldShowCalendarButton
          openCalendarLabel='open calendar'
          placeholder={t('posts.date_picker_placeholder')}
          spacing='compact'
          onChange={handleDateChange} // 날짜 변경 시 핸들러 호출
        />
        {/* 제목 필터링용 자동완성 입력 */}
        <AutocompleteTextfield
          placeholder={t('posts.search_placeholder')}
          // 날짜 필터가 이미 적용된 경우에는 필터된 데이터(filteredData)를 사용하고,
          // 그렇지 않으면 전체 데이터(postsData)를 사용
          data={filteredData || postsData}
          keyField={'title'}
          onFilter={handleTitleFilter} // 제목 필터링 시 핸들러 호출
        />
      </SearchBarWrapper>
      {/* 테이블 컴포넌트 */}
      <Table
        columns={columns}
        data={filteredData} // 필터링된 데이터 전달
        isLoading={isLoading}
        emptyMessage={t('posts.table_empty_message')}
      />
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
