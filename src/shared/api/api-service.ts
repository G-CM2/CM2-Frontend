import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * 컨테이너 정보 인터페이스
 */
export interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
  created_at: string;
  health: string;
  cpu_usage: number;
  memory_usage: number;
  restart_count: number;
  ports?: {
    internal: number;
    external: number;
  }[];
  volumes?: {
    source: string;
    target: string;
  }[];
  environment?: {
    key: string;
    value: string;
  }[];
  logs?: string;
}

/**
 * 컨테이너 목록 응답 인터페이스
 */
export interface ContainersResponse {
  total: number;
  page: number;
  limit: number;
  containers: Container[];
}

/**
 * 컨테이너 동작 요청 인터페이스
 */
export interface ContainerActionRequest {
  action: 'start' | 'stop' | 'restart' | 'pause' | 'unpause';
}

/**
 * 컨테이너 동작 응답 인터페이스
 */
export interface ContainerActionResponse {
  container_id: string;
  action: string;
  status: string;
  timestamp: string;
  message?: string;
}

/**
 * 자동 스케일링 정책 지표 인터페이스
 */
export interface ScalingMetric {
  type: 'cpu' | 'memory';
  target_value: number;
}

/**
 * 자동 스케일링 정책 인터페이스
 */
export interface ScalingPolicy {
  id: string;
  name: string;
  target: string;
  min_replicas: number;
  max_replicas: number;
  metrics: ScalingMetric[];
  created_at: string;
  updated_at: string;
}

/**
 * 자동 스케일링 정책 목록 응답 인터페이스
 */
export interface ScalingPoliciesResponse {
  policies: ScalingPolicy[];
}

/**
 * 자동 스케일링 정책 생성 요청 인터페이스
 */
export interface CreateScalingPolicyRequest {
  name: string;
  target: string;
  min_replicas: number;
  max_replicas: number;
  metrics: ScalingMetric[];
}

/**
 * 시스템 요약 정보 인터페이스
 */
export interface SystemSummary {
  total_containers: number;
  running_containers: number;
  stopped_containers: number;
  system_cpu_usage: number;
  system_memory_usage: number;
  system_disk_usage: number;
  uptime: number;
}

/**
 * 대시보드 요약 정보 인터페이스
 */
export interface DashboardSummary {
  containers: {
    total: number;
    running: number;
    stopped: number;
    paused: number;
  };
  resources: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
  };
  health: {
    healthy: number;
    unhealthy: number;
    total: number;
  };
  recent_events: {
    timestamp: string;
    type: string;
    message: string;
  }[];
}

/**
 * 컨테이너 타임라인 데이터포인트 인터페이스
 */
export interface TimelineDatapoint {
  timestamp: string;
  status: string;
  cpu_usage: number;
  memory_usage: number;
}

/**
 * 컨테이너 타임라인 응답 인터페이스
 */
export interface ContainerTimelineResponse {
  component_id: string;
  from: string;
  to: string;
  datapoints: TimelineDatapoint[];
}

/**
 * API 서비스 클래스
 */
class ApiService {
  private client: AxiosInstance;
  private baseURL: string = "http://localhost:8000/api";

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 컨테이너 목록 조회
   */
  async getContainers(page: number = 1, limit: number = 20): Promise<AxiosResponse<ContainersResponse>> {
    return this.client.get('/containers', {
      params: { page, limit }
    });
  }

  /**
   * 컨테이너 상세 정보 조회
   */
  async getContainerById(id: string): Promise<AxiosResponse<Container>> {
    return this.client.get(`/containers/${id}`);
  }

  /**
   * 컨테이너 동작 수행 (시작, 중지, 재시작 등)
   */
  async performContainerAction(containerId: string, data: ContainerActionRequest): Promise<AxiosResponse<ContainerActionResponse>> {
    return this.client.post(`/containers/${containerId}/actions`, data);
  }

  /**
   * 자동 스케일링 정책 목록 조회
   */
  async getScalingPolicies(): Promise<AxiosResponse<ScalingPoliciesResponse>> {
    return this.client.get('/scaling/policies');
  }

  /**
   * 자동 스케일링 정책 생성
   */
  async createScalingPolicy(policy: CreateScalingPolicyRequest): Promise<AxiosResponse<ScalingPolicy>> {
    return this.client.post('/scaling/policies', policy);
  }

  /**
   * 시스템 요약 정보 조회
   */
  async getSummary(): Promise<AxiosResponse<SystemSummary>> {
    return this.client.get('/system/summary');
  }

  /**
   * 대시보드 요약 정보 조회
   */
  async getDashboardSummary(): Promise<AxiosResponse<DashboardSummary>> {
    return this.client.get('/dashboard/summary');
  }

  /**
   * 컨테이너 타임라인 조회
   */
  async getContainerTimeline(containerId: string): Promise<AxiosResponse<ContainerTimelineResponse>> {
    return this.client.get(`/timeline/${containerId}`);
  }
}

export const apiService = new ApiService();

export default apiService; 