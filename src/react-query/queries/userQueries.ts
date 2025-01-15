import { getUser, getUsers, putUser } from '@api/userApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { QUERY_KEYS } from '@react-query/queryKeys';
import { UpdateUser } from '@type/user';

// 사용자 목록
export const useGetUsers = () => {
  const {
    data: usersData,
    isLoading,
    refetch: refetchUsersData,
  } = useQuery([QUERY_KEYS.GET_USERS], () => getUsers(), {
    enabled: true,
  });

  return { usersData, isLoading, refetchUsersData };
};

// 단일 사용자 정보
export const useGetUser = (id: number) => {
  const { data: userData } = useQuery(
    [QUERY_KEYS.GET_USER, id],
    () => getUser(id),
    {
      enabled: !!id, // id가 유효할 때만 쿼리 실행
    }
  );

  return { userData };
};

// 사용자 정보를 업데이트
export const usePutUser = () => {
  const queryClient = useQueryClient();

  const { mutate: mutatePutUser, ...rest } = useMutation(
    ({ id, updatedUser }: { id: number; updatedUser: UpdateUser }) =>
      putUser(id, updatedUser),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([QUERY_KEYS.GET_USERS]);
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return { mutatePutUser, ...rest };
};
