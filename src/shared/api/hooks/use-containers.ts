import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { containersApi, ContainerActionRequest } from '../containers';

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

/**
 * 범용 컨테이너 액션 처리를 위한 훅
 */
export const useContainerAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ containerId, action }: { containerId: string; action: string }) => {
      return containersApi.performContainerAction(containerId, { action } as ContainerActionRequest);
    },
    onSuccess: (_data, variables) => {
      // 액션이 성공하면 컨테이너 정보를 다시 조회
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.container, variables.containerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.containers] });
    }
  });
};

/**
 * 컨테이너 시작 훅
 */
export const useStartContainer = () => {
  const containerAction = useContainerAction();
  
  return {
    mutate: (containerId: string) => containerAction.mutate({ containerId, action: 'start' }),
    isLoading: containerAction.isPending,
    isError: containerAction.isError,
    error: containerAction.error
  };
};

/**
 * 컨테이너 중지 훅
 */
export const useStopContainer = () => {
  const containerAction = useContainerAction();
  
  return {
    mutate: (containerId: string) => containerAction.mutate({ containerId, action: 'stop' }),
    isLoading: containerAction.isPending,
    isError: containerAction.isError,
    error: containerAction.error
  };
};

/**
 * 컨테이너 재시작 훅
 */
export const useRestartContainer = () => {
  const containerAction = useContainerAction();
  
  return {
    mutate: (containerId: string) => containerAction.mutate({ containerId, action: 'restart' }),
    isLoading: containerAction.isPending,
    isError: containerAction.isError,
    error: containerAction.error
  };
};

/**
 * 컨테이너 일시 중지 훅
 */
export const usePauseContainer = () => {
  const containerAction = useContainerAction();
  
  return {
    mutate: (containerId: string) => containerAction.mutate({ containerId, action: 'pause' }),
    isLoading: containerAction.isPending,
    isError: containerAction.isError,
    error: containerAction.error
  };
};

/**
 * 컨테이너 일시 중지 해제 훅
 */
export const useUnpauseContainer = () => {
  const containerAction = useContainerAction();
  
  return {
    mutate: (containerId: string) => containerAction.mutate({ containerId, action: 'unpause' }),
    isLoading: containerAction.isPending,
    isError: containerAction.isError,
    error: containerAction.error
  };
}; 