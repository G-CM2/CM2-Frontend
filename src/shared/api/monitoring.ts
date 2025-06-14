import apiClient from './api-client';

/**
 * 모니터링 상태 인터페이스
 */
export interface MonitoringStatus {
  status: 'ok' | 'warning' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: 'ok' | 'error';
    docker: 'ok' | 'error';
    swarm: 'ok' | 'error';
  };
}

/**
 * 시스템 요약 정보 인터페이스
 */
export interface SystemSummary {
  status: 'healthy' | 'warning' | 'critical';
  timestamp: string;
  cluster: {
    totalNodes: number;
    activeNodes: number;
    managersNodes: number;
    workersNodes: number;
  };
  services: {
    totalServices: number;
    runningServices: number;
    failedServices: number;
  };
  containers: {
    totalContainers: number;
    runningContainers: number;
    stoppedContainers: number;
  };
  resources: {
    totalCpu: number;
    usedCpu: number;
    totalMemory: number;
    usedMemory: number;
  };
  alerts: {
    critical: number;
    warning: number;
  };
}

/**
 * 모니터링 API 함수들
 */
export const monitoringApi = {
  /**
   * 시스템 모니터링 상태 조회
   */
  async getMonitoringStatus(): Promise<MonitoringStatus> {
    const response = await apiClient.get<MonitoringStatus>('/');
    return response.data;
  },

  /**
   * 전체 시스템 상태 요약 정보 조회
   */
  async getSystemSummary(): Promise<SystemSummary> {
    const response = await apiClient.get<SystemSummary>('/summary');
    return response.data;
  }
};

export default monitoringApi; 