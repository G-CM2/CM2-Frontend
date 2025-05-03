import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container } from '@/entities/container/types';
import { containersApi, ContainerActionResponse, ContainerActionRequest } from '../containers';
import { timelineApi } from '../timeline';

export const QUERY_KEYS = {
  containers: 'containers',
  container: 'container',
  timeline: 'timeline'
};

/**
 * 컨테이너 목록을 조회하는 훅
 */
export const useContainers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.containers],
    queryFn: async () => {
      const result = await containersApi.getContainers();
      return result.containers;
    },
  });
};

/**
 * 특정 컨테이너 정보를 조회하는 훅
 */
export const useContainer = (containerId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.container, containerId],
    queryFn: async () => {
      return await containersApi.getContainer(containerId);
    },
    enabled: !!containerId,
  });
};

/**
 * 컨테이너 타임라인을 조회하는 훅
 */
export const useContainerTimeline = (containerId: string, refreshInterval?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.timeline, containerId],
    queryFn: async () => {
      return await timelineApi.getContainerEventTimeline(containerId);
    },
    enabled: !!containerId,
    refetchInterval: refreshInterval,
  });
};

/**
 * 컨테이너 액션을 수행하는 범용 훅
 */
export const useContainerAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    ContainerActionResponse, 
    Error, 
    { containerId: string; action: ContainerActionRequest }
  >({
    mutationFn: async ({ containerId, action }) => {
      return await containersApi.performContainerAction(containerId, action);
    },
    onSuccess: (_, { containerId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.container, containerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.containers] });
    },
  });
};

/**
 * 컨테이너 시작 액션 훅
 */
export const useStartContainer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ContainerActionResponse, Error, string>({
    mutationFn: async (containerId) => {
      return await containersApi.startContainer(containerId);
    },
    onSuccess: (_, containerId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.container, containerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.containers] });
    },
  });
};

/**
 * 컨테이너 중지 액션 훅
 */
export const useStopContainer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ContainerActionResponse, Error, string>({
    mutationFn: async (containerId) => {
      return await containersApi.stopContainer(containerId);
    },
    onSuccess: (_, containerId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.container, containerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.containers] });
    },
  });
};

/**
 * 컨테이너 재시작 액션 훅
 */
export const useRestartContainer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ContainerActionResponse, Error, string>({
    mutationFn: async (containerId) => {
      return await containersApi.restartContainer(containerId);
    },
    onSuccess: (_, containerId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.container, containerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.containers] });
    },
  });
};

/**
 * 컨테이너 일시중지 액션 훅
 */
export const usePauseContainer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ContainerActionResponse, Error, string>({
    mutationFn: async (containerId) => {
      return await containersApi.performContainerAction(containerId, { action: 'pause' });
    },
    onSuccess: (_, containerId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.container, containerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.containers] });
    },
  });
};

/**
 * 컨테이너 일시중지 해제 액션 훅
 */
export const useUnpauseContainer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ContainerActionResponse, Error, string>({
    mutationFn: async (containerId) => {
      return await containersApi.performContainerAction(containerId, { action: 'unpause' });
    },
    onSuccess: (_, containerId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.container, containerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.containers] });
    },
  });
}; 