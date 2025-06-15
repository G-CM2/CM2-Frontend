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
  replicas: number;
  status: ServiceStatus;
  created_at: string;
  updated_at?: string;
  ports: Array<{
    internal: number;
    external: number;
  }>;
  cpu_usage: number;
  memory_usage: number;
  networks: string[];
  mode: ServiceMode;
}

/**
 * 시스템 요약 정보 (GET /summary)
 */
export interface SystemSummary {
  status: {
    description: string;
    indicator: 'normal' | 'warning' | 'critical';
  };
  containers: {
    total: number;
    running: number;
    stopped: number;
    error: number;
    failed: number;
  };
  resources: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
  };
  updated_at: string;
}

/**
 * 서비스 생성 요청
 */
export interface CreateServiceRequest {
  name: string;
  image: string;
  replicas?: number;
  ports?: Array<{
    internal: number;
    external: number;
  }>;
  environment?: Record<string, string>;
}

/**
 * 서비스 스케일링 요청
 */
export interface ScaleServiceRequest {
  replicas: number;
}

/**
 * 서비스 업데이트 요청
 */
export interface UpdateServiceRequest {
  image?: string;
  environment?: Record<string, string>;
  ports?: Array<{
    internal: number;
    external: number;
  }>;
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
 * 모니터링 응답 인터페이스
 */
export interface MonitoringResponse {
  status: 'ok' | 'error';
  timestamp: string;
  services: SystemSummary;
  message: string;
}

/**
 * 롤링 업데이트 관련 인터페이스
 */
export interface RollingUpdateRequest {
  image: string;
}

export interface RollingUpdateResponse {
  updateId: string;
  message: string;
  serviceId: string;
}

export interface RollingUpdateState {
  serviceId: string;
  status: 'starting' | 'in-progress' | 'verifying' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    id: number;
    name: string;
    status: 'pending' | 'running' | 'completed';
    message: string;
    progress?: number;
  }>;
  verifyCountdown?: number;
  startTime: number;
  targetImage?: string;
}

/**
 * 서비스 API 함수들
 */
export const servicesApi = {
  /**
   * 시스템 모니터링 정보 조회 (루트 경로)
   */
  async getMonitoring(): Promise<MonitoringResponse> {
    const response = await apiClient.get<MonitoringResponse>('/');
    return response.data;
  },

  /**
   * 서비스 목록 조회
   */
  async getServices(): Promise<Service[]> {
    const response = await apiClient.get<Service[]>('/services');
    return response.data;
  },

  /**
   * 시스템 요약 정보 조회
   */
  async getSystemSummary(): Promise<SystemSummary> {
    const response = await apiClient.get<SystemSummary>('/summary');
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
  async createService(data: CreateServiceRequest): Promise<Service> {
    const response = await apiClient.post<Service>('/services', data);
    return response.data;
  },

  /**
   * 서비스 삭제
   */
  async deleteService(id: string): Promise<void> {
    await apiClient.delete(`/services/${id}`);
  },

  /**
   * 서비스 스케일링
   */
  async scaleService(id: string, data: ScaleServiceRequest): Promise<Service> {
    const response = await apiClient.put<Service>(`/services/${id}/scale`, data);
    return response.data;
  },

  /**
   * 서비스 업데이트
   */
  async updateService(id: string, data: UpdateServiceRequest): Promise<Service> {
    const response = await apiClient.post<Service>(`/services/${id}/update`, data);
    return response.data;
  },

  /**
   * 롤링 업데이트 시작
   */
  async startRollingUpdate(id: string, data: RollingUpdateRequest): Promise<RollingUpdateResponse> {
    const response = await apiClient.post<RollingUpdateResponse>(`/services/${id}/rolling-update`, data);
    return response.data;
  },

  /**
   * 롤링 업데이트 상태 조회
   */
  async getRollingUpdateState(id: string, updateId: string): Promise<RollingUpdateState> {
    const response = await apiClient.get<RollingUpdateState>(`/services/${id}/rolling-update/${updateId}`);
    return response.data;
  },

  /**
   * 롤링 업데이트 목록 조회
   */
  async getRollingUpdates(id: string): Promise<RollingUpdateState[]> {
    const response = await apiClient.get<RollingUpdateState[]>(`/services/${id}/rolling-updates`);
    return response.data;
  },
};

// 하위 호환성을 위한 개별 함수들
export const { 
  getServices,
  getSystemSummary,
  getService,
  createService,
  deleteService,
  scaleService,
  updateService
} = servicesApi;

/**
 * 특정 서비스 조회
 */
export async function fetchService(id: string): Promise<Service> {
  return servicesApi.getService(id);
}

/**
 * 서비스 스케일링 (하위 호환성)
 */
export async function scaleService_legacy(id: string, replicas: number): Promise<Service> {
  return servicesApi.scaleService(id, { replicas });
}

export default servicesApi; 