import type { Container } from '@/entities/container/types';
import apiClient from './api-client';

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
    const response = await apiClient.get<Container[]>('/containers');
    // 페이지네이션 시뮬레이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContainers = response.data.slice(startIndex, endIndex);
    
    return {
      total: response.data.length,
      page,
      limit,
      containers: paginatedContainers
    };
  },

  /**
   * 컨테이너 상세 정보 조회
   */
  getContainer: async (id: string) => {
    const response = await apiClient.get<Container[]>('/containers');
    const container = response.data.find(c => c.id === id);
    if (!container) {
      throw new Error('Container not found');
    }
    return container;
  }
}; 