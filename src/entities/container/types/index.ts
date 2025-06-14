/**
 * 기본 컨테이너 정보 (목록 조회용)
 */
export interface Container {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'paused';
  created: string;
  ports: string[];
  cpu: number;
  memory: number;
  cpu_usage: number;
  memory_usage: number;
}

/**
 * 특정 컨테이너 상세 정보 (GET /containers/{containerId})
 */
export interface ContainerDetails {
  id: string;
  name: string;
  image: string;
  status: string;
  created_at: string;
  health: string;
  cpu_usage: number;
  memory_usage: number;
  restart_count: number;
  ports: Array<{
    internal: number;
    external: number;
  }>;
  volumes: Array<{
    source: string;
    target: string;
  }>;
  environment: Array<{
    key: string;
    value: string;
  }>;
  logs: string;
} 