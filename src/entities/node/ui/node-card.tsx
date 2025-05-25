import React from 'react';
import { Node, NodeStatus, NodeRole } from '../types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Server, HardDrive, Cpu, MemoryStick } from 'lucide-react';

interface NodeCardProps {
  node: Node;
  onClick?: (node: Node) => void;
  className?: string;
}

const getStatusColor = (status: NodeStatus): string => {
  switch (status) {
    case 'active':
      return 'bg-green-500 border-green-600 shadow-green-500/20';
    case 'inactive':
      return 'bg-yellow-500 border-yellow-600 shadow-yellow-500/20';
    case 'failed':
      return 'bg-red-500 border-red-600 shadow-red-500/20';
    default:
      return 'bg-gray-500 border-gray-600 shadow-gray-500/20';
  }
};

const getRoleIcon = (role: NodeRole) => {
  return role === 'manager' ? (
    <Server className="w-4 h-4" />
  ) : (
    <HardDrive className="w-4 h-4" />
  );
};

const getRoleColor = (role: NodeRole): string => {
  return role === 'manager' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
};

export const NodeCard: React.FC<NodeCardProps> = ({ node, onClick, className }) => {
  const handleClick = () => {
    onClick?.(node);
  };

  return (
    <Card
      className={cn(
        'relative p-4 cursor-pointer transition-all duration-300 hover:scale-105',
        'border-2 shadow-lg',
        getStatusColor(node.status),
        className
      )}
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: node.position.x - 80,
        top: node.position.y - 60,
        width: '160px',
        height: '120px'
      }}
    >
      {/* Status indicator */}
      <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-current animate-pulse" />
      
      {/* Node header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 text-white">
          {getRoleIcon(node.role)}
          <span className="text-xs font-medium truncate">{node.name}</span>
        </div>
        <Badge className={cn('text-xs', getRoleColor(node.role))}>
          {node.role}
        </Badge>
      </div>

      {/* Node info */}
      <div className="space-y-1 text-white text-xs">
        <div className="flex items-center gap-1">
          <Cpu className="w-3 h-3" />
          <span>{node.resources.cpus} CPUs</span>
        </div>
        <div className="flex items-center gap-1">
          <MemoryStick className="w-3 h-3" />
          <span>{(node.resources.memory / 1024).toFixed(1)}GB</span>
        </div>
        <div className="text-xs opacity-80 truncate">
          {node.ip}
        </div>
      </div>

      {/* Availability indicator */}
      {node.availability !== 'active' && (
        <div className="absolute bottom-1 right-1">
          <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
            {node.availability}
          </Badge>
        </div>
      )}
    </Card>
  );
}; 