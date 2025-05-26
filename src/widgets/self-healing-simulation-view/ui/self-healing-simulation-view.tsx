import React, { useState, useEffect } from 'react';
import { 
  SelfHealingSimulation, 
  HealingScenario,
  fetchHealingSimulation,
  HealingTimeline,
  ContainerHealthStatus
} from '@/entities/self-healing';
import { HealingControls } from '@/features/self-healing-simulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity, Clock } from 'lucide-react';

export const SelfHealingSimulationView: React.FC = () => {
  const [simulation, setSimulation] = useState<SelfHealingSimulation | null>(null);
  const [scenarios, setScenarios] = useState<HealingScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);

  // 시뮬레이션 데이터 로드
  const loadSimulation = async () => {
    setLoading(true);
    try {
      const data = await fetchHealingSimulation();
      setSimulation(data.simulation);
      setScenarios(data.scenarios);
      if (data.scenarios.length > 0 && !selectedScenario) {
        setSelectedScenario(data.scenarios[0].id);
      }
    } catch (error) {
      console.error('Failed to load self-healing simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSimulation();
  }, []);

  // 시뮬레이션 시작
  const handleStart = () => {
    if (!simulation || !selectedScenario) return;

    const selectedScenarioData = scenarios.find(s => s.id === selectedScenario);
    if (!selectedScenarioData) return;

    setSimulation(prev => prev ? { 
      ...prev, 
      isRunning: true, 
      currentStep: 0,
      recoveryTime: 0,
      downtime: 0
    } : null);

    const interval = setInterval(() => {
      setSimulation(prev => {
        if (!prev || !prev.isRunning) return prev;

        const nextStep = prev.currentStep + 1;
        const newRecoveryTime = prev.recoveryTime + 2; // 2초씩 증가
        let newDowntime = prev.downtime;

        // 첫 번째 단계에서 다운타임 시작
        if (prev.currentStep === 0) {
          newDowntime = 2;
        }
        // 마지막 단계 완료 시 다운타임 종료
        else if (nextStep < prev.steps.length) {
          newDowntime = prev.downtime + 2;
        }

        // 모든 단계 완료 시 시뮬레이션 종료
        if (nextStep >= prev.steps.length) {
          return {
            ...prev,
            currentStep: prev.steps.length,
            isRunning: false,
            recoveryTime: newRecoveryTime,
            downtime: newDowntime
          };
        }

        return {
          ...prev,
          currentStep: nextStep,
          recoveryTime: newRecoveryTime,
          downtime: newDowntime
        };
      });
    }, 2000); // 2초마다 다음 단계로 진행

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

  // 시나리오 변경
  const handleScenarioChange = (scenarioId: string) => {
    if (simulation?.isRunning) return;
    setSelectedScenario(scenarioId);
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
        <div className="text-gray-500">셀프 힐링 시뮬레이션을 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            셀프 힐링 시뮬레이션
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            컨테이너 장애 발생 시 자동 복구 과정을 시뮬레이션합니다.
            다양한 장애 시나리오에 따른 복구 단계와 다운타임을 확인할 수 있습니다.
          </p>
        </CardContent>
      </Card>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 제어 패널 */}
        <div className="lg:col-span-1">
          <HealingControls
            simulation={simulation}
            scenarios={scenarios}
            selectedScenario={selectedScenario}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onScenarioChange={handleScenarioChange}
          />
        </div>

        {/* 시각화 영역 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 복구 타임라인 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                복구 프로세스 타임라인
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HealingTimeline
                steps={simulation.steps}
                currentStep={simulation.currentStep}
              />
            </CardContent>
          </Card>

          {/* 컨테이너 헬스 상태 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                컨테이너 헬스 상태
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContainerHealthStatus
                containers={[
                  {
                    containerId: 'container-1',
                    status: simulation.currentStep === 0 ? 'failed' : 
                           simulation.currentStep < simulation.steps.length ? 'recovering' : 'healthy',
                    lastCheck: new Date().toISOString(),
                    failureCount: simulation.currentStep >= 3 ? 1 : 0,
                    uptime: 3600
                  },
                  {
                    containerId: 'container-2',
                    status: 'healthy',
                    lastCheck: new Date().toISOString(),
                    failureCount: 0,
                    uptime: 3600
                  },
                  {
                    containerId: 'container-3',
                    status: 'healthy',
                    lastCheck: new Date().toISOString(),
                    failureCount: 0,
                    uptime: 3600
                  }
                ]}
                failedContainer={simulation.currentStep === 0 ? 'container-1' : null}
                width={600}
                height={200}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 