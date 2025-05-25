import { ClusterTopology } from '../types';

// Mock data for development
const mockClusterTopology: ClusterTopology = {
  nodes: [
    {
      id: 'manager-1',
      name: 'swarm-manager-1',
      role: 'manager',
      status: 'active',
      position: { x: 400, y: 200 },
      ip: '192.168.1.10',
      hostname: 'swarm-manager-1.local',
      availability: 'active',
      engineVersion: '24.0.7',
      resources: {
        cpus: 4,
        memory: 8192,
        disk: 100
      },
      labels: {
        'node.role': 'manager',
        'environment': 'production'
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T15:30:00Z'
    },
    {
      id: 'manager-2',
      name: 'swarm-manager-2',
      role: 'manager',
      status: 'active',
      position: { x: 600, y: 200 },
      ip: '192.168.1.11',
      hostname: 'swarm-manager-2.local',
      availability: 'active',
      engineVersion: '24.0.7',
      resources: {
        cpus: 4,
        memory: 8192,
        disk: 100
      },
      labels: {
        'node.role': 'manager',
        'environment': 'production'
      },
      createdAt: '2024-01-15T10:05:00Z',
      updatedAt: '2024-01-20T15:30:00Z'
    },
    {
      id: 'worker-1',
      name: 'swarm-worker-1',
      role: 'worker',
      status: 'active',
      position: { x: 200, y: 400 },
      ip: '192.168.1.20',
      hostname: 'swarm-worker-1.local',
      availability: 'active',
      engineVersion: '24.0.7',
      resources: {
        cpus: 8,
        memory: 16384,
        disk: 200
      },
      labels: {
        'node.role': 'worker',
        'workload': 'compute'
      },
      createdAt: '2024-01-15T10:10:00Z',
      updatedAt: '2024-01-20T15:30:00Z'
    },
    {
      id: 'worker-2',
      name: 'swarm-worker-2',
      role: 'worker',
      status: 'active',
      position: { x: 400, y: 400 },
      ip: '192.168.1.21',
      hostname: 'swarm-worker-2.local',
      availability: 'active',
      engineVersion: '24.0.7',
      resources: {
        cpus: 8,
        memory: 16384,
        disk: 200
      },
      labels: {
        'node.role': 'worker',
        'workload': 'compute'
      },
      createdAt: '2024-01-15T10:15:00Z',
      updatedAt: '2024-01-20T15:30:00Z'
    },
    {
      id: 'worker-3',
      name: 'swarm-worker-3',
      role: 'worker',
      status: 'failed',
      position: { x: 600, y: 400 },
      ip: '192.168.1.22',
      hostname: 'swarm-worker-3.local',
      availability: 'drain',
      engineVersion: '24.0.7',
      resources: {
        cpus: 8,
        memory: 16384,
        disk: 200
      },
      labels: {
        'node.role': 'worker',
        'workload': 'compute'
      },
      createdAt: '2024-01-15T10:20:00Z',
      updatedAt: '2024-01-20T15:30:00Z'
    },
    {
      id: 'worker-4',
      name: 'swarm-worker-4',
      role: 'worker',
      status: 'inactive',
      position: { x: 800, y: 400 },
      ip: '192.168.1.23',
      hostname: 'swarm-worker-4.local',
      availability: 'pause',
      engineVersion: '24.0.7',
      resources: {
        cpus: 8,
        memory: 16384,
        disk: 200
      },
      labels: {
        'node.role': 'worker',
        'workload': 'storage'
      },
      createdAt: '2024-01-15T10:25:00Z',
      updatedAt: '2024-01-20T15:30:00Z'
    }
  ],
  connections: [
    { from: 'manager-1', to: 'manager-2', type: 'management', status: 'active' },
    { from: 'manager-1', to: 'worker-1', type: 'management', status: 'active' },
    { from: 'manager-1', to: 'worker-2', type: 'management', status: 'active' },
    { from: 'manager-1', to: 'worker-3', type: 'management', status: 'inactive' },
    { from: 'manager-1', to: 'worker-4', type: 'management', status: 'inactive' },
    { from: 'manager-2', to: 'worker-1', type: 'management', status: 'active' },
    { from: 'manager-2', to: 'worker-2', type: 'management', status: 'active' },
    { from: 'manager-2', to: 'worker-3', type: 'management', status: 'inactive' },
    { from: 'manager-2', to: 'worker-4', type: 'management', status: 'inactive' },
    { from: 'worker-1', to: 'worker-2', type: 'data', status: 'active' },
    { from: 'worker-2', to: 'worker-3', type: 'data', status: 'inactive' },
    { from: 'worker-2', to: 'worker-4', type: 'data', status: 'inactive' }
  ],
  lastUpdated: new Date().toISOString()
};

export const fetchClusterTopology = async (): Promise<ClusterTopology> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, this would be an actual API call
  // return fetch('/api/cluster/topology').then(res => res.json());
  
  return mockClusterTopology;
}; 