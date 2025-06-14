import axios from 'axios';

// API 기본 URL - Notion API 명세서 기준
export const API_URL = 'http://localhost:8080/';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  (config) => {
    // 요청 전에 실행할 작업 (예: 토큰 추가)
    return config;
  },
  (error) => {
    // 요청 오류 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => {
    // 응답 데이터 가공
    return response;
  },
  (error) => {
    // 응답 오류 처리
    return Promise.reject(error);
  }
);

export default apiClient; 