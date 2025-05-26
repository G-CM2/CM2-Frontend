import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelfHealingSimulation, HealingScenario } from '@/entities/self-healing';
import { Play, Pause, RotateCcw, Shield, AlertTriangle } from 'lucide-react';

interface HealingControlsProps {
  simulation: SelfHealingSimulation;
  scenarios: HealingScenario[];
  selectedScenario: string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onScenarioChange: (scenarioId: string) => void;
}

export const HealingControls: React.FC<HealingControlsProps> = ({
  simulation,
  scenarios,
  selectedScenario,
  onStart,
  onPause,
  onReset,
  onScenarioChange
}) => {
  const { isRunning, currentStep, steps, recoveryTime, downtime } = simulation;
  
  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario);
  
  const getStatusColor = () => {
    if (isRunning) {
      return 'bg-blue-100 text-blue-800';
    } else if (currentStep === steps.length) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = () => {
    if (isRunning) {
      return '복구 진행중';
    } else if (currentStep === steps.length) {
      return '복구 완료';
    } else {
      return '대기';
    }
  };
  
  const formatTime = (seconds: number) => {
    return `${seconds.toFixed(1)}초`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          셀프 힐링 제어
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 시나리오 선택 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            장애 시나리오
          </label>
          <Select value={selectedScenario} onValueChange={onScenarioChange} disabled={isRunning}>
            <SelectTrigger>
              <SelectValue placeholder="시나리오를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {scenarios.map((scenario) => (
                <SelectItem key={scenario.id} value={scenario.id}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-xs text-gray-500">{scenario.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* 선택된 시나리오 정보 */}
        {selectedScenarioData && (
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-orange-800">{selectedScenarioData.name}</span>
            </div>
            <div className="text-sm text-orange-700 mb-2">
              {selectedScenarioData.description}
            </div>
            <div className="text-xs text-orange-600">
              예상 다운타임: {selectedScenarioData.expectedDowntime}초
            </div>
          </div>
        )}
        
        {/* 현재 상태 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{currentStep}</div>
            <div className="text-sm text-gray-600">진행 단계</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{steps.length}</div>
            <div className="text-sm text-gray-600">전체 단계</div>
          </div>
        </div>
        
        {/* 현재 상태 */}
        <div className="flex items-center justify-center">
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
        
        {/* 복구 통계 */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">복구 통계</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>복구 시간:</span>
              <span className="font-medium text-blue-600">{formatTime(recoveryTime)}</span>
            </div>
            <div className="flex justify-between">
              <span>다운타임:</span>
              <span className="font-medium text-red-600">{formatTime(downtime)}</span>
            </div>
          </div>
        </div>
        
        {/* 제어 버튼 */}
        <div className="flex gap-2">
          <Button
            onClick={isRunning ? onPause : onStart}
            variant={isRunning ? "secondary" : "default"}
            className="flex-1"
            disabled={!selectedScenario}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                일시정지
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                시뮬레이션 시작
              </>
            )}
          </Button>
          <Button onClick={onReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            초기화
          </Button>
        </div>
        
        {/* 진행률 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>진행률</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* 현재 단계 정보 */}
        {isRunning && currentStep < steps.length && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-800 mb-1">
              현재 진행중: {steps[currentStep]?.title}
            </div>
            <div className="text-sm text-blue-700">
              {steps[currentStep]?.description}
            </div>
          </div>
        )}
        
        {/* 완료 메시지 */}
        {currentStep === steps.length && !isRunning && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="font-medium text-green-800 mb-1">
              복구 완료!
            </div>
            <div className="text-sm text-green-700">
              모든 컨테이너가 정상 상태로 복구되었습니다.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 