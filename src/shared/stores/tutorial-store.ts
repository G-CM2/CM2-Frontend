import { create } from 'zustand';

export interface TutorialStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'navigate' | 'wait';
  actionData?: string | Record<string, unknown>;
}

export interface TutorialScenario {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
}

interface TutorialState {
  isOpen: boolean;
  currentScenario: string | null;
  currentStepIndex: number;
  scenarios: TutorialScenario[];
  openTutorial: (scenarioId: string) => void;
  closeTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  getCurrentStep: () => TutorialStep | null;
}

const tutorialScenarios: TutorialScenario[] = [
  {
    id: 'service-lifecycle',
    title: '서비스 생명주기 관리',
    description: '서비스 생성부터 삭제까지 전체 생명주기를 관리하는 방법을 학습합니다.',
    steps: [
      {
        target: 'services-page',
        title: '서비스 페이지',
        content: '서비스 관리 페이지로 이동하여 Docker 서비스들을 관리할 수 있습니다.',
        placement: 'bottom',
        action: 'navigate',
        actionData: '/services'
      },
      {
        target: 'create-service-button',
        title: '서비스 생성 시작',
        content: '새로운 서비스를 생성하려면 이 버튼을 클릭하세요. 서비스 생성 폼이 나타납니다.',
        placement: 'left',
        action: 'click'
      },
      {
        target: 'service-name-input',
        title: '서비스 이름 설정',
        content: '서비스 이름을 입력하세요. 예를 들어 "my-nginx-web"과 같이 입력할 수 있습니다.',
        placement: 'right'
      },
      {
        target: 'submit-service-button',
        title: '서비스 생성 완료',
        content: '모든 설정이 완료되면 이 버튼을 클릭하여 서비스를 생성할 수 있습니다.',
        placement: 'top'
      },
      {
        target: 'service-list',
        title: '서비스 확인',
        content: '생성된 서비스가 목록에 나타나고, 상태를 확인할 수 있습니다.',
        placement: 'top'
      },
      {
        target: 'service-list',
        title: '서비스 스케일링',
        content: '서비스의 레플리카 수를 조정하여 확장하거나 축소할 수 있습니다. + 또는 - 버튼을 사용하세요.',
        placement: 'left'
      },
      {
        target: 'service-list',
        title: '서비스 관리',
        content: '서비스를 업데이트하거나 삭제할 수 있습니다. 관리 버튼을 통해 세부 설정에 접근할 수 있습니다.',
        placement: 'top'
      }
    ]
  },
  {
    id: 'cluster-monitoring',
    title: '클러스터 모니터링',
    description: '클러스터 전체 상태와 개별 노드의 상태를 모니터링하는 방법을 학습합니다.',
    steps: [
      {
        target: 'cluster-page',
        title: '클러스터 페이지',
        content: '클러스터 관리 페이지로 이동하여 전체 클러스터 상태를 확인할 수 있습니다.',
        placement: 'bottom',
        action: 'navigate',
        actionData: '/cluster'
      },
      {
        target: 'cluster-status',
        title: '클러스터 상태',
        content: '클러스터의 전반적인 상태와 기본 정보를 확인할 수 있습니다.',
        placement: 'bottom'
      },
      {
        target: 'nodes-list',
        title: '노드 목록',
        content: '클러스터를 구성하는 모든 노드들의 상태를 한눈에 볼 수 있습니다.',
        placement: 'top'
      },
      {
        target: 'node-details',
        title: '노드 상세 정보',
        content: '각 노드의 역할, 상태, 가용성 등 자세한 정보를 확인할 수 있습니다.',
        placement: 'left'
      },
      {
        target: 'dashboard-page',
        title: '대시보드',
        content: '대시보드에서 시스템 전체의 리소스 사용량을 실시간으로 모니터링할 수 있습니다.',
        placement: 'bottom',
        action: 'navigate',
        actionData: '/'
      },
      {
        target: 'system-resources',
        title: '시스템 리소스',
        content: 'CPU, 메모리, 디스크 사용량을 실시간으로 추적할 수 있습니다.',
        placement: 'bottom'
      }
    ]
  },
  {
    id: 'failure-handling',
    title: '장애 대응',
    description: '시스템 장애 상황을 시뮬레이션하고 대응하는 방법을 학습합니다.',
    steps: [
      {
        target: 'cluster-page',
        title: '클러스터 관리',
        content: '장애 대응을 위해 클러스터 페이지로 이동합니다.',
        placement: 'bottom',
        action: 'navigate',
        actionData: '/cluster'
      },
      {
        target: 'simulate-failure',
        title: '장애 시뮬레이션',
        content: '특정 노드에 장애를 시뮬레이션하여 시스템의 복원력을 테스트할 수 있습니다.',
        placement: 'top'
      },
      {
        target: 'node-drain',
        title: '노드 드레인',
        content: '유지보수나 장애 대응을 위해 노드에서 모든 서비스를 안전하게 이동시킬 수 있습니다.',
        placement: 'left'
      },
      {
        target: 'services-page',
        title: '서비스 상태 확인',
        content: '서비스 페이지에서 장애 발생 후 서비스들의 상태 변화를 관찰할 수 있습니다.',
        placement: 'bottom',
        action: 'navigate',
        actionData: '/services'
      },
      {
        target: 'service-list',
        title: '서비스 복구 확인',
        content: '장애 처리 후 서비스들이 정상적으로 복구되었는지 확인할 수 있습니다.',
        placement: 'top'
      }
    ]
  },
  {
    id: 'scale-up',
    title: '서비스 스케일업',
    description: '서비스의 레플리카 수를 조정하여 확장하는 방법을 학습합니다.',
    steps: [
      {
        target: 'services-page',
        title: '서비스 페이지',
        content: '서비스 관리 페이지로 이동하여 Docker 서비스들을 관리할 수 있습니다.',
        placement: 'bottom',
        action: 'navigate',
        actionData: '/services'
      },
      {
        target: 'service-list',
        title: '서비스 선택',
        content: '스케일업할 서비스를 선택하세요.',
        placement: 'top'
      },
      {
        target: 'scale-up-button',
        title: '스케일업 시작',
        content: '스케일업 버튼을 클릭하여 레플리카 수를 조정할 수 있습니다.',
        placement: 'left',
        action: 'click'
      },
      {
        target: 'confirm-scale-up',
        title: '스케일업 완료',
        content: '스케일업이 완료되었는지 확인하세요.',
        placement: 'top'
      }
    ]
  }
];

