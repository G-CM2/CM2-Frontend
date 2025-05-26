import React, { useState } from 'react';
import { Layout } from '@/widgets/layout';
import { SimpleAutoscalingView } from '@/widgets/autoscaling-simulation-view';
import { SelfHealingSimulationView } from '@/widgets/self-healing-simulation-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Shield } from 'lucide-react';

export const ClusterTopologyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('autoscaling');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">클러스터 시뮬레이션</h1>
            <p className="text-gray-600 mt-2">
              오토스케일링 및 셀프 힐링 시나리오를 간단하게 시각화합니다.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="autoscaling" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              오토스케일링
            </TabsTrigger>
            <TabsTrigger value="self-healing" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              셀프 힐링
            </TabsTrigger>
          </TabsList>

          <TabsContent value="autoscaling" className="mt-6">
            <SimpleAutoscalingView />
          </TabsContent>

          <TabsContent value="self-healing" className="mt-6">
            <SelfHealingSimulationView />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}; 