import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    CreateServiceRequest,
    ScaleServiceRequest,
    Service,
    servicesApi,
    UpdateServiceRequest
} from '../services';

export const SERVICES_QUERY_KEYS = {
  services: 'services',
  service: 'service'
};

/**
 * 서비스 목록 조회 훅
 */
export const useServices = () => {
  return useQuery<Service[]>({
    queryKey: [SERVICES_QUERY_KEYS.services],
    queryFn: servicesApi.getServices,
    staleTime: 30000, // 30초
    gcTime: 300000 // 5분
  });
};

/**
 * 특정 서비스 조회 훅
 */
export const useService = (id: string) => {
  return useQuery<Service>({
    queryKey: [SERVICES_QUERY_KEYS.service, id],
    queryFn: () => servicesApi.getService(id),
    enabled: !!id,
    staleTime: 30000, // 30초
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