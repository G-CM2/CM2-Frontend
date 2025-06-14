import { ToastProvider } from '@/shared/contexts';
import { ReactNode } from 'react';
import { QueryProvider } from './query-provider';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryProvider>
      <ToastProvider>
        {/* 여기에 전역 프로바이더를 추가하세요 (예: ThemeProvider, RouterProvider 등) */}
        {children}
      </ToastProvider>
    </QueryProvider>
  );
}; 