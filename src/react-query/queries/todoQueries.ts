import { useQueries, useQuery } from 'react-query';
import { QUERY_KEYS } from '@react-query/queryKeys';
import { getTodo, getTodos, getUserTodo } from '@api/todoApi';
import { getUser } from '@api/userApi';
import { TodoTableDataType } from '@type/todo';

// 투두 목록
// export const useGetTodos = () => {
//   const {
//     data: todosData,
//     isLoading,
//     refetch: refetchTodosData,
//   } = useQuery([QUERY_KEYS.GET_TODOS], () => getTodos(), {
//     enabled: true,
//   });

//   return { todosData, isLoading, refetchTodosData };
// };

export const useGetTodos = (userId?: number) => {
  // userId가 있으면 getUserTodo를 호출하고, 없으면 getTodos 호출
  const fetchTodos = userId ? () => getUserTodo(userId) : getTodos;

  const {
    data: todosData,
    isLoading: todosLoading,
    refetch: refetchTodos,
  } = useQuery([QUERY_KEYS.GET_TODOS, userId], fetchTodos, {
    enabled: true, // userId가 있을 때만 userTodo를 가져오거나, 모든 Todo를 가져오도록
    refetchOnWindowFocus: false,
  });

  // todosData가 있을 경우, 각 투두의 사용자 데이터를 병렬로 가져오는 쿼리
  const userQueries = useQueries(
    todosData?.map((todo) => ({
      queryKey: [QUERY_KEYS.GET_USER, todo.userId],
      queryFn: () => getUser(todo.userId),
      enabled: !!todo.userId, // todosData가 있을 때만 실행
      retry: 0, // 실패 시 재호출 안함
    })) || [] // todosData가 없으면 빈 배열 반환
  );

  // 모든 사용자 쿼리에서 유효한 데이터만 필터링
  const usersData = userQueries
    .map((query) => query.data)
    .filter((user): user is NonNullable<typeof user> => !!user);

  // 각 투두에 사용자 이름을 추가한 새로운 데이터를 생성
  const todosWithUserNames: TodoTableDataType[] =
    todosData?.map((todo) => {
      const user = usersData.find((user) => user.id === todo.userId);
      return {
        ...todo,
        userName: user?.name || '-',
      };
    }) || [];

  return {
    todosData: todosWithUserNames,
    isLoading: todosLoading,
    refetchTodos: () => {
      refetchTodos();
      userQueries.forEach((query) => query.refetch()); // 모든 사용자 쿼리 리패치
    },
  };
};
// 투두 상세
export const useGetTodo = (id: number) => {
  const {
    data: todoData,
    isLoading,
    refetch: refetchTodoData,
  } = useQuery([QUERY_KEYS.GET_TODO, id], () => getTodo(id), {
    enabled: !!id,
  });

  return { todoData, isLoading, refetchTodoData };
};

// 특정 사용자 ID로 할 일 목록을 가져옵니다.
export const useGetUserTodo = (userId: number) => {
  const {
    data: userTodoData,
    isLoading,
    refetch: refetchUserTodoData,
  } = useQuery([QUERY_KEYS.GET_USER_TODO, userId], () => getUserTodo(userId), {
    enabled: !!userId,
  });

  return { userTodoData, isLoading, refetchUserTodoData };
};
