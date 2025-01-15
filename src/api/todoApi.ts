import { TodoItem } from '@type/todo';
import axiosInstance from './axiosInstance';

// 투두 목록
export const getTodos = async (): Promise<TodoItem[]> => {
  const response = await axiosInstance.get(`/todos`);
  return response.data;
};

// 단일 투두 정보
export const getTodo = async (id: number): Promise<TodoItem> => {
  const response = await axiosInstance.get(`/todos/${id}`);
  return response.data;
};

// 특정 사용자 ID로 할 일 목록을 가져옵니다.
export const getUserTodo = async (userId: number): Promise<TodoItem[]> => {
  const response = await axiosInstance.get(`/todos/user/${userId}`);
  return response.data;
};
