export interface ServiceDeployment {
  id: string;
  name: string;
  image: string;
  replicas: number;
  status: 'pending' | 'deploying' | 'running' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface DeploymentStep {
  id: string;
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  duration: number; // 애니메이션 지속 시간 (ms)
}

export interface ContainerReplica {
  id: string;
  serviceId: string;
  nodeId: string;
  status: 'pending' | 'pulling' | 'starting' | 'running' | 'failed';
  position: {
    x: number;
    y: number;
  };
  resources: {
    cpu: number;
    memory: number;
  };
}

export interface LoadBalancerTraffic {
  id: string;
  source: {
    x: number;
    y: number;
  };
  target: {
    nodeId: string;
    replicaId: string;
    x: number;
    y: number;
  };
  weight: number; // 트래픽 가중치 (1-100)
  active: boolean;
}

export interface DeploymentSimulation {
  service: ServiceDeployment;
  steps: DeploymentStep[];
  replicas: ContainerReplica[];
  traffic: LoadBalancerTraffic[];
  currentStep: number;
  isRunning: boolean;
} 