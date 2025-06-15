import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

export type TutorialAction = 'click' | 'wait';

export interface TutorialStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  action?: TutorialAction;
  actionData?: string;
}

export interface TutorialScenario {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
}

interface TutorialState {
  isOpen: boolean;
  currentScenario: TutorialScenario | null;
  currentStepIndex: number;
  scenarios: TutorialScenario[];
  openTutorial: (scenarioId: string) => void;
  closeTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  serviceCreateFormOpen: boolean;
  setServiceCreateFormOpen: (open: boolean) => void;
}

const tutorialScenarios: TutorialScenario[] = [
  {
    id: 'service-lifecycle',
    title: '서비스 생명주기 관리',
    description: '서비스 생성부터 삭제까지 전체 생명주기를 관리하는 방법을 학습합니다.',
    steps: [
      {
        target: '[data-tour="sidebar-services"]',
        title: '서비스 관리로 이동',
        content: '좌측 사이드바에서 "서비스" 메뉴를 클릭하세요!',
        placement: 'right',
        action: 'click',
      },
      {
        target: '[data-tour="create-service-button"]',
        title: '서비스 생성 버튼',
        content: '이 버튼을 클릭하면 새 서비스를 생성하기 위한 폼이 열립니다. 실제 서비스를 생성하지는 않고 기능만 설명합니다.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="service-list"]',
        title: '서비스 목록',
        content: '생성된 서비스들이 이 목록에 표시됩니다. 서비스의 상태와 기본 정보를 확인할 수 있습니다.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="scale-up-button"]',
        title: '서비스 스케일링',
        content: '이 버튼을 클릭하면 서비스의 레플리카 수를 조정할 수 있습니다. 서비스 확장이나 축소가 필요할 때 사용합니다.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="service-list"]',
        title: '서비스 관리(업데이트/삭제)',
        content: '서비스를 선택하면 세부 설정을 변경하거나 서비스를 삭제할 수 있는 옵션이 제공됩니다.',
        placement: 'bottom',
      },
    ],
  },
  {
    id: 'cluster-monitoring',
    title: '클러스터 모니터링',
    description: '클러스터 전체 상태와 개별 노드의 상태를 모니터링하는 방법을 학습합니다.',
    steps: [
      {
        target: '[data-tour="sidebar-cluster"]',
        title: '클러스터 관리로 이동',
        content: '좌측 사이드바에서 "클러스터" 메뉴를 클릭하세요!',
        placement: 'right',
        action: 'click',
      },
      {
        target: '[data-tour="cluster-status"]',
        title: '클러스터 상태 정보 확인',
        content: '클러스터의 전체 상태 정보를 확인하세요.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="nodes-list"]',
        title: '노드 목록 확인',
        content: '클러스터에 속한 노드들의 목록을 확인할 수 있습니다.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="node-details"]',
        title: '노드 상세 정보 확인',
        content: '각 노드의 상세 정보를 확인할 수 있습니다.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="simulate-failure"]',
        title: '노드 시뮬레이션',
        content: '노드 장애 상황을 시뮬레이션하여 테스트할 수 있습니다.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="node-drain"]',
        title: '노드 드레인 기능',
        content: '노드 드레인 기능을 사용하여 서비스를 다른 노드로 안전하게 이동할 수 있습니다.',
        placement: 'bottom',

      },
    ],
  },
  {
    id: 'failure-handling',
    title: '장애 대응',
    description: '시스템 장애 상황을 시뮬레이션하고 대응하는 방법을 학습합니다.',
    steps: [
      {
        target: '[data-tour="sidebar-cluster"]',
        title: '클러스터 관리로 이동',
        content: '좌측 사이드바에서 "클러스터" 메뉴를 클릭하세요!',
        placement: 'right',
        action: 'click',
      },
      {
        target: '[data-tour="simulate-failure"]',
        title: '노드 장애 시뮬레이션',
        content: '특정 노드에 장애 시뮬레이션을 실행합니다.',
        placement: 'bottom',
        action: 'click',
      },
      {
        target: '[data-tour="node-drain"]',
        title: '노드 드레인(서비스 안전 이동)',
        content: '드레인 버튼을 눌러 서비스가 안전하게 이동하도록 합니다.',
        placement: 'bottom',
        action: 'click',
      },
      {
        target: '[data-tour="node-details"]',
        title: '서비스 상태 변화 확인',
        content: '노드 및 서비스의 상태 변화를 확인하세요.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="node-details"]',
        title: '서비스 복구 상태 확인',
        content: '서비스가 정상적으로 복구되는지 확인합니다.',
        placement: 'bottom',
      },
    ],
  },
  {
    id: 'scale-up',
    title: '서비스 스케일업',
    description: '서비스의 레플리카 수를 조정하여 확장하는 방법을 학습합니다.',
    steps: [
      {
        target: '[data-tour="sidebar-services"]',
        title: '서비스 관리로 이동',
        content: '좌측 사이드바에서 "서비스" 메뉴를 클릭하세요!',
        placement: 'right',
        action: 'click',
      },
      {
        target: '[data-tour="scale-up-button"]',
        title: '스케일업 버튼 클릭',
        content: '스케일업(레플리카 수 증가) 버튼을 클릭합니다.',
        placement: 'bottom',
        action: 'click',
      },
      {
        target: '[data-tour="replica-input"]',
        title: '스케일업 결과 확인',
        content: '레플리카 수가 증가한 것을 확인하세요.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="confirm-scale-up"]',
        title: '스케일업 완료',
        content: '스케일업이 정상적으로 완료되었습니다.',
        placement: 'bottom',
      },
    ],
  },
];

const tutorialStoreImpl: StateCreator<TutorialState> = (set, get) => ({
  isOpen: false,
  currentScenario: null,
  currentStepIndex: 0,
  scenarios: tutorialScenarios,
  openTutorial: (scenarioId) => {
    const scenario = get().scenarios.find((s) => s.id === scenarioId) || null;
    set({ isOpen: true, currentScenario: scenario, currentStepIndex: 0 });
  },
  closeTutorial: () => set({ isOpen: false, currentScenario: null, currentStepIndex: 0, serviceCreateFormOpen: false }),
  nextStep: () => {
    const { currentScenario, currentStepIndex } = get();
    if (!currentScenario) return;
    if (currentStepIndex < currentScenario.steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isOpen: false, currentScenario: null, currentStepIndex: 0, serviceCreateFormOpen: false });
    }
  },
  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },
  serviceCreateFormOpen: false,
  setServiceCreateFormOpen: (open) => set({ serviceCreateFormOpen: open }),
});

export const useTutorialStore = create<TutorialState>()(devtools(tutorialStoreImpl, { name: 'tutorial-store' }));
