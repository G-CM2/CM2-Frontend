import React from 'react';
import { AutoscalingMetrics, AutoscalingThreshold } from '../types';

interface MetricsChartProps {
  metrics: AutoscalingMetrics[];
  thresholds: AutoscalingThreshold;
  width?: number;
  height?: number;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  metrics,
  thresholds,
  width = 600,
  height = 200
}) => {
  const maxDataPoints = 20;
  const displayMetrics = metrics.slice(-maxDataPoints);
  
  const getYPosition = (value: number) => {
    return height - (value / 100) * height;
  };
  
  const getXPosition = (index: number) => {
    return (index / (maxDataPoints - 1)) * width;
  };
  
  const createPath = (values: number[]) => {
    if (values.length === 0) return '';
    
    let path = `M ${getXPosition(0)} ${getYPosition(values[0])}`;
    for (let i = 1; i < values.length; i++) {
      path += ` L ${getXPosition(i)} ${getYPosition(values[i])}`;
    }
    return path;
  };
  
  const cpuValues = displayMetrics.map(m => m.cpu);
  const memoryValues = displayMetrics.map(m => m.memory);
  
  const cpuPath = createPath(cpuValues);
  const memoryPath = createPath(memoryValues);
  
  return (
    <div className="relative">
      <svg width={width} height={height} className="border rounded bg-gray-50">
        {/* 격자 */}
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* 임계값 선 */}
        <line
          x1="0"
          y1={getYPosition(thresholds.cpu.scaleOut)}
          x2={width}
          y2={getYPosition(thresholds.cpu.scaleOut)}
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <line
          x1="0"
          y1={getYPosition(thresholds.cpu.scaleIn)}
          x2={width}
          y2={getYPosition(thresholds.cpu.scaleIn)}
          stroke="#22c55e"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* CPU 라인 */}
        <path
          d={cpuPath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          className="drop-shadow-sm"
        />
        
        {/* 메모리 라인 */}
        <path
          d={memoryPath}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          className="drop-shadow-sm"
        />
        
        {/* 데이터 포인트 */}
        {displayMetrics.map((metric, index) => (
          <g key={index}>
            <circle
              cx={getXPosition(index)}
              cy={getYPosition(metric.cpu)}
              r="4"
              fill="#3b82f6"
              className="drop-shadow-sm"
            />
            <circle
              cx={getXPosition(index)}
              cy={getYPosition(metric.memory)}
              r="4"
              fill="#8b5cf6"
              className="drop-shadow-sm"
            />
          </g>
        ))}
        
        {/* Y축 라벨 */}
        <text x="10" y="15" className="text-xs fill-gray-600">100%</text>
        <text x="10" y={height - 5} className="text-xs fill-gray-600">0%</text>
        
        {/* 임계값 라벨 */}
        <text
          x={width - 80}
          y={getYPosition(thresholds.cpu.scaleOut) - 5}
          className="text-xs fill-red-600 font-medium"
        >
          스케일 아웃: {thresholds.cpu.scaleOut}%
        </text>
        <text
          x={width - 80}
          y={getYPosition(thresholds.cpu.scaleIn) + 15}
          className="text-xs fill-green-600 font-medium"
        >
          스케일 인: {thresholds.cpu.scaleIn}%
        </text>
      </svg>
      
      {/* 범례 */}
      <div className="flex items-center gap-4 mt-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-500"></div>
          <span>CPU 사용률</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-purple-500"></div>
          <span>메모리 사용률</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-500 border-dashed border-t-2"></div>
          <span>스케일 아웃 임계값</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-500 border-dashed border-t-2"></div>
          <span>스케일 인 임계값</span>
        </div>
      </div>
    </div>
  );
}; 