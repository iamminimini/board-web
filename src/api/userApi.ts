import { UpdateUser, User } from '@type/user';
import axios from 'axios';
import axiosInstance from './axiosInstance';

// 사용자 목록
export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get(`/users`);
  return response.data;
};

// 단일 사용자 정보
export const getUser = async (id: number): Promise<User> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

// 사용자 정보 수정
export const putUser = async (
  id: number,
  upateUser: UpdateUser
): Promise<User> => {
  const response = await axiosInstance.put(`/users/${id}`, upateUser);
  return response.data;
};
