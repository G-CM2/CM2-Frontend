import type { Container, ContainerDetails } from '@/entities/container/types';
import { http, HttpResponse } from 'msw';
import type {
  ClusterHealth,
  ClusterNode,
  ClusterNodesResponse,
  ClusterStatus,
  SimulateFailureRequest,
  SimulateFailureResponse
} from '../api/cluster';
import type { Service, SystemSummary } from '../api/services';

// 간단한 로컬 스토리지 시뮬레이션
const Storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },
};

// 클러스터 관련 초기 데이터
const initialClusterNodes: ClusterNode[] = [
  {
    id: 'node-id-abc123',
    hostname: 'manager-1',
    status: 'Ready',
    availability: 'Active',
    managerStatus: 'Leader'
  },
  {
    id: 'node-id-def456',
    hostname: 'worker-1',
    status: 'Ready',
    availability: 'Active',
    managerStatus: ''
  }
];

// 초기 데이터 생성
function initializeData() {
  const services = Storage.get<Service[]>('SERVICES', []);
  const containers = Storage.get<Container[]>('CONTAINERS', []);

  if (services.length === 0) {
    const initialServices: Service[] = [
      {
        id: 'srv-1',
        name: 'nginx-web',
        image: 'nginx:latest',
        replicas: 3,
        status: 'running',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
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
        id: 'srv-2',
        name: 'redis-cache',
        image: 'redis:7-alpine',
        replicas: 1,
        status: 'running',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        ports: [
          { internal: 6379, external: 6379 }
        ],
        cpu_usage: 8.2,
        memory_usage: 128,
        networks: ['default'],
        mode: 'replicated',
      },
      {
        id: 'srv-3',
        name: 'postgres-db',
        image: 'postgres:15',
        replicas: 1,
        status: 'running',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        ports: [
          { internal: 5432, external: 5432 }
        ],
        cpu_usage: 35.7,
        memory_usage: 512,
        networks: ['default'],
        mode: 'replicated',
      },
      {
        id: 'srv-4',
        name: 'node-api',
        image: 'node:18-alpine',
        replicas: 2,
        status: 'running',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        ports: [
          { internal: 3000, external: 3000 }
        ],
        cpu_usage: 22.1,
        memory_usage: 384,
        networks: ['default'],
        mode: 'replicated',
      },
      {
        id: 'srv-5',
        name: 'python-worker',
        image: 'python:3.11-slim',
        replicas: 1,
        status: 'running',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        ports: [],
        cpu_usage: 18.9,
        memory_usage: 298,
        networks: ['default'],
        mode: 'replicated',
      },
    ];
    Storage.set('SERVICES', initialServices);
  }

  if (containers.length === 0) {
    const initialContainers: Container[] = [
      {
        id: 'container-1',
        name: 'nginx-web-1',
        image: 'nginx:latest',
        status: 'running',
        created: '2024-01-01T00:00:00Z',
        ports: ['80:8080'],
        cpu: 2,
        memory: 512,
        cpu_usage: 15.3,
        memory_usage: 256,
      },
      {
        id: 'container-2',
        name: 'redis-cache-1',
        image: 'redis:7-alpine',
        status: 'running',
        created: '2024-01-01T00:00:00Z',
        ports: ['6379:6379'],
        cpu: 1,
        memory: 256,
        cpu_usage: 8.7,
        memory_usage: 128,
      },
    ];
    Storage.set('CONTAINERS', initialContainers);
  }
}

// 기준값들 정의
const BASE_RESOURCE_VALUES = {
  cpu_usage: 45.2,
  memory_usage: 78.5,
  disk_usage: 62.1,
};

// 랜덤 보정 함수 (기준값의 ±10% 범위에서 랜덤 생성)
function getRandomizedValue(baseValue: number, variationPercent: number = 10): number {
  const variation = baseValue * (variationPercent / 100);
  const randomOffset = (Math.random() - 0.5) * 2 * variation;
  const result = baseValue + randomOffset;
  return Math.max(0, Math.min(100, result)); // 0~100% 범위로 제한
}

