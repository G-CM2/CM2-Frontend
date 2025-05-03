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

/**
 * 컨테이너 동작 요청 인터페이스
 */
export interface ContainerActionRequest {
  action: 'start' | 'stop' | 'restart' | 'pause' | 'unpause';
}

/**
 * 컨테이너 동작 응답 인터페이스
 */
export interface ContainerActionResponse {
  container_id: string;
  action: string;
  status: string;
  timestamp: string;
  message?: string;
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
  },

  /**
   * 컨테이너 동작 수행 (시작, 중지, 재시작 등)
   */
  performContainerAction: async (containerId: string, action: ContainerActionRequest) => {
    const response = await apiClient.post<ContainerActionResponse>(`/containers/${containerId}/actions`, action);
    return response.data;
  },

  /**
   * 컨테이너 시작
   */
  startContainer: async (containerId: string) => {
    return containersApi.performContainerAction(containerId, { action: 'start' });
  },

  /**
   * 컨테이너 중지
   */
  stopContainer: async (containerId: string) => {
    return containersApi.performContainerAction(containerId, { action: 'stop' });
  },

  /**
   * 컨테이너 재시작
   */
  restartContainer: async (containerId: string) => {
    return containersApi.performContainerAction(containerId, { action: 'restart' });
  }
}; 