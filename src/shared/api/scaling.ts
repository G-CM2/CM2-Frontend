import apiClient from './api-client';

/**
 * 자동 스케일링 정책 지표 인터페이스
 */
export interface ScalingMetric {
  type: 'cpu' | 'memory';
  target_value: number;
}

/**
 * 자동 스케일링 정책 인터페이스
 */
export interface ScalingPolicy {
  id: string;
  name: string;
  target: string;
  min_replicas: number;
  max_replicas: number;
  metrics: ScalingMetric[];
  created_at: string;
  updated_at: string;
}

/**
 * 자동 스케일링 정책 목록 응답 인터페이스
 */
export interface ScalingPoliciesResponse {
  policies: ScalingPolicy[];
}

/**
 * 자동 스케일링 정책 생성 요청 인터페이스
 */
export interface CreateScalingPolicyRequest {
  name: string;
  target: string;
  min_replicas: number;
  max_replicas: number;
  metrics: ScalingMetric[];
}

// 스케일링 API 함수 정의
export const scalingApi = {
  /**
   * 자동 스케일링 정책 목록 조회
   */
  getScalingPolicies: async () => {
    const response = await apiClient.get<ScalingPoliciesResponse>('/scaling/policies');
    return response.data;
  },

  /**
   * 자동 스케일링 정책 상세 조회
   */
  getScalingPolicy: async (policyId: string) => {
    const response = await apiClient.get<ScalingPolicy>(`/scaling/policies/${policyId}`);
    return response.data;
  },

  /**
   * 자동 스케일링 정책 생성
   */
  createScalingPolicy: async (policy: CreateScalingPolicyRequest) => {
    const response = await apiClient.post<ScalingPolicy>('/scaling/policies', policy);
    return response.data;
  },

  /**
   * 자동 스케일링 정책 업데이트
   */
  updateScalingPolicy: async (policyId: string, policy: Partial<CreateScalingPolicyRequest>) => {
    const response = await apiClient.put<ScalingPolicy>(`/scaling/policies/${policyId}`, policy);
    return response.data;
  },

  /**
   * 자동 스케일링 정책 삭제
   */
  deleteScalingPolicy: async (policyId: string) => {
    await apiClient.delete(`/scaling/policies/${policyId}`);
    return true;
  }
}; 