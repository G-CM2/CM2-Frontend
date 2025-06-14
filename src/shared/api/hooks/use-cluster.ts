import type { ClusterNode } from '@/shared/lib/mock-data';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    clusterApi,
    ClusterHealth,
    ClusterStatus,
    FailureSimulationRequest,
    NodeDrainRequest
} from '../cluster';

export const CLUSTER_QUERY_KEYS = {
  nodes: 'cluster-nodes',
  status: 'cluster-status',
  health: 'cluster-health'
};

/**
 * 클러스터 노드 목록 조회 훅
 */
export const useClusterNodes = (refreshInterval?: number) => {
  return useQuery<ClusterNode[]>({
    queryKey: [CLUSTER_QUERY_KEYS.nodes],
    queryFn: clusterApi.getNodes,
    refetchInterval: refreshInterval,
    staleTime: 30000, // 30초
    gcTime: 300000 // 5분
  });
};

/**
 * 클러스터 상태 조회 훅
 */
export const useClusterStatus = () => {
  return useQuery<ClusterStatus>({
    queryKey: [CLUSTER_QUERY_KEYS.status],
    queryFn: clusterApi.getClusterStatus,
    staleTime: 15000, // 15초
    gcTime: 300000 // 5분
  });
};

/**
 * 클러스터 헬스체크 조회 훅
 */
export const useClusterHealth = () => {
  return useQuery<ClusterHealth>({
    queryKey: [CLUSTER_QUERY_KEYS.health],
    queryFn: clusterApi.getClusterHealth,
    staleTime: 30000, // 30초
    gcTime: 300000 // 5분
  });
};

/**
 * 노드 드레인 실행 훅
 */
export const useDrainNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nodeId, request }: { nodeId: string; request?: NodeDrainRequest }) =>
      clusterApi.drainNode(nodeId, request),
    onSuccess: () => {
      // 노드 목록과 클러스터 상태 재조회
      queryClient.invalidateQueries({ queryKey: [CLUSTER_QUERY_KEYS.nodes] });
      queryClient.invalidateQueries({ queryKey: [CLUSTER_QUERY_KEYS.status] });
      queryClient.invalidateQueries({ queryKey: [CLUSTER_QUERY_KEYS.health] });
    }
  });
};

/**
 * 장애 시뮬레이션 실행 훅
 */
export const useSimulateFailure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: FailureSimulationRequest) =>
      clusterApi.simulateFailure(request),
    onSuccess: () => {
      // 모든 클러스터 관련 데이터 재조회
      queryClient.invalidateQueries({ queryKey: [CLUSTER_QUERY_KEYS.nodes] });
      queryClient.invalidateQueries({ queryKey: [CLUSTER_QUERY_KEYS.status] });
      queryClient.invalidateQueries({ queryKey: [CLUSTER_QUERY_KEYS.health] });
    }
  });
};

/**
 * 노드 가용성 변경 훅
 */
export const useUpdateNodeAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      nodeId, 
      availability 
    }: { 
      nodeId: string; 
      availability: 'active' | 'pause' | 'drain' 
    }) => clusterApi.updateNodeAvailability(nodeId, availability),
    onSuccess: () => {
      // 노드 목록 재조회
      queryClient.invalidateQueries({ queryKey: [CLUSTER_QUERY_KEYS.nodes] });
    }
  });
}; 