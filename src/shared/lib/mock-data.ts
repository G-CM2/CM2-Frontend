import type { Container } from '@/entities/container/types';
import type { Service, SystemSummary } from '@/shared/api/services';

/**
 * 초기 서비스 데이터
 */
export const INITIAL_SERVICES: Service[] = [
  {
    id: 'service-1',
    name: 'nginx-web',
    image: 'nginx:latest',
    replicas: 3,
    status: 'running',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    ports: [
      { internal: 80, external: 8080 },
      { internal: 443, external: 8443 }
    ],
    cpu_usage: 12.5,
    memory_usage: 256,
    networks: ['default'],
    mode: 'replicated',
  },
  {
    id: 'service-2',
    name: 'redis-cache',
    image: 'redis:alpine',
    replicas: 1,
    status: 'running',
    created_at: '2024-01-15T10:05:00Z',
    updated_at: '2024-01-15T10:05:00Z',
    ports: [
      { internal: 6379, external: 6379 }
    ],
    cpu_usage: 8.2,
    memory_usage: 128,
    networks: ['default'],
    mode: 'replicated',
  },
  {
    id: 'service-3',
    name: 'api-server',
    image: 'node:18-alpine',
    replicas: 2,
    status: 'stopped',
    created_at: '2024-01-15T10:10:00Z',
    updated_at: '2024-01-15T10:10:00Z',
    ports: [
      { internal: 3000, external: 3000 }
    ],
    cpu_usage: 0,
    memory_usage: 0,
    networks: ['default'],
    mode: 'replicated',
  }
];

/**
 * 초기 컨테이너 데이터
 */
export const INITIAL_CONTAINERS: Container[] = [
  {
    id: 'container-1',
    name: 'nginx-web.1',
    image: 'nginx:latest',
    status: 'running',
    created: '2024-01-15T10:00:00Z',
    ports: ['8080:80/tcp'],
    cpu: 15,
    memory: 128,
    cpu_usage: 15,
    memory_usage: 128
  },
  {
    id: 'container-2',
    name: 'nginx-web.2',
    image: 'nginx:latest',
    status: 'running',
    created: '2024-01-15T10:00:30Z',
    ports: ['8081:80/tcp'],
    cpu: 12,
    memory: 115,
    cpu_usage: 12,
    memory_usage: 115
  },
  {
    id: 'container-3',
    name: 'nginx-web.3',
    image: 'nginx:latest',
    status: 'running',
    created: '2024-01-15T10:01:00Z',
    ports: ['8082:80/tcp'],
    cpu: 18,
    memory: 142,
    cpu_usage: 18,
    memory_usage: 142
  },
  {
    id: 'container-4',
    name: 'redis-cache.1',
    image: 'redis:alpine',
    status: 'running',
    created: '2024-01-15T10:05:00Z',
    ports: ['6379:6379/tcp'],
    cpu: 8,
    memory: 64,
    cpu_usage: 8,
    memory_usage: 64
  },
  {
    id: 'container-5',
    name: 'api-server.1',
    image: 'node:18-alpine',
    status: 'stopped',
    created: '2024-01-15T10:10:00Z',
    ports: ['3000:3000/tcp'],
    cpu: 0,
    memory: 0,
    cpu_usage: 0,
    memory_usage: 0
  }
];

/**
 * 초기 시스템 요약 데이터
 */
export const INITIAL_SYSTEM_SUMMARY: SystemSummary = {
  status: {
    indicator: 'normal',
    description: '시스템이 정상적으로 작동 중입니다'
  },
  containers: {
    total: 5,
    running: 4,
    stopped: 1,
    error: 0,
    failed: 0
  },
  resources: {
    cpu_usage: 53.2,
    memory_usage: 67.8,
    disk_usage: 25.4
  },
  updated_at: '2024-01-15T10:15:00Z'
};

/**
 * 클러스터 노드 타입 정의
 */
export interface ClusterNode {
  id: string;
  name: string;
  role: 'manager' | 'worker';
  status: 'ready' | 'down' | 'unknown';
  availability: 'active' | 'pause' | 'drain';
  address: string;
  resources: {
    cpu: { usage: number; total: number };
    memory: { usage: number; total: number };
    disk: { usage: number; total: number };
  };
  labels: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 초기 클러스터 노드 데이터
 */
export const INITIAL_CLUSTER_NODES: ClusterNode[] = [
  {
    id: 'node-1',
    name: 'manager-1',
    role: 'manager',
    status: 'ready',
    availability: 'active',
    address: '192.168.1.10',
    resources: {
      cpu: { usage: 45, total: 400 },
      memory: { usage: 2048, total: 8192 },
      disk: { usage: 25600, total: 102400 }
    },
    labels: {
      'node.role': 'manager',
      'node.platform.os': 'linux'
    },
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'node-2',
    name: 'worker-1',
    role: 'worker',
    status: 'ready',
    availability: 'active',
    address: '192.168.1.11',
    resources: {
      cpu: { usage: 32, total: 200 },
      memory: { usage: 1536, total: 4096 },
      disk: { usage: 15360, total: 51200 }
    },
    labels: {
      'node.role': 'worker',
      'node.platform.os': 'linux'
    },
    createdAt: '2024-01-15T09:05:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'node-3',
    name: 'worker-2',
    role: 'worker',
    status: 'ready',
    availability: 'active',
    address: '192.168.1.12',
    resources: {
      cpu: { usage: 28, total: 200 },
      memory: { usage: 1280, total: 4096 },
      disk: { usage: 12800, total: 51200 }
    },
    labels: {
      'node.role': 'worker',
      'node.platform.os': 'linux'
    },
    createdAt: '2024-01-15T09:10:00Z',
    updatedAt: new Date().toISOString()
  }
]; 