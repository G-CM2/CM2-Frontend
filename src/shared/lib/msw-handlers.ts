import type { Container } from '@/entities/container/types';
import type { CreateServiceRequest, ScaleServiceRequest, Service, SystemSummary } from '@/shared/api/services';
import { http, HttpResponse } from 'msw';
import {
    INITIAL_CLUSTER_NODES,
    INITIAL_CONTAINERS,
    INITIAL_SERVICES,
    INITIAL_SYSTEM_SUMMARY,
    type ClusterNode
} from './mock-data';
import { Storage } from './storage';

/**
 * 데이터 초기화 함수
 */
function initializeData() {
  if (!Storage.has('SERVICES')) {
    Storage.set('SERVICES', INITIAL_SERVICES);
  }
  if (!Storage.has('CONTAINERS')) {
    Storage.set('CONTAINERS', INITIAL_CONTAINERS);
  }
  if (!Storage.has('SYSTEM_SUMMARY')) {
    Storage.set('SYSTEM_SUMMARY', INITIAL_SYSTEM_SUMMARY);
  }
  if (!Storage.has('CLUSTER_NODES')) {
    Storage.set('CLUSTER_NODES', INITIAL_CLUSTER_NODES);
  }
}

/**
 * 시스템 요약 정보 업데이트
 */
function updateSystemSummary() {
  const services = Storage.get<Service[]>('SERVICES', []);
  const containers = Storage.get<Container[]>('CONTAINERS', []);
  
  // const runningServices = services.filter(s => s.status === 'running').length;
  const runningContainers = containers.filter(c => c.status === 'running').length;
  const stoppedContainers = containers.filter(c => c.status === 'stopped').length;
  const failedContainers = containers.filter(c => c.status === 'paused').length;
  
  const totalCpuUsage = containers.reduce((sum, c) => sum + c.cpu, 0);
  const totalMemoryUsage = containers.reduce((sum, c) => sum + c.memory, 0);
  
  let indicator: 'normal' | 'warning' | 'critical' = 'normal';
  let description = '모든 시스템이 정상 작동 중입니다';
  
  if (failedContainers > 0) {
    indicator = 'critical';
    description = `${failedContainers}개의 컨테이너에 심각한 문제가 있습니다`;
  } else if (stoppedContainers > 0 || services.some(s => s.status === 'failed')) {
    indicator = 'warning';
    description = '일부 서비스에 문제가 있습니다';
  }
  
  const summary: SystemSummary = {
    status: { indicator, description },
    containers: {
      total: containers.length,
      running: runningContainers,
      stopped: stoppedContainers,
      failed: failedContainers
    },
    resources: {
      cpu_usage: totalCpuUsage,
      memory_usage: totalMemoryUsage,
      disk_usage: 25
    }
  };
  
  Storage.set('SYSTEM_SUMMARY', summary);
  return summary;
}

/**
 * MSW 핸들러 정의
 */