// 서비스별 리소스 사용량 생성 함수
function generateServiceResources(serviceName: string, image: string): { cpu_usage: number; memory_usage: number } {
  const currentHour = new Date().getHours();
  
  // 시간대별 부하 계수 (업무시간에 높은 부하)
  const timeMultiplier = currentHour >= 9 && currentHour <= 18 ? 1.3 : 
                        currentHour >= 2 && currentHour <= 6 ? 0.7 : 1.0;
  
  // 5% 확률로 부하 스파이크 발생
  const spikeMultiplier = Math.random() < 0.05 ? 1.8 : 1.0;
  
  let cpuRange: [number, number];
  let memoryRange: [number, number]; // MB 단위
  
  // 서비스 타입별 리소스 사용량 범위 설정
  if (image.includes('nginx') || serviceName.includes('web')) {
    cpuRange = [8, 35];
    memoryRange = [150, 400];
  } else if (image.includes('redis') || serviceName.includes('cache')) {
    cpuRange = [12, 50];
    memoryRange = [100, 300];
  } else if (image.includes('postgres') || image.includes('mysql') || serviceName.includes('db')) {
    cpuRange = [15, 70];
    memoryRange = [200, 800];
  } else if (image.includes('node') || image.includes('express') || serviceName.includes('api')) {
    cpuRange = [10, 45];
    memoryRange = [180, 500];
  } else if (image.includes('python') || image.includes('django') || image.includes('flask')) {
    cpuRange = [12, 55];
    memoryRange = [200, 600];
  } else {
    // 기본값
    cpuRange = [10, 40];
    memoryRange = [150, 400];
  }
  
  // 기본 랜덤값 생성
  const baseCpu = cpuRange[0] + Math.random() * (cpuRange[1] - cpuRange[0]);
  const baseMemory = memoryRange[0] + Math.random() * (memoryRange[1] - memoryRange[0]);
  
  // 시간대 및 스파이크 계수 적용
  const finalCpu = Math.min(85, baseCpu * timeMultiplier * spikeMultiplier);
  const finalMemory = Math.min(1000, baseMemory * timeMultiplier * spikeMultiplier);
  
  return {
    cpu_usage: Math.round(finalCpu * 10) / 10, // 소수점 1자리
    memory_usage: Math.round(finalMemory)
  };
}

// 시스템 요약 정보 업데이트
function updateSystemSummary(): SystemSummary {
  const containers = Storage.get<Container[]>('CONTAINERS', []);
  const running = containers.filter(c => c.status === 'running').length;
  const stopped = containers.filter(c => c.status === 'stopped').length;
  const error = containers.filter(c => c.status === 'paused').length;
  const failed = 0; // Container 타입에 failed 상태가 없으므로 0으로 설정

  const summary: SystemSummary = {
    status: {
      description: '정상 작동 중',
      indicator: 'normal',
    },
    containers: {
      total: containers.length,
      running,
      stopped,
      error,
      failed,
    },
    resources: {
      cpu_usage: getRandomizedValue(BASE_RESOURCE_VALUES.cpu_usage),
      memory_usage: getRandomizedValue(BASE_RESOURCE_VALUES.memory_usage),
      disk_usage: getRandomizedValue(BASE_RESOURCE_VALUES.disk_usage),
    },
    updated_at: new Date().toISOString(),
  };

  return summary;
}

