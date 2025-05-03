import { useState } from 'react';
import { apiService, ContainerActionResponse } from '@/shared/api';

interface ContainerActionButtonProps {
  containerId: string;
  action: 'start' | 'stop' | 'restart' | 'pause' | 'unpause';
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onActionComplete?: (response: ContainerActionResponse) => void;
}

export const ContainerActionButton = ({
  containerId,
  action,
  label,
  variant = 'primary',
  onActionComplete,
}: ContainerActionButtonProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
    }
  };

  const handleAction = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.performContainerAction(
        containerId, 
        { action }
      );
      
      if (onActionComplete) {
        onActionComplete(response.data);
      }
    } catch (err: any) {
      setError(err.message || '컨테이너 제어 중 오류가 발생했습니다.');
      console.error(`Error performing ${action} on container:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAction}
        disabled={loading}
        className={`px-4 py-2 rounded ${getButtonStyle()} disabled:opacity-50 transition-colors flex items-center justify-center min-w-[100px]`}
      >
        {loading ? (
          <span className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
        ) : null}
        {label}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}; 