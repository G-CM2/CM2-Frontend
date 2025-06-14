/**
 * 클러스터 관리 API
 */

/**
 * 클러스터 노드 인터페이스
 */
export interface ClusterNode {
  id: string;
  hostname: string;
  status: 'Ready' | 'Down' | 'Unknown';
  availability: 'Active' | 'Pause' | 'Drain';
  managerStatus: 'Leader' | 'Reachable' | '';
}

/**
 * 클러스터 헬스 응답
 */
export interface ClusterHealth {
  totalNodes: number;
  activeManagers: number;
  unreachableNodes: number;
}

/**
 * 클러스터 노드 목록 응답
 */
export interface ClusterNodesResponse {
  total: number;
  nodes: ClusterNode[];
}

/**
 * 클러스터 상태 응답
 */
export interface ClusterStatus {
  clusterID: string;
  name: string;
  orchestration: string;
  raftStatus: string;
  nodes: ClusterNode[];
}

/**
 * 노드 드레인 요청
 */
export interface DrainNodeRequest {
  nodeId: string;
}

/**
 * 장애 시뮬레이션 요청
 */
export interface SimulateFailureRequest {
  nodeId: string;
  failureType: 'drain' | 'activate';
}

/**
 * 장애 시뮬레이션 응답
 */
export interface SimulateFailureResponse {
  nodeId: string;
  failureType: 'drain' | 'activate';
}

/**
 * 클러스터 헬스 조회
 */
export const getClusterHealth = async (): Promise<ClusterHealth> => {
  const response = await fetch('http://localhost:8080/cluster/health');
  if (!response.ok) {
    throw new Error('Failed to fetch cluster health');
  }
  return response.json();
};

/**
 * 클러스터 노드 목록 조회
 */
export const getClusterNodes = async (): Promise<ClusterNodesResponse> => {
  const response = await fetch('http://localhost:8080/cluster/nodes');
  if (!response.ok) {
    throw new Error('Failed to fetch cluster nodes');
  }
  return response.json();
};

/**
 * 클러스터 상태 조회
 */
export const getClusterStatus = async (): Promise<ClusterStatus> => {
  const response = await fetch('http://localhost:8080/cluster/status');
  if (!response.ok) {
    throw new Error('Failed to fetch cluster status');
  }
  return response.json();
};

/**
 * 노드 드레인
 */
export const drainNode = async (nodeId: string): Promise<void> => {
  const response = await fetch(`http://localhost:8080/cluster/nodes/${nodeId}/drain`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nodeId }),
  });
  if (!response.ok) {
    throw new Error('Failed to drain node');
  }
};

/**
 * 장애 시뮬레이션
 */
export const simulateFailure = async (request: SimulateFailureRequest): Promise<SimulateFailureResponse> => {
  const response = await fetch('http://localhost:8080/cluster/simulate/failure', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error('Failed to simulate failure');
  }
  return response.json();
}; 