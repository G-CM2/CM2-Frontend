import { AutoscalingSimulation, AutoscalingThreshold, AutoscalingMetrics } from '../types';

// 목 데이터
const mockThresholds: AutoscalingThreshold = {
  cpu: {
    scaleOut: 70,
    scaleIn: 30
  },
  memory: {
    scaleOut: 80,
    scaleIn: 40
  }
};

const generateMockMetrics = (count: number): AutoscalingMetrics[] => {
  const metrics: AutoscalingMetrics[] = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30000); // 30초 간격
    metrics.push({
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      timestamp: timestamp.toISOString()
    });
  }
  
  return metrics;
};

const mockSimulation: AutoscalingSimulation = {
  isRunning: false,
  currentReplicas: 3,
  targetReplicas: 3,
  metrics: generateMockMetrics(20),
  thresholds: mockThresholds,
  events: [],
  phase: 'monitoring'
};

export const fetchAutoscalingSimulation = async (): Promise<AutoscalingSimulation> => {
  // 실제 API 호출 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockSimulation;
};

export const generateHighLoadMetrics = (): AutoscalingMetrics => {
  return {
    cpu: 75 + Math.random() * 20, // 75-95% CPU 사용률
    memory: 85 + Math.random() * 10, // 85-95% 메모리 사용률
    timestamp: new Date().toISOString()
  };
};

export const generateNormalLoadMetrics = (): AutoscalingMetrics => {
  return {
    cpu: 20 + Math.random() * 30, // 20-50% CPU 사용률
    memory: 30 + Math.random() * 30, // 30-60% 메모리 사용률
    timestamp: new Date().toISOString()
  };
}; 