import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    drainNode,
    getClusterHealth,
    getClusterNodes,
    getClusterStatus,
    simulateFailure
} from '../cluster';

/**
 * 클러스터 관련 쿼리 키
 */
export const CLUSTER_QUERY_KEYS = {
  all: ['cluster'] as const,
  health: () => [...CLUSTER_QUERY_KEYS.all, 'health'] as const,
  nodes: () => [...CLUSTER_QUERY_KEYS.all, 'nodes'] as const,
  status: () => [...CLUSTER_QUERY_KEYS.all, 'status'] as const,
} as const;

/**
 * 클러스터 헬스 조회 훅
 */
export const useClusterHealth = () => {
  return useQuery({
    queryKey: CLUSTER_QUERY_KEYS.health(),
    queryFn: getClusterHealth,
    refetchInterval: 30000, // 30초마다 자동 갱신
  });
};

/**
 * 클러스터 노드 목록 조회 훅
 */
export const useClusterNodes = () => {
  return useQuery({
    queryKey: CLUSTER_QUERY_KEYS.nodes(),
    queryFn: getClusterNodes,
    refetchInterval: 10000, // 10초마다 자동 갱신
  });
};

/**
 * 클러스터 상태 조회 훅
 */
export const useClusterStatus = () => {
  return useQuery({
    queryKey: CLUSTER_QUERY_KEYS.status(),
    queryFn: getClusterStatus,
    refetchInterval: 30000, // 30초마다 자동 갱신
  });
};

/**
 * 노드 드레인 뮤테이션 훅
 */
export const useDrainNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: drainNode,
    onSuccess: () => {
      // 노드 목록과 클러스터 상태 갱신
      queryClient.invalidateQueries({ queryKey: CLUSTER_QUERY_KEYS.nodes() });
      queryClient.invalidateQueries({ queryKey: CLUSTER_QUERY_KEYS.status() });
      queryClient.invalidateQueries({ queryKey: CLUSTER_QUERY_KEYS.health() });
    },
  });
};

/**
 * 장애 시뮬레이션 뮤테이션 훅
 */
export const useSimulateFailure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: simulateFailure,
    onSuccess: () => {
      // 모든 클러스터 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: CLUSTER_QUERY_KEYS.all });
    },
  });
}; 