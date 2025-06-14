import apiClient from './api-client';

/**
 * 클러스터 노드 정보 인터페이스
 */
export interface ClusterNode {
  id: string;
  hostname: string;
  status: string;
  availability: string;
  managerStatus: string;
}

/**
 * 루트 경로 모니터링 응답 인터페이스 (GET /)
 * 클러스터 정보를 반환합니다.
 */
export interface MonitoringResponse {
  clusterID: string;
  name: string;
  orchestration: string;
  raftStatus: string;
  nodes: ClusterNode[];
}

/**
 * 시스템 상태 정보 인터페이스
 */
export interface SystemStatus {
  description: string;
  indicator: 'normal' | 'warning' | 'critical';
}

/**
 * 컨테이너 요약 정보 인터페이스
 */
export interface ContainersSummary {
  total: number;
  running: number;
  stopped: number;
  error: number;
}

/**
 * 리소스 사용량 정보 인터페이스
 */
export interface ResourceUsage {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
}

/**
 * 시스템 요약 정보 인터페이스 (GET /summary)
 */
export interface SystemSummary {
  status: SystemStatus;
  containers: ContainersSummary;
  resources: ResourceUsage;
  updated_at: string;
}

/**
 * 모니터링 API 함수들
 */
export const monitoringApi = {
  /**
   * 루트 모니터링 - 클러스터 정보 조회 (GET /)
   */
  async getMonitoringInfo(): Promise<MonitoringResponse> {
    const response = await apiClient.get<MonitoringResponse>('/');
    return response.data;
  },

  /**
   * 전체 시스템 상태 요약 정보 조회 (GET /summary)
   */
  async getSystemSummary(): Promise<SystemSummary> {
    const response = await apiClient.get<SystemSummary>('/summary');
    return response.data;
  }
};

export default monitoringApi; 