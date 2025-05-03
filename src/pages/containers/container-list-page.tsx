import { useState } from 'react';
import { Layout } from '@/widgets/layout';
import { Card } from '@/shared/ui/card/card';
import { useQuery } from '@tanstack/react-query';
import { systemApi } from '@/shared/api/system';
import { Link } from 'react-router-dom';
import { useContainers } from '@/shared/api';

export const ContainerListPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // 대시보드 요약 정보 조회
  const { 
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError 
  } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => systemApi.getDashboardSummary(),
    refetchInterval: 10000, // 10초마다 갱신
  });

  // 컨테이너 목록 조회
  const {
    data: containersData,
    isLoading: containersLoading,
    isError: containersError
  } = useContainers(page, limit);

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

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-50 border-green-200';
      case 'stopped':
        return 'bg-red-50 border-red-200';
      case 'paused':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">컨테이너 관리</h1>
        
        {/* 컨테이너 상태 요약 */}
        <Card title="컨테이너 상태">
          {dashboardLoading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : dashboardError ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-red-500">데이터를 불러오는 데 실패했습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 h-40">
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4 border border-gray-200">
                <span className="text-3xl font-bold">{dashboardData?.containers.total}</span>
                <span className="text-gray-500 mt-2">총 컨테이너</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg p-4 border border-green-200">
                <span className="text-3xl font-bold text-green-600">{dashboardData?.containers.running}</span>
                <span className="text-gray-500 mt-2">실행 중</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-red-50 rounded-lg p-4 border border-red-200">
                <span className="text-3xl font-bold text-red-600">{dashboardData?.containers.stopped}</span>
                <span className="text-gray-500 mt-2">중지됨</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <span className="text-3xl font-bold text-yellow-600">{dashboardData?.containers.paused}</span>
                <span className="text-gray-500 mt-2">일시 중지됨</span>
              </div>
            </div>
          )}
        </Card>
        
        {/* 컨테이너 목록 */}
        <Card title="컨테이너 목록">
          {containersLoading ? (
            <div className="h-64 flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : containersError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">컨테이너 목록을 불러오는 중 오류가 발생했습니다.</span>
            </div>
          ) : !containersData || containersData.containers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">컨테이너가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이름
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이미지
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CPU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        메모리
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {containersData.containers.map((container) => (
                      <tr key={container.id} className={`${getBackgroundColor(container.status)}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{container.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{container.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{container.image}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(container.status)} bg-opacity-10 border border-current`}>
                            {container.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {container.cpu_usage.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {container.memory_usage.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/containers/${container.id}`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            상세보기
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 페이지네이션 */}
              {containersData.total > 0 && (
                <div className="flex justify-center mt-6">
                  <nav className="inline-flex rounded-md shadow">
                    <button 
                      className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      이전
                    </button>
                    <span className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-700">
                      {page} / {Math.ceil(containersData.total / limit)}
                    </span>
                    <button 
                      className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                      onClick={() => setPage(prev => (
                        prev + 1 <= Math.ceil(containersData.total / limit) ? prev + 1 : prev
                      ))}
                      disabled={page >= Math.ceil(containersData.total / limit)}
                    >
                      다음
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
}; 