import React from 'react';
import { Providers } from './providers';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ContainerListPage } from '@/pages/containers';
import { ContainerDetailsPage } from '@/pages/containers/container-details';
import { ScalingPolicyPage } from '@/pages/scaling';
import { DashboardPage } from '@/pages/dashboard';
import { ClusterTopologyPage } from '@/pages/cluster-topology';
import { ServiceDeploymentPage } from '@/pages/service-deployment';

export const App = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/containers" element={<ContainerListPage />} />
            <Route path="/containers/:containerId" element={<ContainerDetailsPage />} />
            <Route path="/scaling" element={<ScalingPolicyPage />} />
            <Route path="/cluster-topology" element={<ClusterTopologyPage />} />
            <Route path="/service-deployment" element={<ServiceDeploymentPage />} />
          </Routes>
        </BrowserRouter>
      </Providers>
    </div>
  );
}; 