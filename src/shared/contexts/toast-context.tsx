import React, { createContext, ReactNode, useContext } from 'react';
import { useToast, UseToastReturn } from '../hooks/use-toast';
import { ToastContainer } from '../ui/toast';

const ToastContext = createContext<UseToastReturn | undefined>(undefined);

export const useToastContext = (): UseToastReturn => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toastMethods = useToast();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer toasts={toastMethods.toasts} onClose={toastMethods.removeToast} />
    </ToastContext.Provider>
  );
}; 