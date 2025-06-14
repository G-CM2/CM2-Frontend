import { useQuery } from '@tanstack/react-query';
import { containersApi } from '../containers';

export const QUERY_KEYS = {
  containers: 'containers',
  container: 'container'
};

/**
 * 컨테이너 목록을 조회하는 훅
 */
export const useContainers = (page: number = 1, limit: number = 20, refreshInterval?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.containers, page, limit],
    queryFn: () => containersApi.getContainers(page, limit),
    refetchInterval: refreshInterval
  });
};

/**
 * 특정 컨테이너의 상세 정보를 조회하는 훅
 */
export const useContainer = (id: string, refreshInterval?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.container, id],
    queryFn: () => containersApi.getContainer(id),
    enabled: !!id,
    refetchInterval: refreshInterval
  });
}; 