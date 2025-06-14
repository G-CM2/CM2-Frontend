import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../index';
import type { SystemSummary } from '../services';

/**
 * 시스템 요약 정보를 조회하는 훅
 */
export function useSystemSummary() {
  return useQuery({
    queryKey: ['system', 'summary'],
    queryFn: async (): Promise<SystemSummary> => {
      const response = await fetch('http://localhost:8080/summary');
      
      if (!response.ok) {
        throw new Error('Failed to fetch system summary');
      }
      
      return response.json();
    },
    refetchInterval: 5000, // 5초마다 자동 새로고침
    staleTime: 0, // 항상 fresh data로 간주하지 않음
    gcTime: 1000 * 60 * 5, // 5분간 캐시 보관
  });
}

/**
 * 데이터 무결성 검증 훅
 */
export const useValidateIntegrity = () => {
  return useQuery({
    queryKey: ['system', 'validate'],
    queryFn: async () => {
      const response = await apiClient.get<{ valid: boolean; message: string }>('/api/system/validate');
      return response.data;
    },
    staleTime: 30000, // 30초
  });
}; 