export const handlers = [
  // 서비스 목록 조회
  http.get('http://localhost:8080/services', () => {
    initializeData();
    const services = Storage.get<Service[]>('SERVICES', []);
    return HttpResponse.json(services);
  }),

  // 시스템 요약 정보 조회
  http.get('http://localhost:8080/summary', () => {
    initializeData();
    const summary = updateSystemSummary();
    return HttpResponse.json(summary);
  }),

  // 특정 서비스 조회
  http.get('/api/services/:id', ({ params }) => {
    initializeData();
    const services = Storage.get<Service[]>('SERVICES', []);
    const service = services.find(s => s.id === params.id);
    
    if (!service) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(service);
  }),

  // 서비스 생성
  http.post('http://localhost:8080/services', async ({ request }) => {
    initializeData();
    const body = await request.json() as CreateServiceRequest;
    const services = Storage.get<Service[]>('SERVICES', []);
    
    const newService: Service = {
      id: `service-${Date.now()}`,
      name: body.name,
      image: body.image,
      mode: body.mode || 'replicated',
      replicas: body.replicas || 1,
      status: 'running',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      labels: body.labels || {},
      ports: body.ports || [],
      networks: body.networks || [],
      constraints: body.constraints || [],
      resources: body.resources || {},
      updateConfig: {
        parallelism: 1,
        delay: '10s',
        failureAction: 'pause',
        monitor: '5s',
        maxFailureRatio: 0,
        order: 'stop-first',
        ...body.updateConfig
      },
      rollbackConfig: {
        parallelism: 1,
        delay: '10s',
        failureAction: 'pause',
        monitor: '5s',
        maxFailureRatio: 0,
        order: 'stop-first',
        ...body.rollbackConfig
      },
      endpoint: {
        spec: {
          mode: 'vip',
          ports: body.ports || []
        },
        ports: body.ports || [],
        virtualIPs: []
      }
    };
    
    services.push(newService);
    Storage.set('SERVICES', services);
    
    // 컨테이너도 생성
    const containers = Storage.get<Container[]>('CONTAINERS', []);
    for (let i = 1; i <= (newService.replicas || 1); i++) {
      const container: Container = {
        id: `container-${Date.now()}-${i}`,
        name: `${newService.name}.${i}`,
        image: newService.image,
        status: 'running',
        created: new Date().toISOString(),
        ports: newService.ports.map(p => `${p.publishedPort}:${p.targetPort}/${p.protocol}`),
        cpu: Math.floor(Math.random() * 20) + 5,
        memory: Math.floor(Math.random() * 200) + 50,
        cpu_usage: Math.floor(Math.random() * 20) + 5,
        memory_usage: Math.floor(Math.random() * 200) + 50
      };
      containers.push(container);
    }
    Storage.set('CONTAINERS', containers);
    
    updateSystemSummary();
    return HttpResponse.json(newService, { status: 201 });
  }),

  // 서비스 스케일링
  http.patch('http://localhost:8080/services/:id/scale', async ({ params, request }) => {
    initializeData();
    const body = await request.json() as ScaleServiceRequest;
    const services = Storage.get<Service[]>('SERVICES', []);
    const serviceIndex = services.findIndex(s => s.id === params.id);
    
    if (serviceIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const service = services[serviceIndex];
    const oldReplicas = service.replicas || 1;
    service.replicas = body.replicas;
    service.updatedAt = new Date().toISOString();
    
    services[serviceIndex] = service;
    Storage.set('SERVICES', services);
    
    // 컨테이너 수 조정
    const containers = Storage.get<Container[]>('CONTAINERS', []);
    const serviceContainers = containers.filter(c => c.name.startsWith(service.name));
    
    if (body.replicas > oldReplicas) {
      // 컨테이너 추가
      for (let i = oldReplicas + 1; i <= body.replicas; i++) {
        const container: Container = {
          id: `container-${Date.now()}-${i}`,
          name: `${service.name}.${i}`,
          image: service.image,
          status: 'running',
          created: new Date().toISOString(),
          ports: service.ports.map(p => `${p.publishedPort}:${p.targetPort}/${p.protocol}`),
          cpu: Math.floor(Math.random() * 20) + 5,
          memory: Math.floor(Math.random() * 200) + 50,
          cpu_usage: Math.floor(Math.random() * 20) + 5,
          memory_usage: Math.floor(Math.random() * 200) + 50
        };
        containers.push(container);
      }
    } else if (body.replicas < oldReplicas) {
      // 컨테이너 제거
      const containersToRemove = serviceContainers.slice(body.replicas);
      containersToRemove.forEach(container => {
        const index = containers.findIndex(c => c.id === container.id);
        if (index !== -1) {
          containers.splice(index, 1);
        }
      });
    }
    
    Storage.set('CONTAINERS', containers);
    updateSystemSummary();
    return HttpResponse.json(service);
  }),

  // 서비스 삭제
  http.delete('http://localhost:8080/services/:id', ({ params }) => {
    initializeData();
    const services = Storage.get<Service[]>('SERVICES', []);
    const serviceIndex = services.findIndex(s => s.id === params.id);
    
    if (serviceIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const service = services[serviceIndex];
    services.splice(serviceIndex, 1);
    Storage.set('SERVICES', services);
    
    // 관련 컨테이너도 삭제
    const containers = Storage.get<Container[]>('CONTAINERS', []);
    const filteredContainers = containers.filter(c => !c.name.startsWith(service.name));
    Storage.set('CONTAINERS', filteredContainers);
    
    updateSystemSummary();
    return new HttpResponse(null, { status: 204 });
  }),

  // 컨테이너 목록 조회
  http.get('http://localhost:8080/containers', () => {
    initializeData();
    const containers = Storage.get<Container[]>('CONTAINERS', []);
    return HttpResponse.json(containers);
  }),

  // 클러스터 노드 목록 조회
  http.get('http://localhost:8080/cluster/nodes', () => {
    initializeData();
    const nodes = Storage.get<ClusterNode[]>('CLUSTER_NODES', []);
    return HttpResponse.json(nodes);
  }),

  // 노드 가용성 변경
  http.patch('http://localhost:8080/cluster/nodes/:id/availability', async ({ params, request }) => {
    initializeData();
    const body = await request.json() as { availability: 'active' | 'pause' | 'drain' };
    const nodes = Storage.get<ClusterNode[]>('CLUSTER_NODES', []);
    const nodeIndex = nodes.findIndex(n => n.id === params.id);
    
    if (nodeIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    nodes[nodeIndex].availability = body.availability;
    nodes[nodeIndex].updatedAt = new Date().toISOString();
    Storage.set('CLUSTER_NODES', nodes);
    
    return HttpResponse.json(nodes[nodeIndex]);
  }),

  // 클러스터 상태 조회
  http.get('http://localhost:8080/cluster/status', () => {
    initializeData();
    const nodes = Storage.get<ClusterNode[]>('CLUSTER_NODES', []);
    const services = Storage.get<Service[]>('SERVICES', []);
    
    const status = {
      id: 'cluster-1',
      nodes: {
        total: nodes.length,
        active: nodes.filter(n => n.status === 'ready').length,
        inactive: nodes.filter(n => n.status === 'down').length,
        managers: nodes.filter(n => n.role === 'manager').length,
        workers: nodes.filter(n => n.role === 'worker').length
      },
      services: {
        total: services.length,
        running: services.filter(s => s.status === 'running').length,
        failed: services.filter(s => s.status === 'failed').length
      },
      swarmStatus: 'active' as const,
      version: {
        index: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      }
    };
    
    return HttpResponse.json(status);
  }),

  // 클러스터 헬스체크 조회
  http.get('http://localhost:8080/cluster/health', () => {
    initializeData();
    const nodes = Storage.get<ClusterNode[]>('CLUSTER_NODES', []);
    const services = Storage.get<Service[]>('SERVICES', []);
    
    const healthyNodes = nodes.filter(n => n.status === 'ready').length;
    const runningServices = services.filter(s => s.status === 'running').length;
    
    const health = {
      status: (healthyNodes === nodes.length && runningServices === services.length) 
        ? 'healthy' as const
        : (healthyNodes > 0 && runningServices > 0) 
          ? 'degraded' as const 
          : 'unhealthy' as const,
      lastCheck: new Date().toISOString(),
      checks: [
        {
          name: 'Node Health',
          status: healthyNodes === nodes.length ? 'ok' as const : 'warning' as const,
          message: `${healthyNodes}/${nodes.length} nodes healthy`,
          lastCheck: new Date().toISOString()
        },
        {
          name: 'Service Health',
          status: runningServices === services.length ? 'ok' as const : 'warning' as const,
          message: `${runningServices}/${services.length} services running`,
          lastCheck: new Date().toISOString()
        }
      ],
      uptime: Math.floor(Math.random() * 86400), // Random uptime in seconds
      version: '1.0.0'
    };
    
    return HttpResponse.json(health);
  }),

  // 노드 드레인
  http.post('http://localhost:8080/cluster/nodes/:id/drain', async ({ params, request }) => {
    initializeData();
    const body = await request.json() as { force?: boolean; timeout?: number; ignoreErrors?: boolean };
    const nodes = Storage.get<ClusterNode[]>('CLUSTER_NODES', []);
    const nodeIndex = nodes.findIndex(n => n.id === params.id);
    
    if (nodeIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // 노드를 drain 상태로 변경
    nodes[nodeIndex].availability = 'drain';
    nodes[nodeIndex].updatedAt = new Date().toISOString();
    Storage.set('CLUSTER_NODES', nodes);
    
    const response = {
      nodeId: params.id as string,
      status: 'completed' as const,
      message: body.force ? 'Node forcefully drained' : 'Node successfully drained',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      drainedServices: ['nginx-web', 'redis-cache'], // Mock drained services
      options: {
        force: body.force || false,
        timeout: body.timeout || 60,
        ignoreErrors: body.ignoreErrors || false
      }
    };
    
    return HttpResponse.json(response);
  }),

  // 장애 시뮬레이션
  http.post('http://localhost:8080/cluster/simulate/failure', async ({ request }) => {
    const body = await request.json() as {
      type: 'node-failure' | 'network-partition' | 'high-load';
      target: string;
      duration?: number;
      severity?: 'low' | 'medium' | 'high';
      options?: Record<string, unknown>;
    };
    
    const response = {
      id: `sim-${Date.now()}`,
      type: body.type,
      target: body.target,
      status: 'started' as const,
      startedAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + (body.duration || 60) * 1000).toISOString(),
      progress: 0,
      logs: [`Starting ${body.type} simulation on ${body.target}`]
    };
    
    return HttpResponse.json(response);
  })
];
