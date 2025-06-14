import { Button } from '@/components/ui/button';
import { useMonitoringInfo, useSystemSummary } from '@/shared/api';
import { Card } from '@/shared/ui/card/card';
import { Layout } from '@/widgets/layout';
import { Activity, Container, Monitor, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();
  
  const { 
    data: clusterInfo,
    isLoading: clusterLoading,
    error: clusterError 
  } = useMonitoringInfo(10000);
  
  const { 
    data: systemSummary,
    isLoading: summaryLoading,
    error: summaryError 
  } = useSystemSummary(10000);
  
  const isLoading = clusterLoading || summaryLoading;
  const hasError = clusterError || summaryError;
  
  return (
    <Layout>
      <div className="flex flex-col w-full h-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">대시보드</h1>
          <Button 
            onClick={() => navigate('/cluster-monitoring')}
            className="flex items-center gap-2"
          >
            <Monitor className="w-4 h-4" />
            클러스터 모니터링
          </Button>
        </div>
        
        {/* 빠른 상태 개요 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">클러스터 노드</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : (clusterInfo?.nodes?.length || 0)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Container className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">실행 중인 컨테이너</p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? '...' : (systemSummary?.containers?.running || 0)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">CPU 사용률</p>
                <p className="text-2xl font-bold text-orange-600">
                  {isLoading ? '...' : `${systemSummary?.resources?.cpu_usage?.toFixed(1) || 0}%`}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                systemSummary?.status?.indicator === 'normal' ? 'bg-green-100' :
                systemSummary?.status?.indicator === 'warning' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <Monitor className={`w-6 h-6 ${
                  systemSummary?.status?.indicator === 'normal' ? 'text-green-600' :
                  systemSummary?.status?.indicator === 'warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">시스템 상태</p>
                <p className={`text-lg font-semibold ${
                  systemSummary?.status?.indicator === 'normal' ? 'text-green-600' :
                  systemSummary?.status?.indicator === 'warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {isLoading ? '...' : (systemSummary?.status?.description || '알 수 없음')}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* 컨테이너 상태 요약 */}
        <Card title="컨테이너 상태" className="w-full">
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
            </div>
          ) : hasError ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-red-500">데이터를 불러오는 데 실패했습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 h-40">
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                <span className="text-3xl font-bold">{systemSummary?.containers?.total || 0}</span>
                <span className="text-gray-500 mt-2">총 컨테이너</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg p-4">
                <span className="text-3xl font-bold text-green-600">{systemSummary?.containers?.running || 0}</span>
                <span className="text-gray-500 mt-2">실행 중</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-red-50 rounded-lg p-4">
                <span className="text-3xl font-bold text-red-600">{systemSummary?.containers?.stopped || 0}</span>
                <span className="text-gray-500 mt-2">중지됨</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-yellow-50 rounded-lg p-4">
                <span className="text-3xl font-bold text-yellow-600">{systemSummary?.containers?.error || 0}</span>
                <span className="text-gray-500 mt-2">오류</span>
              </div>
            </div>
          )}
        </Card>
        
        {/* 리소스 사용량 */}
        <Card title="시스템 리소스 사용량" className="w-full">
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
            </div>
          ) : hasError ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-red-500">데이터를 불러오는 데 실패했습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 h-40">
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">{systemSummary?.resources?.cpu_usage?.toFixed(1) || 0}%</div>
                <p className="text-gray-500 mt-2">CPU 사용량</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">{systemSummary?.resources?.memory_usage?.toFixed(1) || 0}%</div>
                <p className="text-gray-500 mt-2">메모리 사용량</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">{systemSummary?.resources?.disk_usage?.toFixed(1) || 0}%</div>
                <p className="text-gray-500 mt-2">디스크 사용량</p>
              </div>
            </div>
          )}
        </Card>
        
        {/* 클러스터 정보 */}
        <Card title="클러스터 정보" className="w-full">
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
            </div>
          ) : hasError ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-red-500">데이터를 불러오는 데 실패했습니다.</p>
            </div>
          ) : clusterInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">클러스터 ID:</span>
                  <span className="font-mono text-sm">{clusterInfo.clusterID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">이름:</span>
                  <span className="font-semibold">{clusterInfo.name}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">오케스트레이션:</span>
                  <span>{clusterInfo.orchestration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Raft 상태:</span>
                  <span>{clusterInfo.raftStatus}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500">클러스터 정보를 불러올 수 없습니다.</p>
            </div>
          )}
        </Card>
        
        {/* 교육용 안내 */}
        <Card title="🎓 학습 가이드" className="w-full">
          <div className="p-4 space-y-4">
            <p className="text-gray-600">
              쿠버네틱스 클러스터 모니터링을 통해 실시간으로 시스템 상태를 확인하고 학습해보세요.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate('/cluster-monitoring')}
                className="flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                클러스터 모니터링 시작하기
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/containers')}
                className="flex items-center gap-2"
              >
                <Container className="w-4 h-4" />
                컨테이너 관리
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}; 