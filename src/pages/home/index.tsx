import React from 'react';
import { Layout } from '@/widgets/layout';
import { StatsOverview } from '@/widgets/stats-overview';
import { ContainerGrid } from '@/widgets/container-grid';
import { mockContainers } from '@/entities/container';

export const HomePage = () => {
  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">시스템 현황</h2>
      <StatsOverview />
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">컨테이너</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="컨테이너 검색..."
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800"
          />
          <button className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700">
            새 컨테이너
          </button>
        </div>
      </div>
      
      <ContainerGrid containers={mockContainers} />
    </Layout>
  );
}; 