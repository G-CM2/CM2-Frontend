export interface AutoscalingMetrics {
  cpu: number; // CPU 사용률 (0-100)
  memory: number; // 메모리 사용률 (0-100)
  timestamp: string;
}

export interface AutoscalingThreshold {
  cpu: {
    scaleOut: number; // 스케일 아웃 임계값
    scaleIn: number; // 스케일 인 임계값
  };
  memory: {
    scaleOut: number;
    scaleIn: number;
  };
}

export interface AutoscalingEvent {
  id: string;
  type: 'scale-out' | 'scale-in';
  trigger: 'cpu' | 'memory';
  timestamp: string;
  beforeReplicas: number;
  afterReplicas: number;
  reason: string;
}

export interface AutoscalingSimulation {
  isRunning: boolean;
  currentReplicas: number;
  targetReplicas: number;
  metrics: AutoscalingMetrics[];
  thresholds: AutoscalingThreshold;
  events: AutoscalingEvent[];
  phase: 'monitoring' | 'scaling' | 'stabilizing';
}

export interface ServiceMetrics {
  serviceId: string;
  serviceName: string;
  replicas: number;
  metrics: AutoscalingMetrics;
  status: 'stable' | 'scaling-out' | 'scaling-in' | 'overloaded';
} 