import React from 'react';
import { LoadBalancerTraffic } from '../types';

interface TrafficFlowProps {
  traffic: LoadBalancerTraffic;
  isActive?: boolean;
}

export const TrafficFlow: React.FC<TrafficFlowProps> = ({ 
  traffic, 
  isActive = false 
}) => {
  const { source, target, weight, active } = traffic;
  
  // 곡선 경로 계산
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2 - 50; // 곡선을 위해 중간점을 위로 올림
  
  const pathData = `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
  
  // 트래픽 가중치에 따른 선 두께
  const strokeWidth = Math.max(1, weight / 20);
  
  return (
    <g className={`transition-opacity duration-500 ${active && isActive ? 'opacity-100' : 'opacity-30'}`}>
      {/* 트래픽 경로 */}
      <path
        d={pathData}
        fill="none"
        stroke="#3B82F6"
        strokeWidth={strokeWidth}
        strokeDasharray={active && isActive ? "0" : "5,5"}
        className="transition-all duration-300"
      />
      
      {/* 트래픽 흐름 애니메이션 */}
      {active && isActive && (
        <>
          {/* 데이터 패킷 애니메이션 */}
          <circle r="3" fill="#1D4ED8">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={pathData}
            />
          </circle>
          
          {/* 추가 패킷들 (가중치에 따라) */}
          {weight > 50 && (
            <circle r="2" fill="#3B82F6">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path={pathData}
                begin="0.5s"
              />
            </circle>
          )}
          
          {weight > 75 && (
            <circle r="2" fill="#60A5FA">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path={pathData}
                begin="1s"
              />
            </circle>
          )}
        </>
      )}
      
      {/* 트래픽 가중치 라벨 */}
      <text
        x={midX}
        y={midY - 10}
        textAnchor="middle"
        className="text-xs fill-blue-600 font-medium"
      >
        {weight}%
      </text>
    </g>
  );
}; 