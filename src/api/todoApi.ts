import axios from 'axios';
import { TodoItem } from '@type/todo';

// 투두 목록
export const getTodos = async (): Promise<TodoItem[]> => {
  const response = await axios.get(`/api/todos`);
  return response.data;
};

// 단일 투두 정보
export const getTodo = async (id: number): Promise<TodoItem> => {
  const response = await axios.get(`/api/todos/${id}`);
  return response.data;
};

// 특정 사용자 ID로 할 일 목록을 가져옵니다.
export const getUserTodo = async (userId: number): Promise<TodoItem[]> => {
  const response = await axios.get(`/api/todos/user/${userId}`);
  return response.data;
};
