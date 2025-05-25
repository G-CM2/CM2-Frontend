import React from 'react';
import { NodeConnection, Node } from '../types';
import { cn } from '@/lib/utils';

interface ConnectionLineProps {
  connection: NodeConnection;
  nodes: Node[];
  className?: string;
}

const getConnectionColor = (connection: NodeConnection): string => {
  const typeColor = connection.type === 'management' ? 'stroke-blue-400' : 
                   connection.type === 'data' ? 'stroke-purple-400' : 'stroke-gray-400';
  
  return connection.status === 'active' ? typeColor : 'stroke-red-400';
};

const getStrokeDashArray = (type: NodeConnection['type']): string => {
  switch (type) {
    case 'management':
      return '0'; // Solid line
    case 'data':
      return '5,5'; // Dashed line
    case 'heartbeat':
      return '2,3'; // Dotted line
    default:
      return '0';
  }
};

export const ConnectionLine: React.FC<ConnectionLineProps> = ({ 
  connection, 
  nodes, 
  className 
}) => {
  const fromNode = nodes.find(node => node.id === connection.from);
  const toNode = nodes.find(node => node.id === connection.to);

  if (!fromNode || !toNode) {
    return null;
  }

  const x1 = fromNode.position.x;
  const y1 = fromNode.position.y;
  const x2 = toNode.position.x;
  const y2 = toNode.position.y;

  // Calculate arrow position (80% along the line)
  const arrowX = x1 + (x2 - x1) * 0.8;
  const arrowY = y1 + (y2 - y1) * 0.8;
  
  // Calculate arrow angle
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  return (
    <g className={className}>
      {/* Connection line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={cn(
          'stroke-2 transition-all duration-300',
          getConnectionColor(connection),
          connection.status === 'active' ? 'opacity-80' : 'opacity-40'
        )}
        strokeDasharray={getStrokeDashArray(connection.type)}
      >
        {/* Animated flow effect for active connections */}
        {connection.status === 'active' && (
          <animate
            attributeName="stroke-dashoffset"
            values="0;20"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </line>

      {/* Arrow indicator */}
      <polygon
        points="-6,-3 0,0 -6,3"
        className={cn(
          'transition-all duration-300',
          getConnectionColor(connection),
          connection.status === 'active' ? 'opacity-80' : 'opacity-40'
        )}
        fill="currentColor"
        transform={`translate(${arrowX}, ${arrowY}) rotate(${angle})`}
      />

      {/* Pulse effect for active connections */}
      {connection.status === 'active' && (
        <circle
          r="3"
          className={cn(
            'transition-all duration-300',
            getConnectionColor(connection)
        )}
          fill="currentColor"
          opacity="0.8"
        >
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path={`M ${x1} ${y1} L ${x2} ${y2}`}
          />
          <animate
            attributeName="opacity"
            values="0.8;0.2;0.8"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
}; 