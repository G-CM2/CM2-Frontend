import React from 'react';
import { Layout } from '@/widgets/layout';
import { Card } from '@/shared/ui/card/card';
import { useQuery } from '@tanstack/react-query';
import { systemApi } from '@/shared/api/system';

export const DashboardPage = () => {
  const { 
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError 
  } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => systemApi.getDashboardSummary(),
    refetchInterval: 10000, // 10초마다 갱신
  });
  
  return (
    <Layout>
      <div className="flex flex-col w-full h-full space-y-6">
        <h1 className="text-2xl font-bold">대시보드</h1>
        
        {/* 컨테이너 상태 요약 */}
        <Card title="컨테이너 상태" className="w-full">
          {dashboardLoading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
            </div>
          ) : dashboardError ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-red-500">데이터를 불러오는 데 실패했습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 h-40">
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                <span className="text-3xl font-bold">{dashboardData?.containers.total}</span>
                <span className="text-gray-500 mt-2">총 컨테이너</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg p-4">
                <span className="text-3xl font-bold text-green-600">{dashboardData?.containers.running}</span>
                <span className="text-gray-500 mt-2">실행 중</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-red-50 rounded-lg p-4">
                <span className="text-3xl font-bold text-red-600">{dashboardData?.containers.stopped}</span>
                <span className="text-gray-500 mt-2">중지됨</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-yellow-50 rounded-lg p-4">
                <span className="text-3xl font-bold text-yellow-600">{dashboardData?.containers.paused}</span>
                <span className="text-gray-500 mt-2">일시 중지됨</span>
              </div>
            </div>
          )}
        </Card>
        
        {/* 리소스 사용량 */}
        <Card title="시스템 리소스 사용량" className="w-full">
          {dashboardLoading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
            </div>
          ) : dashboardError ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-red-500">데이터를 불러오는 데 실패했습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 h-40">
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">{dashboardData?.resources.cpu_usage.toFixed(1)}%</div>
                <p className="text-gray-500 mt-2">CPU 사용량</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">{dashboardData?.resources.memory_usage.toFixed(1)}%</div>
                <p className="text-gray-500 mt-2">메모리 사용량</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">{dashboardData?.resources.disk_usage.toFixed(1)}%</div>
                <p className="text-gray-500 mt-2">디스크 사용량</p>
              </div>
            </div>
          )}
        </Card>
        
        {/* 컨테이너 건강 상태 */}
        <Card title="컨테이너 건강 상태" className="w-full">
          {dashboardLoading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
            </div>
          ) : dashboardError ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-red-500">데이터를 불러오는 데 실패했습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <div className="flex items-center space-x-10">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-green-600">{dashboardData?.health.healthy}</span>
                  <span className="text-gray-500 mt-2">정상</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-red-600">{dashboardData?.health.unhealthy}</span>
                  <span className="text-gray-500 mt-2">비정상</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">{dashboardData?.health.total}</span>
                  <span className="text-gray-500 mt-2">총계</span>
                </div>
              </div>
            </div>
          )}
        </Card>
        
        {/* 최근 이벤트 */}
        <Card title="최근 이벤트" className="w-full">
          {dashboardLoading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
            </div>
          ) : dashboardError ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-red-500">데이터를 불러오는 데 실패했습니다.</p>
            </div>
          ) : dashboardData?.recent_events && dashboardData.recent_events.length > 0 ? (
            <div className="overflow-y-auto h-40">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시간</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">메시지</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recent_events.map((event, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          event.type.includes('start') ? 'bg-green-100 text-green-800' : 
                          event.type.includes('stop') ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {event.type}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{event.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500">최근 이벤트가 없습니다.</p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}; 