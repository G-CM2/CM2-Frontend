import { useState } from 'react';
import { ContainerActionRequest, ContainerActionResponse, useContainerAction } from '@/shared/api';

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
  const containerAction = useContainerAction();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return isHovered
          ? 'bg-blue-600 hover:bg-blue-700'
          : 'bg-blue-500 hover:bg-blue-600';
      case 'secondary':
        return isHovered
          ? 'bg-gray-600 hover:bg-gray-700'
          : 'bg-gray-500 hover:bg-gray-600';
      case 'danger':
        return isHovered
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-red-500 hover:bg-red-600';
      default:
        return isHovered
          ? 'bg-blue-600 hover:bg-blue-700'
          : 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const handleClick = async () => {
    try {
      const actionData: ContainerActionRequest = { action };
      const result = await containerAction.mutateAsync({ 
        containerId, 
        action: actionData 
      });
      
      if (onActionComplete) {
        onActionComplete(result);
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  return (
    <button
      className={`w-full px-4 py-2 text-white rounded transition-colors ${getVariantClasses()} ${
        containerAction.isPending ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
      disabled={containerAction.isPending}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {containerAction.isPending ? '처리 중...' : label}
    </button>
  );
}; 