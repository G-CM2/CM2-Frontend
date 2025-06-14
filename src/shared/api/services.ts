import apiClient from './api-client';

/**
 * 서비스 상태 타입
 */
export type ServiceStatus = 'pending' | 'running' | 'complete' | 'shutdown' | 'failed';

/**
 * 서비스 모드 타입
 */
export type ServiceMode = 'replicated' | 'global';

/**
 * 서비스 인터페이스
 */
export interface Service {
  id: string;
  name: string;
  image: string;
  mode: ServiceMode;
  replicas?: number;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
  labels: Record<string, string>;
  ports: ServicePort[];
  networks: string[];
  constraints: string[];
  resources: ServiceResources;
  updateConfig: UpdateConfig;
  rollbackConfig: RollbackConfig;
  endpoint: ServiceEndpoint;
}

/**
 * 서비스 포트 인터페이스
 */
export interface ServicePort {
  protocol: 'tcp' | 'udp';
  targetPort: number;
  publishedPort?: number;
  publishMode?: 'ingress' | 'host';
}

/**
 * 서비스 리소스 인터페이스
 */
export interface ServiceResources {
  limits?: {
    nanoCpus?: number;
    memoryBytes?: number;
  };
  reservations?: {
    nanoCpus?: number;
    memoryBytes?: number;
  };
}

/**
 * 업데이트 설정 인터페이스
 */
export interface UpdateConfig {
  parallelism: number;
  delay: string;
  failureAction: 'pause' | 'continue' | 'rollback';
  monitor: string;
  maxFailureRatio: number;
  order: 'stop-first' | 'start-first';
}

/**
 * 롤백 설정 인터페이스
 */
export interface RollbackConfig {
  parallelism: number;
  delay: string;
  failureAction: 'pause' | 'continue';
  monitor: string;
  maxFailureRatio: number;
  order: 'stop-first' | 'start-first';
}

/**
 * 서비스 엔드포인트 인터페이스
 */
export interface ServiceEndpoint {
  spec: {
    mode: string;
    ports: ServicePort[];
  };
  ports: ServicePort[];
  virtualIPs: {
    networkID: string;
    addr: string;
  }[];
}

/**
 * 서비스 생성 요청 인터페이스
 */
export interface CreateServiceRequest {
  name: string;
  image: string;
  mode?: ServiceMode;
  replicas?: number;
  labels?: Record<string, string>;
  ports?: ServicePort[];
  networks?: string[];
  constraints?: string[];
  resources?: ServiceResources;
  env?: string[];
  mounts?: ServiceMount[];
  updateConfig?: Partial<UpdateConfig>;
  rollbackConfig?: Partial<RollbackConfig>;
}

/**
 * 서비스 마운트 인터페이스
 */
export interface ServiceMount {
  type: 'bind' | 'volume' | 'tmpfs';
  source: string;
  target: string;
  readonly?: boolean;
}

/**
 * 서비스 업데이트 요청 인터페이스
 */
export interface UpdateServiceRequest {
  image?: string;
  labels?: Record<string, string>;
  env?: string[];
  resources?: ServiceResources;
  updateConfig?: Partial<UpdateConfig>;
}

/**
 * 서비스 스케일링 요청 인터페이스
 */
export interface ScaleServiceRequest {
  replicas: number;
}

/**
 * 서비스 목록 응답 인터페이스
 */
export interface ServicesResponse {
  services: Service[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * 서비스 API 함수들
 */
export const servicesApi = {
  /**
   * 서비스 목록 조회
   */
  async getServices(): Promise<Service[]> {
    const response = await apiClient.get<Service[]>('/services');
    return response.data;
  },

  /**
   * 특정 서비스 조회
   */
  async getService(id: string): Promise<Service> {
    const response = await apiClient.get<Service>(`/services/${id}`);
    return response.data;
  },

  /**
   * 서비스 생성
   */
  async createService(request: CreateServiceRequest): Promise<Service> {
    const response = await apiClient.post<Service>('/services', request);
    return response.data;
  },

  /**
   * 서비스 업데이트 (롤링 업데이트)
   */
  async updateService(id: string, request: UpdateServiceRequest): Promise<Service> {
    const response = await apiClient.post<Service>(`/services/${id}/update`, request);
    return response.data;
  },

  /**
   * 서비스 스케일링
   */
  async scaleService(id: string, request: ScaleServiceRequest): Promise<Service> {
    const response = await apiClient.put<Service>(`/services/${id}/scale`, request);
    return response.data;
  },

  /**
   * 서비스 삭제
   */
  async deleteService(id: string): Promise<void> {
    await apiClient.delete(`/services/${id}`);
  }
};

export default servicesApi; 