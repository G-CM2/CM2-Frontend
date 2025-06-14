import { mockContainers } from '@/entities/container';
import { http, HttpResponse } from 'msw';
import { Container, ContainersResponse } from '../containers';
import { MonitoringResponse, SystemSummary } from '../monitoring';
import { Service } from '../services';

// API 경로를 일관되게 유지하기 위한 기본 URL
const API_URL = 'http://localhost:8080';

// 모의 서비스 데이터
const mockServices: Service[] = [
  {
    id: 'service-web-app',
    name: 'web-application',
    image: 'nginx:1.21',
    mode: 'replicated',
    replicas: 3,
    status: 'running',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    labels: {
      'app': 'web-application',
      'environment': 'production'
    },
    ports: [
      {
        protocol: 'tcp',
        targetPort: 80,
        publishedPort: 8080,
        publishMode: 'ingress'
      }
    ],
    networks: ['overlay-network'],
    constraints: ['node.role==worker'],
    resources: {
      limits: {
        nanoCpus: 1000000000, // 1 CPU
        memoryBytes: 536870912 // 512MB
      },
      reservations: {
        nanoCpus: 500000000, // 0.5 CPU
        memoryBytes: 268435456 // 256MB
      }
    },
    updateConfig: {
      parallelism: 1,
      delay: '10s',
      failureAction: 'pause',
      monitor: '5s',
      maxFailureRatio: 0.3,
      order: 'stop-first'
    },
    rollbackConfig: {
      parallelism: 1,
      delay: '10s',
      failureAction: 'pause',
      monitor: '5s',
      maxFailureRatio: 0.3,
      order: 'stop-first'
    },
    endpoint: {
      spec: {
        mode: 'vip',
        ports: [
          {
            protocol: 'tcp',
            targetPort: 80,
            publishedPort: 8080,
            publishMode: 'ingress'
          }
        ]
      },
      ports: [
        {
          protocol: 'tcp',
          targetPort: 80,
          publishedPort: 8080,
          publishMode: 'ingress'
        }
      ],
      virtualIPs: [
        {
          networkID: 'network-1',
          addr: '10.0.1.2/24'
        }
      ]
    }
  },
  {
    id: 'service-api-server',
    name: 'api-server',
    image: 'node:18-alpine',
    mode: 'replicated',
    replicas: 2,
    status: 'running',
    createdAt: '2024-01-15T10:05:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    labels: {
      'app': 'api-server',
      'environment': 'production'
    },
    ports: [
      {
        protocol: 'tcp',
        targetPort: 3000,
        publishedPort: 3000,
        publishMode: 'ingress'
      }
    ],
    networks: ['overlay-network'],
    constraints: ['node.role==worker'],
    resources: {
      limits: {
        nanoCpus: 2000000000, // 2 CPU
        memoryBytes: 1073741824 // 1GB
      },
      reservations: {
        nanoCpus: 1000000000, // 1 CPU
        memoryBytes: 536870912 // 512MB
      }
    },
    updateConfig: {
      parallelism: 1,
      delay: '10s',
      failureAction: 'pause',
      monitor: '5s',
      maxFailureRatio: 0.3,
      order: 'stop-first'
    },
    rollbackConfig: {
      parallelism: 1,
      delay: '10s',
      failureAction: 'pause',
      monitor: '5s',
      maxFailureRatio: 0.3,
      order: 'stop-first'
    },
    endpoint: {
      spec: {
        mode: 'vip',
        ports: [
          {
            protocol: 'tcp',
            targetPort: 3000,
            publishedPort: 3000,
            publishMode: 'ingress'
          }
        ]
      },
      ports: [
        {
          protocol: 'tcp',
          targetPort: 3000,
          publishedPort: 3000,
          publishMode: 'ingress'
        }
      ],
      virtualIPs: [
        {
          networkID: 'network-1',
          addr: '10.0.1.3/24'
        }
      ]
    }
  },
  {
    id: 'service-database',
    name: 'postgres-db',
    image: 'postgres:15',
    mode: 'replicated',
    replicas: 1,
    status: 'running',
    createdAt: '2024-01-15T10:10:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    labels: {
      'app': 'database',
      'environment': 'production'
    },
    ports: [
      {
        protocol: 'tcp',
        targetPort: 5432,
        publishedPort: 5432,
        publishMode: 'host'
      }
    ],
    networks: ['overlay-network'],
    constraints: ['node.labels.storage==ssd'],
    resources: {
      limits: {
        nanoCpus: 2000000000, // 2 CPU
        memoryBytes: 2147483648 // 2GB
      },
      reservations: {
        nanoCpus: 1000000000, // 1 CPU
        memoryBytes: 1073741824 // 1GB
      }
    },
    updateConfig: {
      parallelism: 1,
      delay: '30s',
      failureAction: 'pause',
      monitor: '10s',
      maxFailureRatio: 0,
      order: 'stop-first'
    },
    rollbackConfig: {
      parallelism: 1,
      delay: '30s',
      failureAction: 'pause',
      monitor: '10s',
      maxFailureRatio: 0,
      order: 'stop-first'
    },
    endpoint: {
      spec: {
        mode: 'vip',
        ports: [
          {
            protocol: 'tcp',
            targetPort: 5432,
            publishedPort: 5432,
            publishMode: 'host'
          }
        ]
      },
      ports: [
        {
          protocol: 'tcp',
          targetPort: 5432,
          publishedPort: 5432,
          publishMode: 'host'
        }
      ],
      virtualIPs: [
        {
          networkID: 'network-1',
          addr: '10.0.1.4/24'
        }
      ]
    }
  },
  {
    id: 'service-redis',
    name: 'redis-cache',
    image: 'redis:7-alpine',
    mode: 'replicated',
    replicas: 1,
    status: 'running',
    createdAt: '2024-01-15T10:15:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    labels: {
      'app': 'cache',
      'environment': 'production'
    },
    ports: [
      {
        protocol: 'tcp',
        targetPort: 6379,
        publishedPort: 6379,
        publishMode: 'ingress'
      }
    ],
    networks: ['overlay-network'],
    constraints: ['node.role==worker'],
    resources: {
      limits: {
        nanoCpus: 1000000000, // 1 CPU
        memoryBytes: 536870912 // 512MB
      },
      reservations: {
        nanoCpus: 500000000, // 0.5 CPU
        memoryBytes: 268435456 // 256MB
      }
    },
    updateConfig: {
      parallelism: 1,
      delay: '10s',
      failureAction: 'pause',
      monitor: '5s',
      maxFailureRatio: 0.3,
      order: 'stop-first'
    },
    rollbackConfig: {
      parallelism: 1,
      delay: '10s',
      failureAction: 'pause',
      monitor: '5s',
      maxFailureRatio: 0.3,
      order: 'stop-first'
    },
    endpoint: {
      spec: {
        mode: 'vip',
        ports: [
          {
            protocol: 'tcp',
            targetPort: 6379,
            publishedPort: 6379,
            publishMode: 'ingress'
          }
        ]
      },
      ports: [
        {
          protocol: 'tcp',
          targetPort: 6379,
          publishedPort: 6379,
          publishMode: 'ingress'
        }
      ],
      virtualIPs: [
        {
          networkID: 'network-1',
          addr: '10.0.1.5/24'
        }
      ]
    }
  },
  {
    id: 'service-monitoring',
    name: 'monitoring-stack',
    image: 'prom/prometheus:latest',
    mode: 'replicated',
    replicas: 1,
    status: 'failed',
    createdAt: '2024-01-15T10:20:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    labels: {
      'app': 'monitoring',
      'environment': 'production'
    },
    ports: [
      {
        protocol: 'tcp',
        targetPort: 9090,
        publishedPort: 9090,
        publishMode: 'ingress'
      }
    ],
    networks: ['overlay-network'],
    constraints: ['node.role==manager'],
    resources: {
      limits: {
        nanoCpus: 1000000000, // 1 CPU
        memoryBytes: 1073741824 // 1GB
      },
      reservations: {
        nanoCpus: 500000000, // 0.5 CPU
        memoryBytes: 536870912 // 512MB
      }
    },
    updateConfig: {
      parallelism: 1,
      delay: '10s',
      failureAction: 'pause',
      monitor: '5s',
      maxFailureRatio: 0.3,
      order: 'stop-first'
    },
    rollbackConfig: {
      parallelism: 1,
      delay: '10s',
      failureAction: 'pause',
      monitor: '5s',
      maxFailureRatio: 0.3,
      order: 'stop-first'
    },
    endpoint: {
      spec: {
        mode: 'vip',
        ports: [
          {
            protocol: 'tcp',
            targetPort: 9090,
            publishedPort: 9090,
            publishMode: 'ingress'
          }
        ]
      },
      ports: [
        {
          protocol: 'tcp',
          targetPort: 9090,
          publishedPort: 9090,
          publishMode: 'ingress'
        }
      ],
      virtualIPs: [
        {
          networkID: 'network-1',
          addr: '10.0.1.6/24'
        }
      ]
    }
  }
];

