import { useQuery } from '@tanstack/react-query';
import { containersApi, TimelineItem } from '../containers';

const QUERY_KEYS = {
  timeline: 'timeline',
};

/**
 * 특정 컨테이너의 타임라인 데이터를 조회하는 훅
 * @param containerId 컨테이너 ID
 * @param refreshInterval 자동 갱신 간격 (밀리초)
 */
export const useContainerTimeline = (containerId: string, refreshInterval?: number) => {
  return useQuery<TimelineItem[]>({
    queryKey: [QUERY_KEYS.timeline, containerId],
    queryFn: async () => {
      return await containersApi.getContainerTimeline(containerId);
    },
    enabled: !!containerId,
    refetchInterval: refreshInterval,
  });
}; 