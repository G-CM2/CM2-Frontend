import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, ContainersResponse, ContainerActionRequest, ContainerActionResponse } from '../api-service';

export const QUERY_KEYS = {
  containers: 'containers',
  container: 'container',
};

/**
 * 컨테이너 목록을 조회하는 훅
 */
export const useContainers = (page: number = 1, limit: number = 20) => {
  return useQuery<ContainersResponse>({
    queryKey: [QUERY_KEYS.containers, page, limit],
    queryFn: async () => {
      const response = await apiService.getContainers(page, limit);
      return response.data;
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
      const response = await apiService.getContainerById(containerId);
      return response.data;
    },
    enabled: !!containerId,
  });
};

/**
 * 컨테이너 동작(시작, 중지 등)을 수행하는 훅
 */
export const useContainerAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ContainerActionResponse, Error, { containerId: string; action: ContainerActionRequest }>({
    mutationFn: async ({ containerId, action }) => {
      const response = await apiService.performContainerAction(containerId, action);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // 컨테이너 정보 갱신
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.container, variables.containerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.containers] });
    },
  });
}; 