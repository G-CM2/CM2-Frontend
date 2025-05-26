export type {
  AutoscalingMetrics,
  AutoscalingThreshold,
  AutoscalingEvent,
  AutoscalingSimulation,
  ServiceMetrics
} from './types';

export { 
  fetchAutoscalingSimulation,
  generateHighLoadMetrics,
  generateNormalLoadMetrics
} from './api/fetch-autoscaling-simulation';
export { MetricsChart } from './ui/metrics-chart';
export { ScalingAnimation } from './ui/scaling-animation'; 