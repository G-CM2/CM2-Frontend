import { useQuery } from '@tanstack/react-query';
import { monitoringApi } from '../monitoring';

export const QUERY_KEYS = {
  monitoringStatus: 'monitoring-status',
  systemSummary: 'system-summary'
};

/**
 * 모니터링 상태를 조회하는 훅
 */
export const useMonitoringStatus = (refreshInterval?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.monitoringStatus],
    queryFn: () => monitoringApi.getMonitoringStatus(),
    refetchInterval: refreshInterval
  });
};

/**
 * 시스템 요약 정보를 조회하는 훅
 */
export const useSystemSummary = (refreshInterval?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.systemSummary],
    queryFn: () => monitoringApi.getSystemSummary(),
    refetchInterval: refreshInterval
  });
}; 