import { DeploymentSimulation, ServiceDeployment, DeploymentStep, ContainerReplica, LoadBalancerTraffic } from '../types';

// 목 데이터
const mockService: ServiceDeployment = {
  id: 'service-web-app',
  name: 'web-application',
  image: 'nginx:1.21',
  replicas: 3,
  status: 'pending',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z'
};

const mockSteps: DeploymentStep[] = [
  {
    id: 'step-1',
    step: 1,
    title: '이미지 풀링',
    description: '각 노드에서 컨테이너 이미지를 다운로드합니다',
    status: 'pending',
    duration: 3000
  },
  {
    id: 'step-2',
    step: 2,
    title: '컨테이너 생성',
    description: '레플리카 수에 따라 컨테이너를 생성합니다',
    status: 'pending',
    duration: 2000
  },
  {
    id: 'step-3',
    step: 3,
    title: '서비스 시작',
    description: '컨테이너를 시작하고 헬스체크를 수행합니다',
    status: 'pending',
    duration: 2500
  },
  {
    id: 'step-4',
    step: 4,
    title: '로드 밸런서 설정',
    description: '트래픽 분산을 위한 로드 밸런서를 구성합니다',
    status: 'pending',
    duration: 1500
  }
];

const mockReplicas: ContainerReplica[] = [
  {
    id: 'replica-1',
    serviceId: 'service-web-app',
    nodeId: 'node-manager-1',
    status: 'pending',
    position: { x: 150, y: 200 },
    resources: { cpu: 0.5, memory: 512 }
  },
  {
    id: 'replica-2',
    serviceId: 'service-web-app',
    nodeId: 'node-worker-1',
    status: 'pending',
    position: { x: 350, y: 300 },
    resources: { cpu: 0.5, memory: 512 }
  },
  {
    id: 'replica-3',
    serviceId: 'service-web-app',
    nodeId: 'node-worker-2',
    status: 'pending',
    position: { x: 550, y: 200 },
    resources: { cpu: 0.5, memory: 512 }
  }
];

const mockTraffic: LoadBalancerTraffic[] = [
  {
    id: 'traffic-1',
    source: { x: 50, y: 100 },
    target: {
      nodeId: 'node-manager-1',
      replicaId: 'replica-1',
      x: 150,
      y: 200
    },
    weight: 33,
    active: false
  },
  {
    id: 'traffic-2',
    source: { x: 50, y: 100 },
    target: {
      nodeId: 'node-worker-1',
      replicaId: 'replica-2',
      x: 350,
      y: 300
    },
    weight: 34,
    active: false
  },
  {
    id: 'traffic-3',
    source: { x: 50, y: 100 },
    target: {
      nodeId: 'node-worker-2',
      replicaId: 'replica-3',
      x: 550,
      y: 200
    },
    weight: 33,
    active: false
  }
];

export const fetchDeploymentSimulation = async (): Promise<DeploymentSimulation> => {
  // 실제 API 호출 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    service: mockService,
    steps: mockSteps,
    replicas: mockReplicas,
    traffic: mockTraffic,
    currentStep: 0,
    isRunning: false
  };
}; 