import { useQuery } from 'react-query';
import { QUERY_KEYS } from '@react-query/queryKeys';
import { getComments, getPost, getPosts } from '@api/postApi';

// 게시글 목록
export const useGetPosts = () => {
  const {
    data: postsData,
    isLoading,
    refetch: refetchPostsData,
  } = useQuery([QUERY_KEYS.GET_POSTS], () => getPosts(), {
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });

  return { postsData, isLoading, refetchPostsData };
};

// 투두 상세
export const useGetPost = (id: number) => {
  const {
    data: postData,
    isLoading,
    refetch: refetchPostata,
  } = useQuery([QUERY_KEYS.GET_POST, id], () => getPost(id), {
    enabled: !!id,
  });

  return { postData, isLoading, refetchPostata };
};

// 게시글 ID로 댓글 목록
export const useGetPostComment = (postId: number) => {
  const {
    data: commentsData,
    isLoading,
    refetch: refetchCommentData,
  } = useQuery([QUERY_KEYS.GET_COMMENTS, postId], () => getComments(postId), {
    enabled: !!postId,
  });

  return { commentsData, isLoading, refetchCommentData };
};
