import apiClient from './api-client';

/**
 * 시스템 요약 정보 인터페이스
 */
export interface SystemSummary {
  total_containers: number;
  running_containers: number;
  stopped_containers: number;
  system_cpu_usage: number;
  system_memory_usage: number;
  system_disk_usage: number;
  uptime: number;
}

/**
 * 대시보드 요약 정보 인터페이스
 */
export interface DashboardSummary {
  containers: {
    total: number;
    running: number;
    stopped: number;
    paused: number;
  };
  resources: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
  };
  health: {
    healthy: number;
    unhealthy: number;
    total: number;
  };
  recent_events: {
    timestamp: string;
    type: string;
    message: string;
  }[];
}

// 시스템 API 함수 정의
export const systemApi = {
  /**
   * 시스템 요약 정보 조회
   */
  getSystemSummary: async () => {
    const response = await apiClient.get<SystemSummary>('/system/summary');
    return response.data;
  },

  /**
   * 대시보드 요약 정보 조회
   */
  getDashboardSummary: async () => {
    const response = await apiClient.get<DashboardSummary>('/dashboard/summary');
    return response.data;
  }
}; 