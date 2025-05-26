export interface ContainerHealth {
  containerId: string;
  status: 'healthy' | 'unhealthy' | 'failed' | 'recovering';
  lastCheck: string;
  failureCount: number;
  uptime: number; // 초 단위
}

export interface HealingStep {
  id: string;
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  duration: number; // 애니메이션 지속 시간 (ms)
  startTime?: string;
  endTime?: string;
}

export interface HealingEvent {
  id: string;
  containerId: string;
  nodeId: string;
  type: 'failure-detected' | 'restart-initiated' | 'restart-completed' | 'replacement-created';
  timestamp: string;
  details: string;
}

export interface SelfHealingSimulation {
  isRunning: boolean;
  currentStep: number;
  steps: HealingStep[];
  events: HealingEvent[];
  containers: ContainerHealth[];
  failedContainer: string | null;
  recoveryTime: number; // 총 복구 시간 (초)
  downtime: number; // 다운타임 (초)
}

export interface HealingScenario {
  id: string;
  name: string;
  description: string;
  failureType: 'container-crash' | 'node-failure' | 'health-check-failure';
  expectedDowntime: number; // 예상 다운타임 (초)
  steps: HealingStep[];
} 