import React from 'react';
import { AutoscalingSimulation } from '../types';

interface ScalingAnimationProps {
  simulation: AutoscalingSimulation;
  width?: number;
  height?: number;
}

export const ScalingAnimation: React.FC<ScalingAnimationProps> = ({
  simulation,
  width = 400,
  height = 300
}) => {
  const { currentReplicas, targetReplicas, phase, metrics } = simulation;
  
  const maxReplicas = Math.max(currentReplicas, targetReplicas, 6);
  // 동적으로 그리드 계산
  const cols = Math.ceil(Math.sqrt(maxReplicas));
  const rows = Math.ceil(maxReplicas / cols);
  // spacing과 박스 크기 동적 계산
  const boxSize = Math.min(
    (width - 40) / cols - 10,
    (height - 60) / rows - 10,
    60
  );
  const spacingX = (width - boxSize * cols) / (cols + 1);
  const spacingY = (height - boxSize * rows) / (rows + 1);
  
  const getContainerPosition = (index: number) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = spacingX + col * (boxSize + spacingX) + boxSize / 2;
    const y = spacingY + row * (boxSize + spacingY) + boxSize / 2;
    return { x, y };
  };
  
  const getContainerStatus = (index: number) => {
    if (phase === 'scaling') {
      if (index < Math.min(currentReplicas, targetReplicas)) {
        return 'running';
      } else if (targetReplicas > currentReplicas && index < targetReplicas) {
        return 'starting';
      } else if (targetReplicas < currentReplicas && index >= targetReplicas && index < currentReplicas) {
        return 'stopping';
      }
    } else if (index < currentReplicas) {
      return 'running';
    }
    return 'pending';
  };
  
  const getContainerColor = (status: string) => {
    switch (status) {
      case 'running':
        return '#22c55e'; // 녹색
      case 'starting':
        return '#3b82f6'; // 파란색
      case 'stopping':
        return '#ef4444'; // 빨간색
      default:
        return '#9ca3af'; // 회색
    }
  };
  
  return (
    <div className="relative">
      <svg width={width} height={height} className="border rounded bg-gray-50">
        {/* 컨테이너들 */}
        {Array.from({ length: maxReplicas }, (_, index) => {
          const position = getContainerPosition(index);
          const status = getContainerStatus(index);
          const color = getContainerColor(status);
          const metric = metrics && metrics[index];
          
          return (
            <g key={index}>
              {/* 컨테이너 박스 */}
              <rect
                x={position.x - boxSize / 2}
                y={position.y - boxSize / 2}
                width={boxSize}
                height={boxSize}
                rx={boxSize * 0.15}
                fill={color}
                stroke="#ffffff"
                strokeWidth={3}
                className={`transition-all duration-1000 ${
                  status === 'starting' ? 'animate-pulse' : ''
                } ${
                  status === 'stopping' ? 'opacity-50' : 'opacity-100'
                }`}
              />
              
              {/* 컨테이너 아이콘 */}
              <text
                x={position.x}
                y={position.y + 6}
                textAnchor="middle"
                className="font-bold"
                fontSize={boxSize * 0.38}
                fill="#fff"
              >
                {index + 1}
              </text>
              
              {/* CPU/메모리 사용률 표시 */}
              {metric && (
                <text
                  x={position.x}
                  y={position.y + boxSize / 2 + 18}
                  textAnchor="middle"
                  className="font-semibold"
                  fontSize={boxSize * 0.22}
                  fill="#374151"
                >
                  CPU {metric.cpu.toFixed(0)}% | MEM {metric.memory.toFixed(0)}%
                </text>
              )}
              
              {/* 상태 표시 */}
              {status === 'starting' && (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={boxSize * 0.55}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values={`${boxSize * 0.45};${boxSize * 0.65};${boxSize * 0.45}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.8;0.2;0.8"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              
              {status === 'stopping' && (
                <g>
                  <line
                    x1={position.x - boxSize * 0.25}
                    y1={position.y - boxSize * 0.25}
                    x2={position.x + boxSize * 0.25}
                    y2={position.y + boxSize * 0.25}
                    stroke="#ffffff"
                    strokeWidth={3}
                  />
                  <line
                    x1={position.x + boxSize * 0.25}
                    y1={position.y - boxSize * 0.25}
                    x2={position.x - boxSize * 0.25}
                    y2={position.y + boxSize * 0.25}
                    stroke="#ffffff"
                    strokeWidth={3}
                  />
                </g>
              )}
            </g>
          );
        })}
        
        {/* 스케일링 방향 표시 */}
        {phase === 'scaling' && targetReplicas !== currentReplicas && (
          <g>
            <text
              x={width / 2}
              y={30}
              textAnchor="middle"
              className="text-sm font-bold fill-blue-600"
            >
              {targetReplicas > currentReplicas ? '스케일 아웃' : '스케일 인'}
            </text>
            <text
              x={width / 2}
              y={50}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {currentReplicas} → {targetReplicas} 레플리카
            </text>
          </g>
        )}
      </svg>
      
      {/* 상태 정보 */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{currentReplicas}</div>
          <div className="text-gray-600">현재 레플리카</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{targetReplicas}</div>
          <div className="text-gray-600">목표 레플리카</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600 capitalize">{phase}</div>
          <div className="text-gray-600">현재 상태</div>
        </div>
      </div>
    </div>
  );
}; 