// 롤링 업데이트 상태 추적을 위한 인터페이스
interface RollingUpdateState {
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

// 롤링 업데이트 상태 스토리지
const rollingUpdateStates = new Map<string, RollingUpdateState>();

// 롤링 업데이트 시뮬레이션 실행
function simulateRollingUpdate(serviceId: string, targetImage: string) {
  const updateId = `${serviceId}-${Date.now()}`;
  
  const initialState: RollingUpdateState = {
    serviceId,
    status: 'starting',
    currentStep: 0,
    totalSteps: 5,
    steps: [
      { id: 1, name: 'image-pull', status: 'pending', message: '새 이미지 다운로드 중...' },
      { id: 2, name: 'stop-old', status: 'pending', message: '기존 컨테이너 중지 중...' },
      { id: 3, name: 'start-new', status: 'pending', message: '새 컨테이너 시작 중...' },
      { id: 4, name: 'health-check', status: 'pending', message: '헬스체크 수행 중...' },
      { id: 5, name: 'cleanup', status: 'pending', message: '정리 작업 수행 중...' }
    ],
    startTime: Date.now(),
    targetImage
  };

  rollingUpdateStates.set(updateId, initialState);

  // 비동기 시뮬레이션 실행
  setTimeout(async () => {
    try {
      const state = rollingUpdateStates.get(updateId);
      if (!state) return;

      // 단계별 진행
      for (let i = 0; i < state.steps.length; i++) {
        const currentState = rollingUpdateStates.get(updateId);
        if (!currentState) return;

        // 현재 단계 시작
        currentState.status = 'in-progress';
        currentState.currentStep = i + 1;
        currentState.steps[i].status = 'running';
        rollingUpdateStates.set(updateId, { ...currentState });

        // 단계별 소요 시간 (랜덤)
        const duration = Math.random() * 3000 + 2000; // 2-5초
        await new Promise(resolve => setTimeout(resolve, duration));

        // 현재 단계 완료
        const updatedState = rollingUpdateStates.get(updateId);
        if (updatedState) {
          updatedState.steps[i].status = 'completed';
          rollingUpdateStates.set(updateId, { ...updatedState });
        }
      }

      // 검증 단계
      const finalState = rollingUpdateStates.get(updateId);
      if (finalState) {
        finalState.status = 'verifying';
        finalState.verifyCountdown = 5;
        rollingUpdateStates.set(updateId, { ...finalState });

        // 5초 카운트다운
        for (let i = 5; i > 0; i--) {
          const verifyState = rollingUpdateStates.get(updateId);
          if (verifyState) {
            verifyState.verifyCountdown = i;
            rollingUpdateStates.set(updateId, { ...verifyState });
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 완료
        const completedState = rollingUpdateStates.get(updateId);
        if (completedState) {
          completedState.status = 'completed';
          completedState.verifyCountdown = 0;
          rollingUpdateStates.set(updateId, { ...completedState });

          // 실제 서비스 이미지 업데이트
          const services = Storage.get<Service[]>('SERVICES', []);
          const serviceIndex = services.findIndex(s => s.id === serviceId);
          if (serviceIndex !== -1) {
            services[serviceIndex].image = targetImage;
            services[serviceIndex].updated_at = new Date().toISOString();
            Storage.set('SERVICES', services);
          }

          // 30초 후 상태 정리
          setTimeout(() => {
            rollingUpdateStates.delete(updateId);
          }, 30000);
        }
      }
    } catch {
      // 에러 발생 시 실패 상태로 변경
      const errorState = rollingUpdateStates.get(updateId);
      if (errorState) {
        errorState.status = 'failed';
        rollingUpdateStates.set(updateId, { ...errorState });
      }
    }
  }, 1000);

  return updateId;
}

/**
 * MSW 핸들러 정의
 */
export const handlers = [
  // 모니터링 (GET /)
  http.get('http://localhost:8080/', () => {
    initializeData();
    
    return HttpResponse.json({
      clusterID: 'lx8l9id3o2h3idl0h2xbb8w3a',
      name: 'default',
      orchestration: '5',
      raftStatus: '42',
      nodes: [
        {
          id: 'node-id-abc123',
          hostname: 'manager-1',
          status: 'Ready',
          availability: 'Active',
          managerStatus: 'Leader',
        },
        {
          id: 'node-id-def456',
          hostname: 'worker-1',
          status: 'Ready',
          availability: 'Active',
          managerStatus: '',
        },
      ],
    });
  }),

  // 서비스 목록 조회 (GET /services)
  http.get('http://localhost:8080/services', () => {
    initializeData();
    const services = Storage.get<Service[]>('SERVICES', []);
    
    // 각 서비스에 실시간 리소스 사용량 적용 및 롤링 업데이트 상태 반영
    const servicesWithResources = services.map(service => {
      const resources = generateServiceResources(service.name, service.image);
      
      // 해당 서비스의 진행 중인 롤링 업데이트 확인
      const ongoingUpdate = Array.from(rollingUpdateStates.values())
        .find(state => state.serviceId === service.id && 
          ['starting', 'in-progress', 'verifying'].includes(state.status));
      
      return {
        ...service,
        cpu_usage: resources.cpu_usage,
        memory_usage: resources.memory_usage,
        status: ongoingUpdate ? 'pending' : service.status
      };
    });
    
    return HttpResponse.json(servicesWithResources);
  }),

  // 시스템 요약 정보 조회 (GET /summary)
  http.get('http://localhost:8080/summary', () => {
    initializeData();
    const summary = updateSystemSummary();
    return HttpResponse.json(summary);
  }),

  // 특정 서비스 조회 (GET /services/{id})
  http.get('http://localhost:8080/services/:id', ({ params }) => {
    initializeData();
    const { id } = params;
    const services = Storage.get<Service[]>('SERVICES', []);
    const service = services.find(s => s.id === id);
    
    if (!service) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // 실시간 리소스 사용량 적용 및 롤링 업데이트 상태 반영
    const resources = generateServiceResources(service.name, service.image);
    
    // 해당 서비스의 진행 중인 롤링 업데이트 확인
    const ongoingUpdate = Array.from(rollingUpdateStates.values())
      .find(state => state.serviceId === id && 
        ['starting', 'in-progress', 'verifying'].includes(state.status));
    
    const serviceWithResources = {
      ...service,
      cpu_usage: resources.cpu_usage,
      memory_usage: resources.memory_usage,
      status: ongoingUpdate ? 'pending' : service.status
    };
    
    return HttpResponse.json(serviceWithResources);
  }),

  // 서비스 생성 (POST /services)
  http.post('http://localhost:8080/services', async ({ request }) => {
    initializeData();
    const data = await request.json() as { name: string; image: string; replicas?: number; ports?: Array<{internal: number; external: number}>; environment?: Record<string, string> };
    const services = Storage.get<Service[]>('SERVICES', []);
    
    const newService: Service = {
      id: `srv-${Date.now()}`,
      name: data.name,
      image: data.image,
      replicas: data.replicas || 1,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ports: data.ports || [],
      cpu_usage: 0,
      memory_usage: 0,
      networks: ['default'],
      mode: 'replicated',
    };
    
    services.push(newService);
    Storage.set('SERVICES', services);
    
    return HttpResponse.json(newService);
  }),

  // 서비스 삭제 (DELETE /services/{id})
  http.delete('http://localhost:8080/services/:id', ({ params }) => {
    initializeData();
    const { id } = params;
    const services = Storage.get<Service[]>('SERVICES', []);
    const serviceIndex = services.findIndex(s => s.id === id);
    
    if (serviceIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    services.splice(serviceIndex, 1);
    Storage.set('SERVICES', services);
    
    return new HttpResponse(null, { status: 204 });
  }),

  // 서비스 스케일링 (PUT /services/{id}/scale)
  http.put('http://localhost:8080/services/:id/scale', async ({ params, request }) => {
    initializeData();
    const { id } = params;
    const data = await request.json() as { replicas: number };
    const services = Storage.get<Service[]>('SERVICES', []);
    const service = services.find(s => s.id === id);
    
    if (!service) {
      return new HttpResponse(null, { status: 404 });
    }
    
    service.replicas = data.replicas;
    service.updated_at = new Date().toISOString();
    Storage.set('SERVICES', services);
    
    return HttpResponse.json(service);
  }),

  // 서비스 업데이트 (POST /services/{id}/update)
  http.post('http://localhost:8080/services/:id/update', async ({ params, request }) => {
    initializeData();
    const { id } = params;
    const data = await request.json() as { image?: string; ports?: Array<{internal: number; external: number}>; environment?: Record<string, string> };
    const services = Storage.get<Service[]>('SERVICES', []);
    const service = services.find(s => s.id === id);
    
    if (!service) {
      return new HttpResponse(null, { status: 404 });
    }
    
    if (data.image) service.image = data.image;
    if (data.ports) service.ports = data.ports;
    service.updated_at = new Date().toISOString();
    Storage.set('SERVICES', services);
    
    return HttpResponse.json(service);
  }),

  // 컨테이너 목록 조회 (GET /containers)
  http.get('http://localhost:8080/containers', () => {
    initializeData();
    const containers = Storage.get<Container[]>('CONTAINERS', []);
    return HttpResponse.json(containers);
  }),

  // 특정 컨테이너 조회 (GET /containers/{containerId})
  http.get('http://localhost:8080/containers/:containerId', ({ params }) => {
    initializeData();
    const { containerId } = params;
    const containers = Storage.get<Container[]>('CONTAINERS', []);
    const container = containers.find(c => c.id === containerId);
    
    if (!container) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // 명세서에 맞는 상세 정보 응답
    const containerDetails: ContainerDetails = {
      id: container.id,
      name: container.name,
      image: container.image,
      status: container.status,
      created_at: container.created,
      health: 'healthy',
      cpu_usage: container.cpu_usage,
      memory_usage: container.memory_usage,
      restart_count: 0,
      ports: [
        { internal: 80, external: 8080 }
      ],
      volumes: [
        { source: '/data', target: '/app/data' }
      ],
      environment: [
        { key: 'NODE_ENV', value: 'production' }
      ],
      logs: '2024-01-01T00:00:00Z INFO: Container started\n2024-01-01T00:01:00Z INFO: Service ready',
    };
    
    return HttpResponse.json(containerDetails);
  }),

  // 클러스터 헬스 조회 (GET /cluster/health)
  http.get('http://localhost:8080/cluster/health', () => {
    const nodes = Storage.get<ClusterNode[]>('CLUSTER_NODES', initialClusterNodes);
    const health: ClusterHealth = {
      totalNodes: nodes.length,
      activeManagers: nodes.filter(n => n.managerStatus === 'Leader' || n.managerStatus === 'Reachable').length,
      unreachableNodes: nodes.filter(n => n.status !== 'Ready').length
    };
    return HttpResponse.json(health);
  }),

  // 클러스터 노드 목록 조회 (GET /cluster/nodes)
  http.get('http://localhost:8080/cluster/nodes', () => {
    const nodes = Storage.get<ClusterNode[]>('CLUSTER_NODES', initialClusterNodes);
    const response: ClusterNodesResponse = {
      total: nodes.length,
      nodes
    };
    return HttpResponse.json(response);
  }),

  // 클러스터 상태 조회 (GET /cluster/status)
  http.get('http://localhost:8080/cluster/status', () => {
    const nodes = Storage.get<ClusterNode[]>('CLUSTER_NODES', initialClusterNodes);
    const status: ClusterStatus = {
      clusterID: 'lx8l9id3o2h3idl0h2xbb8w3a',
      name: 'default',
      orchestration: '5',
      raftStatus: '42',
      nodes
    };
    return HttpResponse.json(status);
  }),

  // 노드 드레인 (POST /cluster/nodes/{nodeId}/drain)
  http.post('http://localhost:8080/cluster/nodes/:nodeId/drain', async ({ params }) => {
    const { nodeId } = params;
    const nodes = Storage.get<ClusterNode[]>('CLUSTER_NODES', initialClusterNodes);
    const node = nodes.find(n => n.id === nodeId);
    
    if (!node) {
      return new HttpResponse(null, { status: 404 });
    }
    
    node.availability = 'Drain';
    Storage.set('CLUSTER_NODES', nodes);
    
    return new HttpResponse(null, { status: 200 });
  }),

  // 장애 시뮬레이션 (POST /cluster/simulate/failure)
  http.post('http://localhost:8080/cluster/simulate/failure', async ({ request }) => {
    const data = await request.json() as SimulateFailureRequest;
    const nodes = Storage.get<ClusterNode[]>('CLUSTER_NODES', initialClusterNodes);
    const node = nodes.find(n => n.id === data.nodeId);
    
    if (!node) {
      return new HttpResponse(null, { status: 404 });
    }
    
    if (data.failureType === 'drain') {
      node.availability = 'Drain';
    } else if (data.failureType === 'activate') {
      node.availability = 'Active';
    }
    
    Storage.set('CLUSTER_NODES', nodes);
    
    const response: SimulateFailureResponse = {
      nodeId: data.nodeId,
      failureType: data.failureType
    };
    
    return HttpResponse.json(response);
  }),

  // 롤링 업데이트 시작 (POST /services/{id}/rolling-update)
  http.post('http://localhost:8080/services/:id/rolling-update', async ({ params, request }) => {
    initializeData();
    const { id } = params;
    const data = await request.json() as { image: string };
    const services = Storage.get<Service[]>('SERVICES', []);
    const service = services.find(s => s.id === id);
    
    if (!service) {
      return new HttpResponse(null, { status: 404 });
    }

    // 롤링 업데이트 시뮬레이션 시작
    const updateId = simulateRollingUpdate(id as string, data.image);
    
    return HttpResponse.json({ 
      updateId,
      message: '롤링 업데이트가 시작되었습니다.',
      serviceId: id
    });
  }),

  // 롤링 업데이트 상태 조회 (GET /services/{id}/rolling-update/{updateId})
  http.get('http://localhost:8080/services/:id/rolling-update/:updateId', ({ params }) => {
    const { updateId } = params;
    const state = rollingUpdateStates.get(updateId as string);
    
    if (!state) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(state);
  }),

  // 롤링 업데이트 목록 조회 (GET /services/{id}/rolling-updates)
  http.get('http://localhost:8080/services/:id/rolling-updates', ({ params }) => {
    const { id } = params;
    const serviceUpdates = Array.from(rollingUpdateStates.values())
      .filter(state => state.serviceId === id);
    
    return HttpResponse.json(serviceUpdates);
  }),
];
