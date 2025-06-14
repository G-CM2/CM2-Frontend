import { mockContainers } from '@/entities/container';
import { http, HttpResponse } from 'msw';
import { Container, ContainersResponse } from '../containers';
import { MonitoringResponse, SystemSummary } from '../monitoring';

// API 경로를 일관되게 유지하기 위한 기본 URL
const API_URL = 'http://localhost:8080';

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