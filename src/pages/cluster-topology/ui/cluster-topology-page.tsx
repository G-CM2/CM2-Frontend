import React from 'react';
import { Layout } from '@/widgets/layout';
import { ClusterTopologyView } from '@/widgets/cluster-topology-view';

export const ClusterTopologyPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">클러스터 토폴로지</h1>
            <p className="text-gray-600 mt-2">
              Docker Swarm 클러스터의 노드 구성과 연결 상태를 시각적으로 확인하세요.
            </p>
          </div>
        </div>

        <ClusterTopologyView />
      </div>
    </Layout>
  );
}; 