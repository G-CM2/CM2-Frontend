import React, { useState, useEffect } from 'react';
import { 
  DeploymentSimulation, 
  fetchDeploymentSimulation, 
  ReplicaContainer, 
  TrafficFlow
} from '@/entities/service-deployment';
import { DeploymentControls } from '@/features/deployment-simulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Server, Network } from 'lucide-react';

export const ServiceDeploymentView: React.FC = () => {
  const [simulation, setSimulation] = useState<DeploymentSimulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 시뮬레이션 데이터 로드
  useEffect(() => {
    const loadSimulation = async () => {
      try {
        setLoading(true);
        const data = await fetchDeploymentSimulation();
        setSimulation(data);
      } catch (err) {
        setError('시뮬레이션 데이터를 불러오는 중 오류가 발생했습니다.');
        console.error('Failed to load simulation:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSimulation();
  }, []);

  // 시뮬레이션 시작
  const handleStart = () => {
    if (!simulation) return;
    
    setSimulation(prev => prev ? { ...prev, isRunning: true } : null);
    runSimulation();
  };

  // 시뮬레이션 일시정지
  const handlePause = () => {
    setSimulation(prev => prev ? { ...prev, isRunning: false } : null);
  };

  // 시뮬레이션 초기화
  const handleReset = () => {
    if (!simulation) return;

    const resetReplicas = simulation.replicas.map(replica => ({
      ...replica,
      status: 'pending' as const
    }));

    const resetSteps = simulation.steps.map(step => ({
      ...step,
      status: 'pending' as const
    }));

    const resetTraffic = simulation.traffic.map(traffic => ({
      ...traffic,
      active: false
    }));

    setSimulation({
      ...simulation,
      currentStep: 0,
      isRunning: false,
      replicas: resetReplicas,
      steps: resetSteps,
      traffic: resetTraffic,
      service: { ...simulation.service, status: 'pending' }
    });
  };

  // 특정 단계로 이동
  const handleStepChange = (step: number) => {
    if (!simulation) return;
    
    setSimulation(prev => prev ? { ...prev, currentStep: step } : null);
  };

  // 시뮬레이션 실행
  const runSimulation = async () => {
    if (!simulation) return;

    const steps = simulation.steps;
    
    for (let i = 0; i < steps.length; i++) {
      // 시뮬레이션이 중단되었는지 확인
      if (!simulation.isRunning) break;

      // 현재 단계 업데이트
      setSimulation(prev => {
        if (!prev) return null;
        const updatedSteps = [...prev.steps];
        updatedSteps[i] = { ...updatedSteps[i], status: 'in-progress' };
        return { ...prev, currentStep: i, steps: updatedSteps };
      });

      // 단계별 애니메이션 실행
      await executeStep(i);

      // 단계 완료
      setSimulation(prev => {
        if (!prev) return null;
        const updatedSteps = [...prev.steps];
        updatedSteps[i] = { ...updatedSteps[i], status: 'completed' };
        return { ...prev, steps: updatedSteps };
      });

      // 다음 단계까지 대기
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 시뮬레이션 완료
    setSimulation(prev => prev ? { 
      ...prev, 
      isRunning: false,
      service: { ...prev.service, status: 'running' }
    } : null);
  };

  // 개별 단계 실행
  const executeStep = async (stepIndex: number) => {
    if (!simulation) return;

    const step = simulation.steps[stepIndex];
    
    switch (stepIndex) {
      case 0: // 이미지 풀링
        await animateImagePulling();
        break;
      case 1: // 컨테이너 생성
        await animateContainerCreation();
        break;
      case 2: // 서비스 시작
        await animateServiceStart();
        break;
      case 3: // 로드 밸런서 설정
        await animateLoadBalancer();
        break;
    }

    await new Promise(resolve => setTimeout(resolve, step.duration));
  };

  const animateImagePulling = async () => {
    setSimulation(prev => {
      if (!prev) return null;
      const updatedReplicas = prev.replicas.map(replica => ({
        ...replica,
        status: 'pulling' as const
      }));
      return { ...prev, replicas: updatedReplicas };
    });
  };

  const animateContainerCreation = async () => {
    setSimulation(prev => {
      if (!prev) return null;
      const updatedReplicas = prev.replicas.map(replica => ({
        ...replica,
        status: 'starting' as const
      }));
      return { ...prev, replicas: updatedReplicas };
    });
  };

  const animateServiceStart = async () => {
    setSimulation(prev => {
      if (!prev) return null;
      const updatedReplicas = prev.replicas.map(replica => ({
        ...replica,
        status: 'running' as const
      }));
      return { ...prev, replicas: updatedReplicas };
    });
  };

  const animateLoadBalancer = async () => {
    setSimulation(prev => {
      if (!prev) return null;
      const updatedTraffic = prev.traffic.map(traffic => ({
        ...traffic,
        active: true
      }));
      return { ...prev, traffic: updatedTraffic };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>시뮬레이션 데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error || !simulation) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error || '시뮬레이션을 불러올 수 없습니다.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 시뮬레이션 제어 패널 */}
      <div className="lg:col-span-1">
        <DeploymentControls
          simulation={simulation}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onStepChange={handleStepChange}
        />
      </div>

      {/* 시각화 영역 */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              서비스 배포 시각화
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <svg
                width="100%"
                height="400"
                viewBox="0 0 700 400"
                className="border rounded-lg bg-gray-50"
              >
                {/* 노드 배경 */}
                <g>
                  {/* 매니저 노드 */}
                  <rect
                    x="100"
                    y="150"
                    width="120"
                    height="100"
                    rx="8"
                    fill="#E5E7EB"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                  />
                  <text x="160" y="140" textAnchor="middle" className="text-sm font-medium fill-gray-700">
                    Manager Node
                  </text>

                  {/* 워커 노드 1 */}
                  <rect
                    x="300"
                    y="250"
                    width="120"
                    height="100"
                    rx="8"
                    fill="#E5E7EB"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                  />
                  <text x="360" y="240" textAnchor="middle" className="text-sm font-medium fill-gray-700">
                    Worker Node 1
                  </text>

                  {/* 워커 노드 2 */}
                  <rect
                    x="500"
                    y="150"
                    width="120"
                    height="100"
                    rx="8"
                    fill="#E5E7EB"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                  />
                  <text x="560" y="140" textAnchor="middle" className="text-sm font-medium fill-gray-700">
                    Worker Node 2
                  </text>
                </g>

                {/* 로드 밸런서 */}
                <g>
                  <rect
                    x="25"
                    y="75"
                    width="50"
                    height="50"
                    rx="4"
                    fill="#3B82F6"
                    stroke="#1D4ED8"
                    strokeWidth="2"
                  />
                  <text x="50" y="105" textAnchor="middle" className="text-xs fill-white font-medium">
                    LB
                  </text>
                  <text x="50" y="65" textAnchor="middle" className="text-xs fill-gray-700">
                    Load Balancer
                  </text>
                </g>

                {/* 트래픽 흐름 */}
                {simulation.traffic.map(traffic => (
                  <TrafficFlow
                    key={traffic.id}
                    traffic={traffic}
                    isActive={simulation.currentStep >= 3}
                  />
                ))}

                {/* 컨테이너 레플리카 */}
                {simulation.replicas.map(replica => (
                  <ReplicaContainer
                    key={replica.id}
                    replica={replica}
                    isAnimating={simulation.isRunning}
                  />
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* 통계 정보 */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">총 레플리카</p>
                  <p className="text-xl font-bold">{simulation.replicas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">활성 연결</p>
                  <p className="text-xl font-bold">
                    {simulation.traffic.filter(t => t.active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">실행중</p>
                  <p className="text-xl font-bold">
                    {simulation.replicas.filter(r => r.status === 'running').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 