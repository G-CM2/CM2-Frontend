import React, { useState } from 'react';
import { Layout } from '@/widgets/layout';
import { ClusterTopologyView } from '@/widgets/cluster-topology-view';
import { AutoscalingSimulationView } from '@/widgets/autoscaling-simulation-view';
import { SelfHealingSimulationView } from '@/widgets/self-healing-simulation-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, TrendingUp, Shield } from 'lucide-react';

export const ClusterTopologyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('topology');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">클러스터 관리</h1>
            <p className="text-gray-600 mt-2">
              Docker Swarm 클러스터의 토폴로지, 오토스케일링, 셀프 힐링 기능을 관리하세요.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="topology" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              클러스터 토폴로지
            </TabsTrigger>
            <TabsTrigger value="autoscaling" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              오토스케일링 시뮬레이션
            </TabsTrigger>
            <TabsTrigger value="self-healing" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              셀프 힐링 시뮬레이션
            </TabsTrigger>
          </TabsList>

          <TabsContent value="topology" className="mt-6">
            <ClusterTopologyView />
          </TabsContent>

          <TabsContent value="autoscaling" className="mt-6">
            <AutoscalingSimulationView />
          </TabsContent>

          <TabsContent value="self-healing" className="mt-6">
            <SelfHealingSimulationView />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}; 