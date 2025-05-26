import React, { useState, useEffect } from 'react';
import { 
  AutoscalingSimulation, 
  fetchAutoscalingSimulation,
  generateHighLoadMetrics,
  generateNormalLoadMetrics,
  MetricsChart,
  ScalingAnimation
} from '@/entities/autoscaling';
import { AutoscalingControls } from '@/features/autoscaling-simulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, Zap } from 'lucide-react';

export const AutoscalingSimulationView: React.FC = () => {
  const [simulation, setSimulation] = useState<AutoscalingSimulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);

  // 시뮬레이션 데이터 로드
  const loadSimulation = async () => {
    setLoading(true);
    try {
      const data = await fetchAutoscalingSimulation();
      setSimulation(data);
    } catch (error) {
      console.error('Failed to load autoscaling simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSimulation();
  }, []);

  // 시뮬레이션 시작
  const handleStart = () => {
    if (!simulation) return;

    setSimulation(prev => prev ? { ...prev, isRunning: true, phase: 'monitoring' } : null);

    const interval = setInterval(() => {
      setSimulation(prev => {
        if (!prev || !prev.isRunning) return prev;

        // 새로운 메트릭 생성
        const newMetrics = Math.random() > 0.7 ? generateHighLoadMetrics() : generateNormalLoadMetrics();
        const updatedMetrics = [...prev.metrics.slice(-19), newMetrics];

        // 스케일링 로직
        let newReplicas = prev.currentReplicas;
        let newPhase = prev.phase;
        const newEvents = [...prev.events];

        if (prev.phase === 'monitoring') {
          // 스케일 아웃 조건 확인
          if (newMetrics.cpu > prev.thresholds.cpu.scaleOut || newMetrics.memory > prev.thresholds.memory.scaleOut) {
            newReplicas = Math.min(prev.currentReplicas + 1, 10);
            newPhase = 'scaling';
            
            newEvents.push({
              id: `event-${Date.now()}`,
              type: 'scale-out',
              trigger: newMetrics.cpu > prev.thresholds.cpu.scaleOut ? 'cpu' : 'memory',
              timestamp: new Date().toISOString(),
              beforeReplicas: prev.currentReplicas,
              afterReplicas: newReplicas,
              reason: `${newMetrics.cpu > prev.thresholds.cpu.scaleOut ? 'CPU' : '메모리'} 사용률이 임계값을 초과했습니다`
            });
          }
          // 스케일 인 조건 확인
          else if (newMetrics.cpu < prev.thresholds.cpu.scaleIn && newMetrics.memory < prev.thresholds.memory.scaleIn && prev.currentReplicas > 1) {
            newReplicas = Math.max(prev.currentReplicas - 1, 1);
            newPhase = 'scaling';
            
            newEvents.push({
              id: `event-${Date.now()}`,
              type: 'scale-in',
              trigger: 'cpu',
              timestamp: new Date().toISOString(),
              beforeReplicas: prev.currentReplicas,
              afterReplicas: newReplicas,
              reason: 'CPU와 메모리 사용률이 모두 낮아 스케일 인을 수행합니다'
            });
          }
        } else if (prev.phase === 'scaling') {
          // 스케일링 완료 후 안정화
          newPhase = 'stabilizing';
        } else if (prev.phase === 'stabilizing') {
          // 안정화 완료 후 모니터링으로 복귀
          newPhase = 'monitoring';
        }

        return {
          ...prev,
          metrics: updatedMetrics,
          currentReplicas: newReplicas,
          targetReplicas: newReplicas,
          phase: newPhase,
          events: newEvents.slice(-10) // 최근 10개 이벤트만 유지
        };
      });
    }, 2000); // 2초마다 업데이트

    setSimulationInterval(interval);
  };

  // 시뮬레이션 일시정지
  const handlePause = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setSimulation(prev => prev ? { ...prev, isRunning: false } : null);
  };

  // 시뮬레이션 초기화
  const handleReset = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    loadSimulation();
  };

  // 수동 스케일 아웃
  const handleTriggerScaleOut = () => {
    if (!simulation || simulation.isRunning) return;

    setSimulation(prev => {
      if (!prev) return null;

      const newReplicas = Math.min(prev.currentReplicas + 1, 10);
      const newEvents = [...prev.events, {
        id: `event-${Date.now()}`,
        type: 'scale-out' as const,
        trigger: 'cpu' as const,
        timestamp: new Date().toISOString(),
        beforeReplicas: prev.currentReplicas,
        afterReplicas: newReplicas,
        reason: '수동으로 스케일 아웃을 트리거했습니다'
      }];

      return {
        ...prev,
        currentReplicas: newReplicas,
        targetReplicas: newReplicas,
        events: newEvents.slice(-10)
      };
    });
  };

  // 수동 스케일 인
  const handleTriggerScaleIn = () => {
    if (!simulation || simulation.isRunning || simulation.currentReplicas <= 1) return;

    setSimulation(prev => {
      if (!prev) return null;

      const newReplicas = Math.max(prev.currentReplicas - 1, 1);
      const newEvents = [...prev.events, {
        id: `event-${Date.now()}`,
        type: 'scale-in' as const,
        trigger: 'cpu' as const,
        timestamp: new Date().toISOString(),
        beforeReplicas: prev.currentReplicas,
        afterReplicas: newReplicas,
        reason: '수동으로 스케일 인을 트리거했습니다'
      }];

      return {
        ...prev,
        currentReplicas: newReplicas,
        targetReplicas: newReplicas,
        events: newEvents.slice(-10)
      };
    });
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  if (loading || !simulation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">오토스케일링 시뮬레이션을 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            오토스케일링 시뮬레이션
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            실시간 메트릭 기반 오토스케일링 동작을 시뮬레이션하고 시각화합니다.
            CPU와 메모리 사용률이 임계값을 초과하면 자동으로 스케일 아웃이 수행됩니다.
          </p>
        </CardContent>
      </Card>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 제어 패널 */}
        <div className="lg:col-span-1">
          <AutoscalingControls
            simulation={simulation}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onTriggerScaleOut={handleTriggerScaleOut}
            onTriggerScaleIn={handleTriggerScaleIn}
          />
        </div>

        {/* 시각화 영역 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 메트릭 차트 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                실시간 메트릭
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MetricsChart
                metrics={simulation.metrics}
                thresholds={simulation.thresholds}
                width={600}
                height={200}
              />
            </CardContent>
          </Card>

          {/* 스케일링 애니메이션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                컨테이너 스케일링
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScalingAnimation
                simulation={simulation}
                width={600}
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 