// 모의 모니터링 클러스터 정보
const mockMonitoringInfo: MonitoringResponse = {
  clusterID: 'cluster-001',
  name: 'Development Cluster',
  orchestration: 'swarm',
  raftStatus: 'leader',
  nodes: [
    {
      id: 'node-1',
      hostname: 'manager-01',
      status: 'ready',
      availability: 'active',
      managerStatus: 'leader'
    },
    {
      id: 'node-2', 
      hostname: 'worker-01',
      status: 'ready',
      availability: 'active',
      managerStatus: ''
    },
    {
      id: 'node-3',
      hostname: 'worker-02', 
      status: 'ready',
      availability: 'active',
      managerStatus: ''
    }
  ]
};

// 모의 시스템 요약 정보
const mockSystemSummary: SystemSummary = {
  status: {
    description: '시스템이 정상적으로 작동 중입니다',
    indicator: 'normal'
  },
  containers: {
    total: 10,
    running: 7,
    stopped: 2,
    error: 1
  },
  resources: {
    cpu_usage: 45.5,
    memory_usage: 62.3,
    disk_usage: 38.7
  },
  updated_at: new Date().toISOString()
};

// API 엔드포인트 모킹을 위한 핸들러
export const handlers = [
  // 모니터링 - 클러스터 정보 조회 (GET /)
  http.get(`${API_URL}/`, () => {
    return HttpResponse.json(mockMonitoringInfo);
  }),

  // 모니터링 - 시스템 요약 정보 조회 (GET /summary)
  http.get(`${API_URL}/summary`, () => {
    return HttpResponse.json(mockSystemSummary);
  }),

  // 서비스 목록 조회 (GET /services)
  http.get(`${API_URL}/services`, () => {
    return HttpResponse.json(mockServices);
  }),

  // 단일 서비스 조회 (GET /services/:id)
  http.get(`${API_URL}/services/:serviceId`, ({ params }) => {
    const { serviceId } = params;
    const service = mockServices.find(s => s.id === serviceId);

    if (!service) {
      return new HttpResponse(
        JSON.stringify({ error: '서비스를 찾을 수 없습니다.' }), 
        { status: 404 }
      );
    }

    return HttpResponse.json(service);
  }),

  // 서비스 스케일링 (PUT /services/:id/scale)
  http.put(`${API_URL}/services/:serviceId/scale`, async ({ params, request }) => {
    const { serviceId } = params;
    const { replicas } = await request.json() as { replicas: number };
    
    const serviceIndex = mockServices.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ error: '서비스를 찾을 수 없습니다.' }), 
        { status: 404 }
      );
    }

    // 서비스 레플리카 수 업데이트
    mockServices[serviceIndex] = {
      ...mockServices[serviceIndex],
      replicas,
      updatedAt: new Date().toISOString()
    };

    return HttpResponse.json(mockServices[serviceIndex]);
  }),

  // 서비스 업데이트 (POST /services/:id/update)
  http.post(`${API_URL}/services/:serviceId/update`, async ({ params, request }) => {
    const { serviceId } = params;
    const updateData = await request.json();
    
    const serviceIndex = mockServices.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ error: '서비스를 찾을 수 없습니다.' }), 
        { status: 404 }
      );
    }

    // 서비스 업데이트
    mockServices[serviceIndex] = {
      ...mockServices[serviceIndex],
      ...(updateData as Partial<Service>),
      updatedAt: new Date().toISOString()
    };

    return HttpResponse.json(mockServices[serviceIndex]);
  }),

  // 컨테이너 목록 조회 (GET /containers)
  http.get(`${API_URL}/containers`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedContainers = mockContainers.slice(start, end);
    
    // mockContainers와 API Container 타입의 차이를 변환
    const containers = paginatedContainers.map(container => ({
      id: container.id,
      name: container.name,
      image: container.image,
      status: container.status,
      created_at: new Date().toISOString(),
      health: "healthy", // 기본값 제공
      cpu_usage: container.cpu || 0,
      memory_usage: container.memory || 0,
      restart_count: 0, // 기본값 제공
      ports: container.ports ? container.ports.map(port => {
        // 포트 형식 변환
        if (typeof port === 'string') {
          const [external, internal] = port.split(':').map(Number);
          return { internal, external };
        }
        return port;
      }) : [],
      logs: ""
    } as Container));
    
    const response: ContainersResponse = {
      total: mockContainers.length,
      page,
      limit,
      containers
    };
    
    return HttpResponse.json(response);
  }),

  // 단일 컨테이너 조회 (GET /containers/:id)
  http.get(`${API_URL}/containers/:containerId`, ({ params }) => {
    const { containerId } = params;
    const container = mockContainers.find(c => c.id === containerId);

    if (!container) {
      return new HttpResponse(
        JSON.stringify({ error: '컨테이너를 찾을 수 없습니다.' }), 
        { status: 404 }
      );
    }

    // mockContainer를 API Container 타입으로 변환
    const containerResponse: Container = {
      id: container.id,
      name: container.name,
      image: container.image,
      status: container.status,
      created_at: new Date().toISOString(),
      health: "healthy", // 기본값 제공
      cpu_usage: container.cpu || 0,
      memory_usage: container.memory || 0,
      restart_count: 0, // 기본값 제공
      logs: ""
    };

    return HttpResponse.json(containerResponse);
  })
]; 