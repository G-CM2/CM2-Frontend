import React, { useState } from 'react';
import { AutoscalingSimulation, SelfHealingEvent } from '../types';

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
  
  const [selfHealingTimeline, setSelfHealingTimeline] = useState<SelfHealingEvent[]>([]);
  const [failureContainer, setFailureContainer] = useState<number | null>(null);

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
  
  // 컨테이너 클릭 시 장애 시뮬레이션
  const handleContainerClick = (index: number) => {
    if (failureContainer !== null) return; // 한 번에 하나만 장애
    setFailureContainer(index);
    const now = new Date();
    const events: SelfHealingEvent[] = [
      {
        id: `${index}-fail`,
        containerIndex: index,
        step: 'failure',
        timestamp: now.toISOString(),
        description: `컨테이너 #${index + 1} 장애 발생`
      },
      {
        id: `${index}-detect`,
        containerIndex: index,
        step: 'detected',
        timestamp: new Date(now.getTime() + 1000).toISOString(),
        description: `장애 감지`
      },
      {
        id: `${index}-restart`,
        containerIndex: index,
        step: 'restarting',
        timestamp: new Date(now.getTime() + 2000).toISOString(),
        description: `컨테이너 재시작 중`
      },
      {
        id: `${index}-recover`,
        containerIndex: index,
        step: 'recovered',
        timestamp: new Date(now.getTime() + 3000).toISOString(),
        description: `서비스 복구 완료`
      }
    ];
    setSelfHealingTimeline(events);
    // 3초 후 장애 상태 해제
    setTimeout(() => {
      setFailureContainer(null);
      setTimeout(() => setSelfHealingTimeline([]), 1000);
    }, 3000);
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
          // 장애 상태면 빨간색 강조
          const isFailed = failureContainer === index;
          return (
            <g key={index} onClick={() => handleContainerClick(index)} style={{ cursor: 'pointer' }}>
              <rect
                x={position.x - boxSize / 2}
                y={position.y - boxSize / 2}
                width={boxSize}
                height={boxSize}
                rx={boxSize * 0.15}
                fill={isFailed ? '#ef4444' : color}
                stroke="#ffffff"
                strokeWidth={isFailed ? 5 : 3}
                className={`transition-all duration-1000 ${
                  status === 'starting' ? 'animate-pulse' : ''
                } ${
                  status === 'stopping' ? 'opacity-50' : 'opacity-100'
                }`}
              />
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
      {/* 셀프힐링 타임라인 */}
      {selfHealingTimeline.length > 0 && (
        <div className="mt-6">
          <div className="font-bold text-gray-700 mb-2">셀프 힐링 타임라인</div>
          <ol className="space-y-2">
            {selfHealingTimeline.map((event) => (
              <li key={event.id} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: getStepColor(event.step) }}></span>
                <span className="text-sm">{event.description}</span>
                <span className="text-xs text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

// 타임라인 단계별 색상
function getStepColor(step: SelfHealingEvent['step']) {
  switch (step) {
    case 'failure': return '#ef4444';
    case 'detected': return '#f59e42';
    case 'restarting': return '#3b82f6';
    case 'recovered': return '#22c55e';
    default: return '#9ca3af';
  }
} 