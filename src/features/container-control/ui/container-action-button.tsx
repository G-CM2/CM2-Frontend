
interface ContainerActionButtonProps {
  containerId: string;
  action: 'start' | 'stop' | 'restart' | 'pause' | 'unpause';
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onActionComplete?: () => void;
}

export const ContainerActionButton = ({
  action,
  label,
  variant = 'primary',
}: ContainerActionButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gray-400 cursor-not-allowed';
      case 'secondary':
        return 'bg-gray-400 cursor-not-allowed';
      case 'danger':
        return 'bg-gray-400 cursor-not-allowed';
      default:
        return 'bg-gray-400 cursor-not-allowed';
    }
  };

  const handleClick = async () => {
    // 컨테이너 액션 API가 명세서에 없어서 비활성화됨
    console.log(`컨테이너 ${action} 액션은 현재 지원되지 않습니다.`);
  };

  return (
    <button
      className={`w-full px-4 py-2 text-white rounded transition-colors ${getVariantClasses()}`}
      onClick={handleClick}
      disabled={true}
      title="현재 지원되지 않는 기능입니다"
    >
      {label} (비활성화)
    </button>
  );
}; 