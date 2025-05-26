import { SelfHealingSimulation, HealingStep, ContainerHealth, HealingScenario } from '../types';

// 목 데이터
const mockHealingSteps: HealingStep[] = [
  {
    id: 'step-1',
    step: 1,
    title: '장애 감지',
    description: '헬스체크 실패를 감지하고 컨테이너 상태를 확인합니다',
    status: 'pending',
    duration: 2000
  },
  {
    id: 'step-2',
    step: 2,
    title: '장애 컨테이너 격리',
    description: '장애가 발생한 컨테이너를 트래픽에서 제외합니다',
    status: 'pending',
    duration: 1500
  },
  {
    id: 'step-3',
    step: 3,
    title: '컨테이너 재시작',
    description: '장애 컨테이너를 재시작하여 복구를 시도합니다',
    status: 'pending',
    duration: 3000
  },
  {
    id: 'step-4',
    step: 4,
    title: '헬스체크 확인',
    description: '재시작된 컨테이너의 상태를 확인합니다',
    status: 'pending',
    duration: 2500
  },
  {
    id: 'step-5',
    step: 5,
    title: '서비스 복구',
    description: '정상 상태 확인 후 트래픽을 다시 라우팅합니다',
    status: 'pending',
    duration: 1000
  }
];

const mockContainers: ContainerHealth[] = [
  {
    containerId: 'container-1',
    status: 'healthy',
    lastCheck: new Date().toISOString(),
    failureCount: 0,
    uptime: 3600
  },
  {
    containerId: 'container-2',
    status: 'healthy',
    lastCheck: new Date().toISOString(),
    failureCount: 0,
    uptime: 3600
  },
  {
    containerId: 'container-3',
    status: 'healthy',
    lastCheck: new Date().toISOString(),
    failureCount: 0,
    uptime: 3600
  }
];

const mockSimulation: SelfHealingSimulation = {
  isRunning: false,
  currentStep: 0,
  steps: mockHealingSteps,
  events: [],
  containers: mockContainers,
  failedContainer: null,
  recoveryTime: 0,
  downtime: 0
};

export const fetchHealingSimulation = async (): Promise<{
  simulation: SelfHealingSimulation;
  scenarios: HealingScenario[];
}> => {
  // 실제 API 호출 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    simulation: mockSimulation,
    scenarios: getHealingScenarios()
  };
};

export const getHealingScenarios = (): HealingScenario[] => {
  return [
    {
      id: 'container-crash',
      name: '컨테이너 크래시',
      description: '애플리케이션 오류로 인한 컨테이너 종료',
      failureType: 'container-crash',
      expectedDowntime: 10,
      steps: mockHealingSteps
    },
    {
      id: 'health-check-failure',
      name: '헬스체크 실패',
      description: '헬스체크 엔드포인트 응답 실패',
      failureType: 'health-check-failure',
      expectedDowntime: 8,
      steps: mockHealingSteps
    },
    {
      id: 'node-failure',
      name: '노드 장애',
      description: '워커 노드 전체 장애 발생',
      failureType: 'node-failure',
      expectedDowntime: 15,
      steps: [
        ...mockHealingSteps,
        {
          id: 'step-6',
          step: 6,
          title: '새 노드에 재배치',
          description: '정상 노드에 컨테이너를 재배치합니다',
          status: 'pending',
          duration: 4000
        }
      ]
    }
  ];
}; 