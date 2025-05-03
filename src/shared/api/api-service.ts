import axios, { AxiosInstance } from 'axios';

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
  success: boolean;
  message: string;
  status: string;
}

/**
 * API 서비스 클래스
 */
export class ApiService {
  private api: AxiosInstance;
  
  constructor(baseURL: string = 'http://localhost:8080') {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 헬스 체크 API
   * @returns 헬스 상태
   */
  async healthCheck() {
    return this.api.get('/health');
  }

  /**
   * 모든 컨테이너 목록 조회 API
   * @param page 페이지 번호 (기본값: 1)
   * @param limit 페이지당 컨테이너 수 (기본값: 20)
   * @param status 상태별 필터링
   * @param namespace 네임스페이스별 필터링
   * @returns 컨테이너 목록
   */
  async getContainers(page: number = 1, limit: number = 20, status?: string, namespace?: string) {
    const params = { page, limit };
    
    if (status) {
      Object.assign(params, { status });
    }
    
    if (namespace) {
      Object.assign(params, { namespace });
    }
    
    return this.api.get<ContainersResponse>('/containers', { params });
  }

  /**
   * 특정 컨테이너 상세 정보 조회 API
   * @param containerId 컨테이너 ID
   * @returns 컨테이너 상세 정보
   */
  async getContainerById(containerId: string) {
    return this.api.get<Container>(`/containers/${containerId}`);
  }

  /**
   * 컨테이너 제어 API
   * @param containerId 컨테이너 ID
   * @param action 동작
   * @returns 동작 결과
   */
  async performContainerAction(containerId: string, action: ContainerActionRequest) {
    return this.api.post<ContainerActionResponse>(`/containers/${containerId}/action`, action);
  }

  /**
   * 시스템 요약 정보 조회 API
   * @returns 시스템 요약 정보
   */
  async getSummary() {
    return this.api.get('/summary');
  }

  /**
   * 대시보드 요약 정보 조회 API
   * @returns 대시보드 요약 정보
   */
  async getDashboardSummary() {
    return this.api.get('/dashboard/summary');
  }

  /**
   * 컨테이너 타임라인(장애 이력) 조회 API
   * @param containerId 컨테이너 ID
   * @returns 컨테이너 타임라인 정보
   */
  async getContainerTimeline(containerId: string) {
    return this.api.get(`/timeline/${containerId}`);
  }

  /**
   * 자동 스케일링 정책 목록 조회 API
   * @returns 자동 스케일링 정책 목록
   */
  async getScalingPolicies() {
    return this.api.get('/scaling/policies');
  }

  /**
   * 자동 스케일링 정책 생성 API
   * @param policy 정책 데이터
   * @returns 생성된 정책 정보
   */
  async createScalingPolicy(policy: any) {
    return this.api.post('/scaling/policies', policy);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 