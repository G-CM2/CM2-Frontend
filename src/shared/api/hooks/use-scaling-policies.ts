import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, ScalingPoliciesResponse, CreateScalingPolicyRequest, ScalingPolicy } from '../api-service';

export const QUERY_KEYS = {
  scalingPolicies: 'scaling-policies',
};

/**
 * 스케일링 정책 목록을 조회하는 훅
 */
export const useScalingPolicies = () => {
  return useQuery<ScalingPoliciesResponse>({
    queryKey: [QUERY_KEYS.scalingPolicies],
    queryFn: async () => {
      const response = await apiService.getScalingPolicies();
      return response.data;
    },
  });
};

/**
 * 스케일링 정책을 생성하는 훅
 */
export const useCreateScalingPolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ScalingPolicy, Error, CreateScalingPolicyRequest>({
    mutationFn: async (policy) => {
      const response = await apiService.createScalingPolicy(policy);
      return response.data;
    },
    onSuccess: () => {
      // 정책 목록 갱신
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.scalingPolicies] });
    },
  });
}; 