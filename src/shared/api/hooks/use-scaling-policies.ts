import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scalingApi, ScalingPolicy } from '../scaling';

const QUERY_KEYS = {
  scalingPolicies: 'scalingPolicies',
  scalingPolicy: 'scalingPolicy',
};

/**
 * 스케일링 정책 목록을 조회하는 훅
 */
export const useScalingPolicies = () => {
  return useQuery<ScalingPolicy[]>({
    queryKey: [QUERY_KEYS.scalingPolicies],
    queryFn: async () => {
      return await scalingApi.getPolicies();
    },
  });
};

/**
 * 스케일링 정책 상세 정보를 조회하는 훅
 */
export const useScalingPolicy = (policyId?: string) => {
  return useQuery<ScalingPolicy>({
    queryKey: [QUERY_KEYS.scalingPolicy, policyId],
    queryFn: async () => {
      if (!policyId) throw new Error('정책 ID가 필요합니다.');
      return await scalingApi.getPolicy(policyId);
    },
    enabled: !!policyId, // ID가 있을 때만 쿼리 실행
  });
};

/**
 * 스케일링 정책 생성 훅
 */
export const useCreateScalingPolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ScalingPolicy, Error, Omit<ScalingPolicy, 'id'>>({
    mutationFn: async (newPolicy) => {
      return await scalingApi.createPolicy(newPolicy);
    },
    onSuccess: () => {
      // 정책 목록 갱신
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.scalingPolicies] });
    },
  });
};

/**
 * 스케일링 정책 업데이트 훅
 */
export const useUpdateScalingPolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    ScalingPolicy, 
    Error, 
    { policyId: string; policy: Partial<ScalingPolicy> }
  >({
    mutationFn: async ({ policyId, policy }) => {
      return await scalingApi.updatePolicy(policyId, policy);
    },
    onSuccess: (_, { policyId }) => {
      // 단일 정책 및 목록 갱신
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.scalingPolicy, policyId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.scalingPolicies] });
    },
  });
};

/**
 * 스케일링 정책 삭제 훅
 */
export const useDeleteScalingPolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (policyId) => {
      return await scalingApi.deletePolicy(policyId);
    },
    onSuccess: () => {
      // 정책 목록 갱신
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.scalingPolicies] });
    },
  });
}; 