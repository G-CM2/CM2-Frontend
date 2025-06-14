import type { ClusterNode } from '@/shared/lib/mock-data';
import apiClient from './api-client';

/**
 * 노드 상태 인터페이스
 */
export interface Node {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'draining' | 'unavailable';
  ip: string;
  role: 'manager' | 'worker';
  availability: 'active' | 'pause' | 'drain';
  engineVersion: string;
  resources: {
    cpus: number;
    memory: number;
    disk: number;
  };
  labels: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 클러스터 상태 인터페이스
 */
export interface ClusterStatus {
  id: string;
  nodes: {
    total: number;
    active: number;
    inactive: number;
    managers: number;
    workers: number;
  };
  services: {
    total: number;
    running: number;
    failed: number;
  };
  swarmStatus: 'active' | 'inactive' | 'pending' | 'error';
  version: {
    index: number;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * 클러스터 헬스체크 인터페이스
 */
export interface ClusterHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: string;
  checks: {
    name: string;
    status: 'ok' | 'warning' | 'critical';
    message: string;
    lastCheck: string;
  }[];
  uptime: number;
  version: string;
}

/**
 * 장애 시뮬레이션 요청 인터페이스
 */
export interface FailureSimulationRequest {
  type: 'node-failure' | 'network-partition' | 'high-load';
  target: string;
  duration?: number;
  severity?: 'low' | 'medium' | 'high';
  options?: Record<string, unknown>;
}

/**
 * 장애 시뮬레이션 응답 인터페이스
 */
export interface FailureSimulationResponse {
  id: string;
  type: string;
  target: string;
  status: 'started' | 'running' | 'completed' | 'failed';
  startedAt: string;
  estimatedCompletion?: string;
  progress: number;
  logs: string[];
}

/**
 * 노드 드레인 요청 인터페이스
 */
export interface NodeDrainRequest {
  force?: boolean;
  timeout?: number;
  ignoreErrors?: boolean;
}

/**
 * 노드 드레인 응답 인터페이스
 */
export interface NodeDrainResponse {
  nodeId: string;
  status: 'started' | 'in-progress' | 'completed' | 'failed';
  message: string;
  startedAt: string;
  completedAt?: string;
  drainedServices: string[];
}

/**
 * 클러스터 API 함수들
 */
export const clusterApi = {
  /**
   * 클러스터 노드 목록 조회
   */
  async getNodes(): Promise<ClusterNode[]> {
    const response = await apiClient.get<ClusterNode[]>('/cluster/nodes');
    return response.data;
  },

  /**
   * 클러스터 상태 조회
   */
  async getClusterStatus(): Promise<ClusterStatus> {
    const response = await apiClient.get<ClusterStatus>('/cluster/status');
    return response.data;
  },

  /**
   * 클러스터 헬스체크 조회
   */
  async getClusterHealth(): Promise<ClusterHealth> {
    const response = await apiClient.get<ClusterHealth>('/cluster/health');
    return response.data;
  },

  /**
   * 노드 드레인 실행
   */
  async drainNode(nodeId: string, request: NodeDrainRequest = {}): Promise<NodeDrainResponse> {
    const response = await apiClient.post<NodeDrainResponse>(`/cluster/nodes/${nodeId}/drain`, request);
    return response.data;
  },

  /**
   * 장애 시뮬레이션 실행
   */
  async simulateFailure(request: FailureSimulationRequest): Promise<FailureSimulationResponse> {
    const response = await apiClient.post<FailureSimulationResponse>('/cluster/simulate/failure', request);
    return response.data;
  },

  /**
   * 노드 가용성 변경
   */
  async updateNodeAvailability(
    nodeId: string, 
    availability: 'active' | 'pause' | 'drain'
  ): Promise<ClusterNode> {
    const response = await apiClient.patch<ClusterNode>(
      `/cluster/nodes/${nodeId}/availability`,
      { availability }
    );
    return response.data;
  }
};

export default clusterApi; 