import React from 'react';
import { ContainerReplica } from '../types';

interface ReplicaContainerProps {
  replica: ContainerReplica;
  isAnimating?: boolean;
}

export const ReplicaContainer: React.FC<ReplicaContainerProps> = ({ 
  replica, 
  isAnimating = false 
}) => {
  const getStatusColor = (status: ContainerReplica['status']) => {
    switch (status) {
      case 'pending':
        return 'fill-gray-300 stroke-gray-400';
      case 'pulling':
        return 'fill-blue-200 stroke-blue-400';
      case 'starting':
        return 'fill-yellow-200 stroke-yellow-400';
      case 'running':
        return 'fill-green-200 stroke-green-400';
      case 'failed':
        return 'fill-red-200 stroke-red-400';
      default:
        return 'fill-gray-300 stroke-gray-400';
    }
  };

  const getStatusIcon = (status: ContainerReplica['status']) => {
    switch (status) {
      case 'pending':
        return (
          <circle cx="25" cy="25" r="3" fill="#9CA3AF" />
        );
      case 'pulling':
        return (
          <g>
            <circle cx="25" cy="25" r="3" fill="#3B82F6">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      case 'starting':
        return (
          <g>
            <circle cx="25" cy="25" r="3" fill="#F59E0B">
              <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      case 'running':
        return (
          <circle cx="25" cy="25" r="3" fill="#10B981" />
        );
      case 'failed':
        return (
          <g>
            <line x1="22" y1="22" x2="28" y2="28" stroke="#EF4444" strokeWidth="2" />
            <line x1="28" y1="22" x2="22" y2="28" stroke="#EF4444" strokeWidth="2" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <g
      transform={`translate(${replica.position.x}, ${replica.position.y})`}
      className={isAnimating ? 'transition-all duration-1000 ease-in-out' : ''}
    >
      {/* 컨테이너 박스 */}
      <rect
        x="0"
        y="0"
        width="50"
        height="50"
        rx="4"
        className={`${getStatusColor(replica.status)} stroke-2`}
      />
      
      {/* 상태 아이콘 */}
      {getStatusIcon(replica.status)}
      
      {/* 컨테이너 ID 라벨 */}
      <text
        x="25"
        y="65"
        textAnchor="middle"
        className="text-xs fill-gray-600 font-medium"
      >
        {replica.id.split('-')[1]}
      </text>
      
      {/* 리소스 정보 */}
      <text
        x="25"
        y="78"
        textAnchor="middle"
        className="text-xs fill-gray-500"
      >
        {replica.resources.cpu}CPU {replica.resources.memory}MB
      </text>
      
      {/* 배포 애니메이션 효과 */}
      {isAnimating && replica.status === 'starting' && (
        <circle
          cx="25"
          cy="25"
          r="25"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          opacity="0.6"
        >
          <animate
            attributeName="r"
            values="0;30;0"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
}; 