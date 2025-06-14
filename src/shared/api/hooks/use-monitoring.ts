import { useQuery } from '@tanstack/react-query';
import { monitoringApi } from '../monitoring';

export const QUERY_KEYS = {
  monitoringInfo: 'monitoring-info',
  systemSummary: 'system-summary'
};

/**
 * 루트 모니터링 정보를 조회하는 훅 (GET /)
 * 클러스터 정보를 반환합니다.
 */
export const useMonitoringInfo = (refreshInterval?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.monitoringInfo],
    queryFn: () => monitoringApi.getMonitoringInfo(),
    refetchInterval: refreshInterval
  });
};

/**
 * 시스템 요약 정보를 조회하는 훅 (GET /summary)
 */
export const useSystemSummary = (refreshInterval?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.systemSummary],
    queryFn: () => monitoringApi.getSystemSummary(),
    refetchInterval: refreshInterval
  });
}; 