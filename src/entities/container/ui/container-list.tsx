import { useContainers } from '@/shared/api/hooks/use-containers';
import { Card } from '@/shared/ui/card/card';
import { Link } from 'react-router-dom';

export const ContainerList = () => {
  const { data: containers, isLoading, error } = useContainers();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-500';
      case 'stopped':
        return 'text-red-500';
      case 'paused':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">컨테이너 목록을 불러오는 중 오류가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">컨테이너 목록</h2>
      
      {!containers || containers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">컨테이너가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {containers.map((container) => (
            <Card key={container.id} title={container.name} className="h-full">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">상태:</span>
                  <span className={getStatusColor(container.status)}>{container.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">이미지:</span>
                  <span className="text-gray-700 dark:text-gray-300">{container.image}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">CPU:</span>
                  <span className="text-gray-700 dark:text-gray-300">{container.cpu_usage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">메모리:</span>
                  <span className="text-gray-700 dark:text-gray-300">{container.memory_usage} MB</span>
                </div>
                <div className="mt-4">
                  <Link 
                    to={`/containers/${container.id}`}
                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center"
                  >
                    상세 정보
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 