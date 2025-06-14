import apiClient from './api-client';

/**
 * 컨테이너 정보 인터페이스
 */
export interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
  created_at: string;
  health: string;
  cpu_usage: number;
  memory_usage: number;
  restart_count: number;
  ports?: {
    internal: number;
    external: number;
  }[];
  volumes?: {
    source: string;
    target: string;
  }[];
  environment?: {
    key: string;
    value: string;
  }[];
  logs?: string;
}

/**
 * 컨테이너 목록 응답 인터페이스
 */
export interface ContainersResponse {
  total: number;
  page: number;
  limit: number;
  containers: Container[];
}

// 컨테이너 API 함수 정의
export const containersApi = {
  /**
   * 컨테이너 목록 조회
   */
  getContainers: async (page: number = 1, limit: number = 20) => {
    const response = await apiClient.get<ContainersResponse>('/containers', {
      params: { page, limit }
    });
    return response.data;
  },

  /**
   * 컨테이너 상세 정보 조회
   */
  getContainer: async (id: string) => {
    const response = await apiClient.get<Container>(`/containers/${id}`);
    return response.data;
  }
}; 