import React from 'react';
import { Providers } from './providers';
import { HomePage } from '@/pages/home';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ContainerListPage } from '@/pages/containers';
import { ContainerDetailsPage } from '@/pages/containers/container-details';
import { ScalingPolicyPage } from '@/pages/scaling';
import { ImagesPage } from '@/pages/images';

export const App = () => {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/containers" element={<ContainerListPage />} />
          <Route path="/containers/:containerId" element={<ContainerDetailsPage />} />
          <Route path="/scaling" element={<ScalingPolicyPage />} />
          <Route path="/images" element={<ImagesPage />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}; 