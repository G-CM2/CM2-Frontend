import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonitoringInfo, useSystemSummary } from '@/shared/api';
import { AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export const ClusterMonitoringPage = () => {
  // 5초마다 클러스터 정보 갱신
  const { 
    data: clusterInfo, 
    isLoading: isClusterLoading, 
    error: clusterError,
    refetch: refetchCluster
  } = useMonitoringInfo(5000);

  // 10초마다 시스템 요약 정보 갱신
  const { 
    data: systemSummary, 
    isLoading: isSummaryLoading, 
    error: summaryError,
    refetch: refetchSummary
  } = useSystemSummary(10000);

  const handleRefresh = () => {
    refetchCluster();
    refetchSummary();
  };

  const hasError = clusterError || summaryError;
  const isLoading = isClusterLoading || isSummaryLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 섹션 */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              클러스터 모니터링
            </h1>
            <p className="text-gray-600 text-lg">
              실시간 쿠버네틱스 클러스터 상태를 시각적으로 학습하세요
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>실시간 업데이트</span>
            </div>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>
        </div>

        {/* 오류 알림 */}
        {hasError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span>데이터를 불러오는 중 오류가 발생했습니다. 새로고침을 시도해보세요.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 실시간 상태 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">클러스터 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                <span className="text-lg font-semibold">
                  {isLoading ? '로딩 중...' : (clusterInfo ? '정상' : '연결 안됨')}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">총 노드 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {isClusterLoading ? '...' : (clusterInfo?.nodes?.length || 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">실행 중인 컨테이너</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {isSummaryLoading ? '...' : (systemSummary?.containers?.running || 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">CPU 사용률</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {isSummaryLoading ? '...' : `${systemSummary?.resources?.cpu_usage?.toFixed(1) || 0}%`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 클러스터 정보 카드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>클러스터 정보</CardTitle>
              <CardDescription>현재 클러스터의 기본 정보입니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isClusterLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              ) : clusterInfo ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">클러스터 ID:</span>
                    <span className="font-mono text-sm">{clusterInfo.clusterID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">이름:</span>
                    <span className="font-semibold">{clusterInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">오케스트레이션:</span>
                    <span>{clusterInfo.orchestration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Raft 상태:</span>
                    <span>{clusterInfo.raftStatus}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  클러스터 정보를 불러올 수 없습니다
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>시스템 요약</CardTitle>
              <CardDescription>전체 시스템의 현재 상태입니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSummaryLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              ) : systemSummary ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">시스템 상태:</span>
                    <span className={`font-semibold ${
                      systemSummary.status.indicator === 'normal' ? 'text-green-600' :
                      systemSummary.status.indicator === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {systemSummary.status.description}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">총 컨테이너:</span>
                    <span>{systemSummary.containers.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">메모리 사용률:</span>
                    <span>{systemSummary.resources.memory_usage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">디스크 사용률:</span>
                    <span>{systemSummary.resources.disk_usage.toFixed(1)}%</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  시스템 요약 정보를 불러올 수 없습니다
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 노드 상태 */}
        <Card>
          <CardHeader>
            <CardTitle>노드 상태</CardTitle>
            <CardDescription>클러스터 내 모든 노드의 현재 상태입니다</CardDescription>
          </CardHeader>
          <CardContent>
            {isClusterLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                  </div>
                ))}
              </div>
            ) : clusterInfo?.nodes?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clusterInfo.nodes.map((node) => (
                  <div key={node.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{node.hostname}</h4>
                      <div className={`w-3 h-3 rounded-full ${
                        node.status === 'Ready' ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>상태: {node.status}</div>
                      <div>가용성: {node.availability}</div>
                      {node.managerStatus && (
                        <div className="text-blue-600 font-medium">
                          매니저: {node.managerStatus}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                노드 정보를 불러올 수 없습니다
              </div>
            )}
          </CardContent>
        </Card>

        {/* 교육적 정보 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>💡 학습 포인트</CardTitle>
            <CardDescription>쿠버네틱스 클러스터 모니터링의 핵심 개념들</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">클러스터 구조</h4>
                <p className="text-sm text-gray-600">
                  매니저 노드와 워커 노드의 역할을 이해하고, 각 노드의 상태를 확인해보세요.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">리소스 모니터링</h4>
                <p className="text-sm text-gray-600">
                  CPU, 메모리, 디스크 사용량을 통해 시스템 성능을 모니터링하는 방법을 학습하세요.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">컨테이너 상태</h4>
                <p className="text-sm text-gray-600">
                  실행 중, 중지됨, 오류 상태의 컨테이너들을 구분하고 관리하는 방법을 익혀보세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 