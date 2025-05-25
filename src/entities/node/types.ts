export type NodeStatus = 'active' | 'inactive' | 'failed' | 'unknown';

export type NodeRole = 'manager' | 'worker';

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeConnection {
  from: string;
  to: string;
  type: 'management' | 'data' | 'heartbeat';
  status: 'active' | 'inactive';
}

export interface Node {
  id: string;
  name: string;
  role: NodeRole;
  status: NodeStatus;
  position: NodePosition;
  ip: string;
  hostname: string;
  availability: 'active' | 'pause' | 'drain';
  engineVersion: string;
  resources: {
    cpus: number;
    memory: number;
    disk: number;
  };
  labels: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ClusterTopology {
  nodes: Node[];
  connections: NodeConnection[];
  lastUpdated: string;
} 