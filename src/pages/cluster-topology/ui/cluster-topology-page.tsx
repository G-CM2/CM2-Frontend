import React from 'react';
import { Layout } from '@/widgets/layout';
import { SimpleAutoscalingView } from '@/widgets/autoscaling-simulation-view';

export const ClusterTopologyPage: React.FC = () => {
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
        <div className="mt-6">
          <SimpleAutoscalingView />
        </div>
      </div>
    </Layout>
  );
}; 