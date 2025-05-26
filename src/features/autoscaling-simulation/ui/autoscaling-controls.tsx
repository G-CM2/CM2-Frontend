import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AutoscalingSimulation } from '@/entities/autoscaling';
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';

interface AutoscalingControlsProps {
  simulation: AutoscalingSimulation;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onTriggerScaleOut: () => void;
  onTriggerScaleIn: () => void;
}

export const AutoscalingControls: React.FC<AutoscalingControlsProps> = ({
  simulation,
  onStart,
  onPause,
  onReset,
  onTriggerScaleOut,
  onTriggerScaleIn
}) => {
  const { isRunning, phase, currentReplicas, targetReplicas, thresholds } = simulation;
  
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'monitoring':
        return 'bg-blue-100 text-blue-800';
      case 'scaling':
        return 'bg-yellow-100 text-yellow-800';
      case 'stabilizing':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'monitoring':
        return '모니터링';
      case 'scaling':
        return '스케일링';
      case 'stabilizing':
        return '안정화';
      default:
        return '대기';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          오토스케일링 제어
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 현재 상태 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{currentReplicas}</div>
            <div className="text-sm text-gray-600">현재 레플리카</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{targetReplicas}</div>
            <div className="text-sm text-gray-600">목표 레플리카</div>
          </div>
        </div>
        
        {/* 현재 단계 */}
        <div className="flex items-center justify-center">
          <Badge className={getPhaseColor(phase)}>
            {getPhaseText(phase)}
          </Badge>
        </div>
        
        {/* 임계값 정보 */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">스케일링 임계값</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>CPU 스케일 아웃:</span>
              <span className="font-medium text-red-600">{thresholds.cpu.scaleOut}%</span>
            </div>
            <div className="flex justify-between">
              <span>CPU 스케일 인:</span>
              <span className="font-medium text-green-600">{thresholds.cpu.scaleIn}%</span>
            </div>
            <div className="flex justify-between">
              <span>메모리 스케일 아웃:</span>
              <span className="font-medium text-red-600">{thresholds.memory.scaleOut}%</span>
            </div>
            <div className="flex justify-between">
              <span>메모리 스케일 인:</span>
              <span className="font-medium text-green-600">{thresholds.memory.scaleIn}%</span>
            </div>
          </div>
        </div>
        
        {/* 제어 버튼 */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              onClick={isRunning ? onPause : onStart}
              variant={isRunning ? "secondary" : "default"}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  일시정지
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  시작
                </>
              )}
            </Button>
            <Button onClick={onReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              초기화
            </Button>
          </div>
          
          {/* 수동 트리거 버튼 */}
          <div className="flex gap-2">
            <Button
              onClick={onTriggerScaleOut}
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
              disabled={isRunning || phase === 'scaling'}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              스케일 아웃
            </Button>
            <Button
              onClick={onTriggerScaleIn}
              variant="outline"
              size="sm"
              className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
              disabled={isRunning || phase === 'scaling' || currentReplicas <= 1}
            >
              <TrendingDown className="w-4 h-4 mr-1" />
              스케일 인
            </Button>
          </div>
        </div>
        
        {/* 최근 이벤트 */}
        {simulation.events.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">최근 이벤트</div>
            <div className="space-y-1">
              {simulation.events.slice(-3).map((event) => (
                <div key={event.id} className="text-xs text-gray-600">
                  <span className="font-medium">
                    {event.type === 'scale-out' ? '스케일 아웃' : '스케일 인'}
                  </span>
                  : {event.beforeReplicas} → {event.afterReplicas} 레플리카
                  <div className="text-gray-500">
                    {event.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 