import axios from 'axios';

// API의 기본 도메인 설정
const API_BASE_URL = 'https://apps-test.osci.kr/api';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
