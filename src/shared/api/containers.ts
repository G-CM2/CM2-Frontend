import type { Container, ContainerDetails } from '@/entities/container/types';
import apiClient from './api-client';

/**
 * 컨테이너 API 함수들
 */
export const containersApi = {
  /**
   * 컨테이너 목록 조회 (GET /containers)
   */
  async getContainers(): Promise<Container[]> {
    const response = await apiClient.get<Container[]>('/containers');
    return response.data;
  },

  /**
   * 특정 컨테이너 상세 정보 조회 (GET /containers/{containerId})
   */
  async getContainer(containerId: string): Promise<ContainerDetails> {
    const response = await apiClient.get<ContainerDetails>(`/containers/${containerId}`);
    return response.data;
  },
};

// 하위 호환성을 위한 개별 함수들
export const { getContainers, getContainer } = containersApi;

export default containersApi; 