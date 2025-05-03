import { useQuery } from '@tanstack/react-query';
import { apiService, DashboardSummary, SystemSummary } from '../api-service';

export const QUERY_KEYS = {
  dashboardSummary: 'dashboard-summary',
  systemSummary: 'system-summary',
};

/**
 * 대시보드 요약 정보를 조회하는 훅
 */
export const useDashboardSummary = (refetchInterval?: number) => {
  return useQuery<DashboardSummary>({
    queryKey: [QUERY_KEYS.dashboardSummary],
    queryFn: async () => {
      const response = await apiService.getDashboardSummary();
      return response.data;
    },
    refetchInterval,
  });
};

/**
 * 시스템 요약 정보를 조회하는 훅
 */
export const useSystemSummary = (refetchInterval?: number) => {
  return useQuery<SystemSummary>({
    queryKey: [QUERY_KEYS.systemSummary],
    queryFn: async () => {
      const response = await apiService.getSummary();
      return response.data;
    },
    refetchInterval,
  });
}; 