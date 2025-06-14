import { ClusterMonitoringPage } from '@/pages/cluster-monitoring';
import { ClusterTopologyPage } from '@/pages/cluster-topology';
import { ContainerListPage } from '@/pages/containers';
import { ContainerDetailsPage } from '@/pages/containers/container-details';
import { DashboardPage } from '@/pages/dashboard';
import { ServiceDeploymentPage } from '@/pages/service-deployment';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Providers } from './providers';

export const App = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <Providers>
        <BrowserRouter basename="/CM2-Frontend/">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/containers" element={<ContainerListPage />} />
            <Route path="/containers/:containerId" element={<ContainerDetailsPage />} />
            <Route path="/cluster-topology" element={<ClusterTopologyPage />} />
            <Route path="/service-deployment" element={<ServiceDeploymentPage />} />
            <Route path="/cluster-monitoring" element={<ClusterMonitoringPage />} />
          </Routes>
        </BrowserRouter>
      </Providers>
    </div>
  );
}; 