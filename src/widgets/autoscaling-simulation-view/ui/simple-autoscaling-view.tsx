import React, { useEffect, useState } from 'react';
import { fetchAutoscalingSimulation, ScalingAnimation } from '@/entities/autoscaling';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Zap } from 'lucide-react';

export const SimpleAutoscalingView: React.FC = () => {
  const [replicas, setReplicas] = useState(1);
  const [phase, setPhase] = useState<'monitoring'|'scaling'>('monitoring');
  // 컨테이너별 CPU/메모리 사용량 배열 (timestamp 포함)
  const [metrics, setMetrics] = useState<{ cpu: number; memory: number; timestamp: string }[]>([{ cpu: 60, memory: 65, timestamp: new Date().toISOString() }]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAutoscalingSimulation();
      setReplicas(data.currentReplicas);
      // 초기 컨테이너별 사용량
      setMetrics(Array(data.currentReplicas).fill(0).map(() => ({ cpu: 60, memory: 65, timestamp: new Date().toISOString() })));
    };
    load();
  }, []);

  const handleScaleOut = () => {
    setPhase('scaling');
    setTimeout(() => {
      setReplicas(r => {
        const next = Math.min(r + 1, 10);
        // 새 컨테이너는 낮은 부하로 시작, 기존 컨테이너는 부하 감소
        setMetrics(prev => [
          ...prev.map(m => ({ cpu: Math.max(10, m.cpu - 10 + Math.random() * 5), memory: Math.max(10, m.memory - 8 + Math.random() * 5), timestamp: new Date().toISOString() })),
          { cpu: 30 + Math.random() * 10, memory: 30 + Math.random() * 10, timestamp: new Date().toISOString() }
        ].slice(0, next));
        return next;
      });
      setPhase('monitoring');
    }, 1000);
  };

  const handleScaleIn = () => {
    setPhase('scaling');
    setTimeout(() => {
      setReplicas(r => {
        const next = Math.max(r - 1, 1);
        // 컨테이너가 줄면 남은 컨테이너 부하 증가
        setMetrics(prev => prev.slice(0, next).map(m => ({ cpu: Math.min(100, m.cpu + 10 - Math.random() * 5), memory: Math.min(100, m.memory + 8 - Math.random() * 5), timestamp: new Date().toISOString() })));
        return next;
      });
      setPhase('monitoring');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> 오토스케일링
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">버튼을 클릭해 스케일 인/아웃 애니메이션과 각 컨테이너의 CPU/메모리 사용률을 확인하세요.</p>
        </CardContent>
      </Card>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleScaleOut}
          disabled={phase === 'scaling' || replicas >= 10}
        >
          스케일 아웃
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          onClick={handleScaleIn}
          disabled={phase === 'scaling' || replicas <= 1}
        >
          스케일 인
        </button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5" /> 스케일 인/아웃 애니메이션</CardTitle>
        </CardHeader>
        <CardContent>
          <ScalingAnimation simulation={{ currentReplicas: replicas, targetReplicas: replicas, phase, isRunning: false, metrics, thresholds: { cpu: { scaleOut: 70, scaleIn: 30 }, memory: { scaleOut: 80, scaleIn: 40 } }, events: [] }} width={400} height={160} />
        </CardContent>
      </Card>
    </div>
  );
}; 