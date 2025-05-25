import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { DeploymentSimulation } from '@/entities/service-deployment';

interface DeploymentControlsProps {
  simulation: DeploymentSimulation;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepChange: (step: number) => void;
}

export const DeploymentControls: React.FC<DeploymentControlsProps> = ({
  simulation,
  onStart,
  onPause,
  onReset,
  onStepChange
}) => {
  const { service, steps, currentStep, isRunning } = simulation;

  const getStepStatusColor = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* 서비스 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            서비스 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">서비스명</p>
              <p className="font-medium">{service.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">이미지</p>
              <p className="font-medium">{service.image}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">레플리카 수</p>
              <p className="font-medium">{service.replicas}개</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">상태</p>
              <Badge variant={service.status === 'running' ? 'default' : 'secondary'}>
                {service.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 시뮬레이션 제어 */}
      <Card>
        <CardHeader>
          <CardTitle>시뮬레이션 제어</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              onClick={isRunning ? onPause : onStart}
              variant={isRunning ? "outline" : "default"}
              size="sm"
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  일시정지
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  시작
                </>
              )}
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </Button>
          </div>

          {/* 진행 단계 */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">배포 단계</p>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  index === currentStep
                    ? 'border-blue-300 bg-blue-50'
                    : index < currentStep
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                onClick={() => onStepChange(index)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      {step.step}. {step.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>
                  <Badge className={getStepStatusColor(step.status)}>
                    {step.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 범례 */}
      <Card>
        <CardHeader>
          <CardTitle>상태 범례</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded border border-gray-400"></div>
              <span>대기중</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded border border-blue-400"></div>
              <span>이미지 풀링</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-200 rounded border border-yellow-400"></div>
              <span>시작중</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded border border-green-400"></div>
              <span>실행중</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 