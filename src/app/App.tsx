import React from 'react';
import { Providers } from './providers';
import { HomePage } from '@/pages/home';

export const App = () => {
  return (
    <Providers>
      <HomePage />
    </Providers>
  );
}; 