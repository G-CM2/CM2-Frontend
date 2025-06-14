export interface Container {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'paused';
  created: string;
  ports: string[];
  cpu: number;
  memory: number;
  cpu_usage: number;
  memory_usage: number;
} 