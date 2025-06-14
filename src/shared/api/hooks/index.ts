import {
    useContainer,
    useContainers
} from './use-containers';

import {
    useClusterHealth,
    useClusterNodes,
    useClusterStatus,
    useDrainNode,
    useSimulateFailure,
    useUpdateNodeAvailability
} from './use-cluster';

import {
    useCreateService,
    useDeleteService,
    useScaleService,
    useService,
    useServices,
    useUpdateService
} from './use-services';



// 컨테이너 관련 훅 내보내기
export {
    QUERY_KEYS as CONTAINERS_QUERY_KEYS,
    useContainer,
    useContainers
} from './use-containers';

// 클러스터 관련 훅 내보내기
export {
    useClusterHealth,
    useClusterNodes,
    useClusterStatus,
    useDrainNode,
    useSimulateFailure,
    useUpdateNodeAvailability
} from './use-cluster';

// 서비스 관련 훅 내보내기
export {
    useCreateService,
    useDeleteService,
    useScaleService,
    useService,
    useServices,
    useUpdateService
} from './use-services';

// 시스템 요약 정보는 서비스 API에서 제공
export { useSystemSummary } from './use-services';

// 모든 훅을 하나의 객체로 내보내기 (선택적)
export const hooks = {
  // 컨테이너
  useContainers,
  useContainer,
  
  // 클러스터
  useClusterNodes,
  useClusterStatus,
  useClusterHealth,
  useDrainNode,
  useSimulateFailure,
  useUpdateNodeAvailability,
  
  // 서비스
  useServices,
  useService,
  useCreateService,
  useUpdateService,
  useScaleService,
  useDeleteService
}; 