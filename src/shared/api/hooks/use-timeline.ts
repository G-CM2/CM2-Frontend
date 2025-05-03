import { useQuery } from '@tanstack/react-query';
import { apiService, ContainerTimelineResponse } from '../api-service';

export const QUERY_KEYS = {
  containerTimeline: 'container-timeline',
};

/**
 * 컨테이너 타임라인 데이터를 조회하는 훅
 */
export const useContainerTimeline = (containerId: string, refetchInterval?: number) => {
  return useQuery<ContainerTimelineResponse>({
    queryKey: [QUERY_KEYS.containerTimeline, containerId],
    queryFn: async () => {
      const response = await apiService.getContainerTimeline(containerId);
      return response.data;
    },
    enabled: !!containerId,
    refetchInterval,
  });
}; 