import React from 'react';
import { ContainerHealth } from '../types';
import { Heart, AlertTriangle, X, RotateCcw } from 'lucide-react';

interface ContainerHealthStatusProps {
  containers: ContainerHealth[];
  failedContainer: string | null;
  width?: number;
  height?: number;
}

export const ContainerHealthStatus: React.FC<ContainerHealthStatusProps> = ({
  containers,
  failedContainer,
  width = 400,
  height = 200
}) => {
  const getContainerIcon = (container: ContainerHealth) => {
    switch (container.status) {
      case 'healthy':
        return <Heart className="w-6 h-6 text-green-500" />;
      case 'unhealthy':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'failed':
        return <X className="w-6 h-6 text-red-500" />;
      case 'recovering':
        return <RotateCcw className="w-6 h-6 text-blue-500 animate-spin" />;
      default:
        return <Heart className="w-6 h-6 text-gray-400" />;
    }
  };
  
  const getContainerColor = (container: ContainerHealth) => {
    switch (container.status) {
      case 'healthy':
        return '#22c55e';
      case 'unhealthy':
        return '#eab308';
      case 'failed':
        return '#ef4444';
      case 'recovering':
        return '#3b82f6';
      default:
        return '#9ca3af';
    }
  };
  
  const getContainerPosition = (index: number) => {
    const spacing = 120;
    const startX = (width - (containers.length - 1) * spacing) / 2;
    return {
      x: startX + index * spacing,
      y: height / 2
    };
  };
  
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div className="relative">
      <svg width={width} height={height} className="border rounded bg-gray-50">
        {containers.map((container, index) => {
          const position = getContainerPosition(index);
          const color = getContainerColor(container);
          const isFailedContainer = container.containerId === failedContainer;
          
          return (
            <g key={container.containerId}>
              {/* 컨테이너 박스 */}
              <rect
                x={position.x - 30}
                y={position.y - 30}
                width="60"
                height="60"
                rx="8"
                fill={color}
                stroke={isFailedContainer ? '#ef4444' : '#ffffff'}
                strokeWidth={isFailedContainer ? '4' : '2'}
                className={`transition-all duration-500 ${
                  container.status === 'recovering' ? 'animate-pulse' : ''
                } ${
                  isFailedContainer ? 'drop-shadow-lg' : 'drop-shadow-sm'
                }`}
              />
              
              {/* 컨테이너 ID */}
              <text
                x={position.x}
                y={position.y - 5}
                textAnchor="middle"
                className="text-xs fill-white font-bold"
              >
                {container.containerId.split('-')[1]}
              </text>
              
              {/* 상태 표시 */}
              {container.status === 'failed' && (
                <g>
                  {/* 실패 효과 */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="r"
                      values="35;45;35"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.8;0.2;0.8"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  
                  {/* X 표시 */}
                  <line
                    x1={position.x - 15}
                    y1={position.y - 15}
                    x2={position.x + 15}
                    y2={position.y + 15}
                    stroke="#ffffff"
                    strokeWidth="4"
                  />
                  <line
                    x1={position.x + 15}
                    y1={position.y - 15}
                    x2={position.x - 15}
                    y2={position.y + 15}
                    stroke="#ffffff"
                    strokeWidth="4"
                  />
                </g>
              )}
              
              {container.status === 'recovering' && (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="35"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  opacity="0.7"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0 220;110 110;220 0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              
              {/* 하트비트 효과 (healthy 상태) */}
              {container.status === 'healthy' && (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="32"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="1"
                  opacity="0.4"
                >
                  <animate
                    attributeName="r"
                    values="30;35;30"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0.2;0.6"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              
              {/* 컨테이너 라벨 */}
              <text
                x={position.x}
                y={position.y + 50}
                textAnchor="middle"
                className="text-xs fill-gray-700 font-medium"
              >
                {container.containerId}
              </text>
              
              {/* 상태 라벨 */}
              <text
                x={position.x}
                y={position.y + 65}
                textAnchor="middle"
                className={`text-xs font-medium ${
                  container.status === 'healthy' ? 'fill-green-600' :
                  container.status === 'unhealthy' ? 'fill-yellow-600' :
                  container.status === 'failed' ? 'fill-red-600' :
                  container.status === 'recovering' ? 'fill-blue-600' :
                  'fill-gray-600'
                }`}
              >
                {container.status === 'healthy' ? '정상' :
                 container.status === 'unhealthy' ? '불안정' :
                 container.status === 'failed' ? '실패' :
                 container.status === 'recovering' ? '복구중' : '알 수 없음'}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* 상세 정보 */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {containers.map((container) => (
          <div
            key={container.containerId}
            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              container.containerId === failedContainer
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {getContainerIcon(container)}
              <span className="text-sm font-medium">{container.containerId}</span>
            </div>
            
            <div className="space-y-1 text-xs text-gray-600">
              <div>업타임: {formatUptime(container.uptime)}</div>
              <div>실패 횟수: {container.failureCount}</div>
              <div>마지막 체크: {new Date(container.lastCheck).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 