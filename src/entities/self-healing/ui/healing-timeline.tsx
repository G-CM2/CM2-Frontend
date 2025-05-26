import React from 'react';
import { HealingStep } from '../types';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface HealingTimelineProps {
  steps: HealingStep[];
  currentStep: number;
}

export const HealingTimeline: React.FC<HealingTimelineProps> = ({
  steps,
  currentStep
}) => {
  const getStepIcon = (step: HealingStep, index: number) => {
    const isActive = index === currentStep;
    const isCompleted = index < currentStep;
    const isFailed = step.status === 'failed';
    
    if (isFailed) {
      return <XCircle className="w-6 h-6 text-red-500" />;
    } else if (isCompleted) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else if (isActive) {
      return <Clock className="w-6 h-6 text-blue-500 animate-spin" />;
    } else {
      return <AlertCircle className="w-6 h-6 text-gray-400" />;
    }
  };
  
  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };
  
  const getConnectorColor = (index: number) => {
    if (index < currentStep) return 'bg-green-500';
    if (index === currentStep) return 'bg-blue-500';
    return 'bg-gray-300';
  };
  
  return (
    <div className="relative">
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} className="relative flex items-start">
            {/* 타임라인 연결선 */}
            {!isLast && (
              <div className="absolute left-3 top-8 w-0.5 h-16 bg-gray-300">
                <div 
                  className={`w-full transition-all duration-1000 ${getConnectorColor(index)}`}
                  style={{
                    height: status === 'completed' ? '100%' : 
                           status === 'active' ? '50%' : '0%'
                  }}
                />
              </div>
            )}
            
            {/* 스텝 아이콘 */}
            <div className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-500 ${
              status === 'completed' ? 'border-green-500 bg-green-50' :
              status === 'active' ? 'border-blue-500 bg-blue-50' :
              'border-gray-300 bg-gray-50'
            }`}>
              {getStepIcon(step, index)}
            </div>
            
            {/* 스텝 내용 */}
            <div className="ml-4 pb-8 flex-1">
              <div className={`font-medium transition-colors duration-300 ${
                status === 'completed' ? 'text-green-700' :
                status === 'active' ? 'text-blue-700' :
                'text-gray-500'
              }`}>
                {step.title}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {step.description}
              </div>
              
              {/* 진행 시간 표시 */}
              {status === 'active' && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    진행 중... ({step.duration / 1000}초 예상)
                  </div>
                  <div className="mt-1 w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse" />
                  </div>
                </div>
              )}
              
              {/* 완료 시간 표시 */}
              {status === 'completed' && step.endTime && (
                <div className="mt-2 text-xs text-green-600">
                  완료: {new Date(step.endTime).toLocaleTimeString()}
                </div>
              )}
              
              {/* 실패 메시지 */}
              {step.status === 'failed' && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                  실패: 복구 과정에서 오류가 발생했습니다
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {/* 전체 진행률 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">전체 진행률</span>
          <span className="text-sm text-gray-600">
            {currentStep} / {steps.length} 단계
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-1000 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}; 