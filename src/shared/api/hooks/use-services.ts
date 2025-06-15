import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateServiceRequest,
  RollingUpdateRequest,
  RollingUpdateState,
  ScaleServiceRequest,
  Service,
  servicesApi,
  SystemSummary,
  UpdateServiceRequest
} from '../services';

export const SERVICES_QUERY_KEYS = {
  services: 'services',
  service: 'service',
  systemSummary: 'system-summary'
};

/**
 * 서비스 목록 조회 훅
 */
export const useServices = (refreshInterval?: number) => {
  return useQuery<Service[]>({
    queryKey: [SERVICES_QUERY_KEYS.services],
    queryFn: servicesApi.getServices,
    refetchInterval: refreshInterval || 3000, // 기본 3초마다 새로고침
    staleTime: 1000, // 1초
    gcTime: 300000 // 5분
  });
};

/**
 * 시스템 요약 정보 조회 훅
 */
export const useSystemSummary = (refreshInterval?: number) => {
  return useQuery<SystemSummary>({
    queryKey: [SERVICES_QUERY_KEYS.systemSummary],
    queryFn: servicesApi.getSystemSummary,
    refetchInterval: refreshInterval,
    staleTime: 30000, // 30초
    gcTime: 300000 // 5분
  });
};

/**
 * 특정 서비스 조회 훅
 */
export const useService = (id: string, refreshInterval?: number) => {
  return useQuery<Service>({
    queryKey: [SERVICES_QUERY_KEYS.service, id],
    queryFn: () => servicesApi.getService(id),
    enabled: !!id,
    refetchInterval: refreshInterval, // 폴링 비활성화 (명시적 전달시만 활성화)
    staleTime: 1000, // 1초
    gcTime: 300000 // 5분
  });
};

/**
 * 서비스 생성 훅
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateServiceRequest) =>
      servicesApi.createService(request),
    onSuccess: () => {
      // 서비스 목록 재조회
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEYS.services] });
    }
  });
};

/**
 * 서비스 업데이트 (롤링 업데이트) 훅
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateServiceRequest }) =>
      servicesApi.updateService(id, request),
    onSuccess: (_, variables) => {
      // 서비스 목록과 특정 서비스 재조회
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEYS.services] });
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEYS.service, variables.id] });
    }
  });
};

/**
 * 서비스 스케일링 훅
 */
export const useScaleService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: ScaleServiceRequest }) =>
      servicesApi.scaleService(id, request),
    onSuccess: (_, variables) => {
      // 서비스 목록과 특정 서비스 재조회
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEYS.services] });
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEYS.service, variables.id] });
    }
  });
};

/**
 * 서비스 삭제 훅
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesApi.deleteService(id),
    onSuccess: (_, id) => {
      // 서비스 목록 재조회 및 삭제된 서비스 캐시 제거
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEYS.services] });
      queryClient.removeQueries({ queryKey: [SERVICES_QUERY_KEYS.service, id] });
    }
  });
};

/**
 * 롤링 업데이트 시작 훅
 */
export const useStartRollingUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: RollingUpdateRequest }) =>
      servicesApi.startRollingUpdate(id, request),
    onSuccess: (_, variables) => {
      // 서비스 목록과 특정 서비스 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEYS.services] });
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEYS.service, variables.id] });
    }
  });
};

/**
 * 롤링 업데이트 상태 조회 훅
 */
export const useRollingUpdateState = (serviceId: string, updateId: string, enabled: boolean = true) => {
  return useQuery<RollingUpdateState>({
    queryKey: [SERVICES_QUERY_KEYS.service, serviceId, 'rolling-update', updateId],
    queryFn: () => servicesApi.getRollingUpdateState(serviceId, updateId),
    enabled: enabled && !!serviceId && !!updateId,
    refetchInterval: 1000, // 1초마다 상태 폴링
    staleTime: 500,
    gcTime: 60000 // 1분
  });
};

/**
 * 롤링 업데이트 목록 조회 훅
 */
export const useRollingUpdates = (serviceId: string) => {
  return useQuery<RollingUpdateState[]>({
    queryKey: [SERVICES_QUERY_KEYS.service, serviceId, 'rolling-updates'],
    queryFn: () => servicesApi.getRollingUpdates(serviceId),
    enabled: !!serviceId,
    refetchInterval: 2000, // 2초마다 목록 폴링
    staleTime: 1000,
    gcTime: 300000 // 5분
  });
}; 