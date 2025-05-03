import { http, HttpResponse } from 'msw';
import { mockContainers } from '@/entities/container';
import { Container, ContainersResponse, ContainerActionRequest } from '../containers';
import { DashboardSummary } from '../system';
import { ScalingPolicy, CreateScalingPolicyRequest } from '../scaling';
import { TimelineItem } from '../timeline';

// API 경로를 일관되게 유지하기 위한 기본 URL
const API_URL = 'http://localhost:3000/api';

// 모의 대시보드 데이터
const mockDashboard: DashboardSummary = {
  containers: {
    total: 10,
    running: 7,
    stopped: 2,
    paused: 1
  },
  resources: {
    cpu_usage: 45.5,
    memory_usage: 62.3,
    disk_usage: 38.7
  },
  health: {
    healthy: 8,
    unhealthy: 2,
    total: 10
  },
  recent_events: [
    {
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'container_start',
      message: 'Container web-server started'
    },
    {
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: 'container_stop',
      message: 'Container db-backup stopped'
    }
  ]
};

// 모의 스케일링 정책
const mockScalingPolicies: ScalingPolicy[] = [
  {
    id: 'policy-1',
    name: '웹 서버 자동 확장',
    target: 'web-server',
    min_replicas: 2,
    max_replicas: 10,
    metrics: [
      { type: 'cpu', target_value: 75 },
      { type: 'memory', target_value: 80 }
    ],
    created_at: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString()
  },
  {
    id: 'policy-2',
    name: 'API 서버 자동 확장',
    target: 'api-server',
    min_replicas: 1,
    max_replicas: 5,
    metrics: [
      { type: 'cpu', target_value: 70 }
    ],
    created_at: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 3600000).toISOString()
  }
];

// 모의 타임라인 항목
const generateTimelineItems = (containerId: string): TimelineItem[] => {
  return [
    {
      timestamp: new Date(Date.now() - 1000000).toISOString(),
      event: 'start',
      details: `Container ${containerId} started`
    },
    {
      timestamp: new Date(Date.now() - 2000000).toISOString(),
      event: 'stop',
      details: `Container ${containerId} stopped`
    },
    {
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      event: 'create',
      details: `Container ${containerId} created`
    }
  ];
};

// API 엔드포인트 모킹을 위한 핸들러
export const handlers = [
  // 컨테이너 목록 조회
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

  // 단일 컨테이너 조회
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
  }),

  // 컨테이너 타임라인 조회
  http.get(`${API_URL}/containers/:containerId/timeline`, ({ params }) => {
    const { containerId } = params;
    return HttpResponse.json(generateTimelineItems(containerId as string));
  }),

  // 컨테이너 동작 수행
  http.post(`${API_URL}/containers/:containerId/actions`, async ({ params, request }) => {
    const { containerId } = params;
    const data = await request.json();
    const action = (data as ContainerActionRequest).action;

    return HttpResponse.json({
      container_id: containerId,
      action,
      status: 'success',
      timestamp: new Date().toISOString()
    });
  }),

  // 시스템 요약 정보 조회
  http.get(`${API_URL}/system/summary`, () => {
    return HttpResponse.json({
      total_containers: mockContainers.length,
      running_containers: mockContainers.filter(c => c.status === 'running').length,
      stopped_containers: mockContainers.filter(c => c.status === 'stopped').length,
      system_cpu_usage: 45.5,
      system_memory_usage: 62.3,
      system_disk_usage: 38.7,
      uptime: 1209600 // 14 days in seconds
    });
  }),

  // 대시보드 요약 정보 조회
  http.get(`${API_URL}/dashboard/summary`, () => {
    return HttpResponse.json(mockDashboard);
  }),

  // 스케일링 정책 목록 조회
  http.get(`${API_URL}/scaling/policies`, () => {
    return HttpResponse.json({ policies: mockScalingPolicies });
  }),

  // 스케일링 정책 상세 조회
  http.get(`${API_URL}/scaling/policies/:policyId`, ({ params }) => {
    const { policyId } = params;
    const policy = mockScalingPolicies.find(p => p.id === policyId);

    if (!policy) {
      return new HttpResponse(
        JSON.stringify({ error: '정책을 찾을 수 없습니다.' }), 
        { status: 404 }
      );
    }

    return HttpResponse.json(policy);
  }),

  // 스케일링 정책 생성
  http.post(`${API_URL}/scaling/policies`, async ({ request }) => {
    const policyData = await request.json() as CreateScalingPolicyRequest;
    
    const newPolicy: ScalingPolicy = {
      ...policyData,
      id: `policy-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return HttpResponse.json(newPolicy);
  }),

  // 스케일링 정책 업데이트
  http.put(`${API_URL}/scaling/policies/:policyId`, async ({ params, request }) => {
    const { policyId } = params;
    const updatedData = await request.json() as Partial<CreateScalingPolicyRequest>;
    
    const policy = mockScalingPolicies.find(p => p.id === policyId);
    
    if (!policy) {
      return new HttpResponse(
        JSON.stringify({ error: '정책을 찾을 수 없습니다.' }), 
        { status: 404 }
      );
    }
    
    const updatedPolicy: ScalingPolicy = {
      ...policy,
      ...updatedData,
      updated_at: new Date().toISOString()
    };
    
    return HttpResponse.json(updatedPolicy);
  }),

  // 스케일링 정책 삭제
  http.delete(`${API_URL}/scaling/policies/:policyId`, ({ params }) => {
    const { policyId } = params;
    const policy = mockScalingPolicies.find(p => p.id === policyId);
    
    if (!policy) {
      return new HttpResponse(
        JSON.stringify({ error: '정책을 찾을 수 없습니다.' }), 
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ success: true });
  }),

  // 타임라인 조회
  http.get(`${API_URL}/timeline/:componentId`, ({ params }) => {
    const { componentId } = params;
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    
    return HttpResponse.json({
      component_id: componentId,
      from: twoHoursAgo.toISOString(),
      to: now.toISOString(),
      datapoints: Array(24).fill(0).map((_, i) => ({
        timestamp: new Date(twoHoursAgo.getTime() + i * 5 * 60 * 1000).toISOString(),
        status: 'running',
        cpu_usage: Math.random() * 100,
        memory_usage: Math.random() * 100
      }))
    });
  })
]; 