import { Card } from '@/shared/ui/card/card';
import { Link } from 'react-router-dom';
import { Container } from '../types';

interface ContainerCardProps {
  container: Container;
}

export const ContainerCard = ({ container }: ContainerCardProps) => {
  const getStatusClass = (status: Container['status']) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'stopped':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card title={container.name} className="h-full">
      <div className="space-y-3">
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">이미지</span>
          <div className="text-sm font-medium">{container.image}</div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">상태</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(container.status)}`}>
            {container.status}
          </span>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">CPU 사용률</span>
          <div className="text-sm font-medium">{container.cpu_usage}%</div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">메모리 사용률</span>
          <div className="text-sm font-medium">{container.memory_usage} MB</div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">포트</span>
          <div className="text-sm font-medium">{container.ports.join(', ')}</div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Link 
            to={`/containers/${container.id}`}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center text-sm"
          >
            상세보기
          </Link>
          {container.status === 'running' ? (
            <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm">
              중지
            </button>
          ) : (
            <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm">
              시작
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}; 