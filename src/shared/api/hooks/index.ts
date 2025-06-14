import {
    useContainer,
    useContainers
} from './use-containers';

import {
    useClusterHealth,
    useClusterStatus,
    useDrainNode,
    useNodes,
    useSimulateFailure
} from './use-cluster';

import {
    useCreateService,
    useDeleteService,
    useScaleService,
    useService,
    useServices,
    useUpdateService
} from './use-services';

import {
    useMonitoringStatus,
    useSystemSummary
} from './use-monitoring';

// 컨테이너 관련 훅 내보내기
export {
    QUERY_KEYS as CONTAINERS_QUERY_KEYS, useContainer,
    useContainers
} from './use-containers';

// 클러스터 관련 훅 내보내기
export {
    useClusterHealth,
    useClusterStatus,
    useDrainNode,
    useNodes,
    useSimulateFailure
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

// 모니터링 관련 훅 내보내기
export {
    QUERY_KEYS as MONITORING_QUERY_KEYS, useMonitoringStatus,
    useSystemSummary
} from './use-monitoring';

// 모든 훅을 하나의 객체로 내보내기 (선택적)
export const hooks = {
  // 컨테이너
  useContainers,
  useContainer,
  
  // 클러스터
  useNodes,
  useClusterStatus,
  useClusterHealth,
  useDrainNode,
  useSimulateFailure,
  
  // 서비스
  useServices,
  useService,
  useCreateService,
  useUpdateService,
  useScaleService,
  useDeleteService,
  
  // 모니터링
  useMonitoringStatus,
  useSystemSummary
}; 