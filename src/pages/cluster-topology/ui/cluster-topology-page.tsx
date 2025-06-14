import { Layout } from '@/widgets/layout';
import React from 'react';

export const ClusterTopologyPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">클러스터 토폴로지</h1>
            <p className="text-gray-600 mt-2">
              클러스터의 노드 구성과 네트워크 토폴로지를 확인합니다.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">클러스터 토폴로지</h3>
              <p className="mt-1 text-sm text-gray-500">
                클러스터 토폴로지 기능은 현재 개발 중입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}; 