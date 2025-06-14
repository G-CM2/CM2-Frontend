import type { Container } from '@/entities/container/types';
import { useQuery } from '@tanstack/react-query';
import { containersApi } from '../containers';

export const CONTAINERS_QUERY_KEYS = {
  containers: 'containers',
  container: 'container'
} as const;

/**
 * 컨테이너 목록 조회 훅
 */
export const useContainers = () => {
  return useQuery<Container[]>({
    queryKey: [CONTAINERS_QUERY_KEYS.containers],
    queryFn: () => containersApi.getContainers(),
    staleTime: 30000, // 30초
    gcTime: 300000 // 5분
  });
};

/**
 * 특정 컨테이너 조회 훅
 */
export const useContainer = (containerId: string) => {
  return useQuery({
    queryKey: [CONTAINERS_QUERY_KEYS.container, containerId],
    queryFn: () => containersApi.getContainer(containerId),
    enabled: !!containerId,
    staleTime: 30000, // 30초
    gcTime: 300000 // 5분
  });
}; 