export const useTutorialStore = create<TutorialState>((set, get) => ({
  isOpen: false,
  currentScenario: null,
  currentStepIndex: 0,
  scenarios: tutorialScenarios,
  
  openTutorial: (scenarioId: string) => {
    set({
      isOpen: true,
      currentScenario: scenarioId,
      currentStepIndex: 0
    });
  },
  
  closeTutorial: () => {
    set({
      isOpen: false,
      currentScenario: null,
      currentStepIndex: 0
    });
  },
  
  nextStep: () => {
    const { currentScenario, currentStepIndex, scenarios } = get();
    if (!currentScenario) return;
    
    const scenario = scenarios.find(s => s.id === currentScenario);
    if (!scenario) return;
    
    if (currentStepIndex < scenario.steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      get().closeTutorial();
    }
  },
  
  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },
  
  goToStep: (stepIndex: number) => {
    const { currentScenario, scenarios } = get();
    if (!currentScenario) return;
    
    const scenario = scenarios.find(s => s.id === currentScenario);
    if (!scenario) return;
    
    if (stepIndex >= 0 && stepIndex < scenario.steps.length) {
      set({ currentStepIndex: stepIndex });
    }
  },
  
  getCurrentStep: (): TutorialStep | null => {
    const { currentScenario, currentStepIndex, scenarios } = get();
    if (!currentScenario) return null;
    
    const scenario = scenarios.find(s => s.id === currentScenario);
    return scenario?.steps[currentStepIndex] || null;
  }
})); 