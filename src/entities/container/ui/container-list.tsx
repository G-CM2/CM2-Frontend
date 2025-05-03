import React, { useEffect, useState } from 'react';
import { apiService, Container, ContainersResponse } from '@/shared/api';
import { Card } from '@/shared/ui/card/card';

export const ContainerList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [containers, setContainers] = useState<Container[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20
  });

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getContainers(pagination.page, pagination.limit);
        setContainers(response.data.containers);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit
        });
        setError(null);
      } catch (err) {
        setError('컨테이너 목록을 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching containers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContainers();
  }, [pagination.page, pagination.limit]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">컨테이너 목록</h2>
      
      {containers.length === 0 ? (
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
                  <button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={() => {/* 컨테이너 상세 페이지로 이동하는 로직 */}}
                  >
                    상세 정보
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 페이지네이션 컴포넌트 */}
      {containers.length > 0 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button 
              className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
              disabled={pagination.page === 1}
            >
              이전
            </button>
            <span className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-700">
              {pagination.page} / {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button 
              className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
              onClick={() => setPagination(prev => ({ 
                ...prev, 
                page: prev.page + 1 <= Math.ceil(prev.total / prev.limit) ? prev.page + 1 : prev.page 
              }))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            >
              다음
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}; 