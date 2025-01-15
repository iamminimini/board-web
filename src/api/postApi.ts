import { CommentType, PostItem } from '@type/post';
import axiosInstance from './axiosInstance';

// 게시글 목록
export const getPosts = async (): Promise<PostItem[]> => {
  const response = await axiosInstance.get(`/posts`);
  return response.data;
};

// 단일 게시글 정보
export const getPost = async (id: number): Promise<PostItem> => {
  const response = await axiosInstance.get(`/posts/${id}`);
  return response.data;
};

// 특정 사용자 ID로 할 일 목록 호출
export const getComments = async (postId: number): Promise<CommentType[]> => {
  const response = await axiosInstance.get(`/comments/post/${postId}`);
  return response.data;
};
