import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../types';
import { Card } from '@/shared/ui';

interface ContainerCardProps {
  container: Container;
}

export const ContainerCard = ({ container }: ContainerCardProps) => {
  const getStatusClass = (status: Container['status']) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'stopped':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card title={container.name} className="h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">이미지</div>
          <div className="text-sm font-medium">{container.image}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">상태</div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(container.status)}`}>
            {container.status}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">CPU</div>
          <div className="text-sm font-medium">{container.cpu}%</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">메모리</div>
          <div className="text-sm font-medium">{container.memory} MB</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">포트</div>
          <div className="text-sm font-medium">{container.ports.join(', ')}</div>
        </div>
        
        <div className="pt-2 flex justify-end space-x-2">
          <Link 
            to={`/containers/${container.id}`}
            className="px-3 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
          >
            상세 보기
          </Link>
          {container.status === 'running' ? (
            <button className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
              중지
            </button>
          ) : (
            <button className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
              시작
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}; 