import { ClusterPage } from '@/pages/cluster';
import { ContainerListPage } from '@/pages/containers';
import { ContainerDetailsPage } from '@/pages/containers/container-details';
import { DashboardPage } from '@/pages/dashboard';
import { ServiceDetailsPage, ServicesPage } from '@/pages/services';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:serviceId" element={<ServiceDetailsPage />} />
            <Route path="/cluster" element={<ClusterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </Providers>
    </div>
  );
}; 