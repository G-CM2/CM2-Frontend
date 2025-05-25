import React from 'react';
import { Layout } from '@/widgets/layout';
import { ServiceDeploymentView } from '@/widgets/service-deployment-view';

export const ServiceDeploymentPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">서비스 배포 시각화</h1>
            <p className="text-gray-600 mt-2">
              컨테이너 배포 과정과 로드 밸런싱을 단계별로 시뮬레이션하여 확인하세요.
            </p>
          </div>
        </div>

        <ServiceDeploymentView />
      </div>
    </Layout>
  );
}; 