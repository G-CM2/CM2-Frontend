import React, { useEffect, useState } from 'react';
import { fetchHealingSimulation, HealingTimeline } from '@/entities/self-healing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, BarChart } from 'lucide-react';
import type { HealingStep } from '@/entities/self-healing';

export const SimpleSelfHealingView: React.FC = () => {
  const [steps, setSteps] = useState<HealingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [downtime, setDowntime] = useState(0);
  const [history, setHistory] = useState<number[]>([]); // 다운타임 비교용

  useEffect(() => {
    const load = async () => {
      const data = await fetchHealingSimulation();
      setSteps(data.simulation.steps);
      setCurrentStep(0);
      setDowntime(0);
      setHistory([data.simulation.steps.length * 2, 0]); // 예시: 장애 미복구 다운타임, 셀프힐링 다운타임
    };
    load();
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length) {
          setDowntime(d => d + 2);
          return prev + 1;
        }
        return prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" /> 셀프 힐링 시나리오
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">컨테이너 장애 발생 시 자동 복구 과정을 단계별로 시각화하고, 다운타임 최소화 효과를 비교합니다.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> 복구 타임라인</CardTitle>
        </CardHeader>
        <CardContent>
          <HealingTimeline steps={steps} currentStep={currentStep} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5" /> 다운타임 비교</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 다운타임 비교: 셀프힐링 vs 미복구 */}
          <div className="flex gap-8 items-end h-24">
            <div className="flex flex-col items-center">
              <div className="bg-gray-300 w-8" style={{ height: `${history[0] * 4}px` }} />
              <span className="text-xs mt-1">미복구</span>
              <span className="text-xs text-gray-500">{history[0]}초</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 w-8" style={{ height: `${downtime * 4}px` }} />
              <span className="text-xs mt-1">셀프힐링</span>
              <span className="text-xs text-gray-500">{downtime}초</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 