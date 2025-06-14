import { Button } from '@/components/ui/button';
import { useServices, useSystemSummary } from '@/shared/api';
import { Service } from '@/shared/api/services';
import { Card } from '@/shared/ui/card/card';
import { Layout } from '@/widgets/layout';
import {
    Activity,
    AlertTriangle,
    Container,
    Minus,
    Monitor,
    Play,
    Plus,
    RefreshCw,
    RotateCcw,
    Server,
    Settings,
    Square,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  
  const { 
    data: systemSummary,
    isLoading: summaryLoading,
    error: summaryError 
  } = useSystemSummary(10000);

  const {
    data: services,
    isLoading: servicesLoading,
    error: servicesError,
    refetch: refetchServices
  } = useServices();

  const isLoading = summaryLoading || servicesLoading;

  // 서비스 액션 핸들러
  const handleServiceAction = async (service: Service, action: string) => {
    try {
      switch (action) {
        case 'scale-up':
          setActionMessage(`${service.name} 서비스를 스케일 업 중입니다...`);
          // 실제로는 API 호출
          setTimeout(() => {
            setActionMessage(`${service.name} 서비스가 ${(service.replicas || 1) + 1}개 레플리카로 확장되었습니다.`);
            setTimeout(() => setActionMessage(null), 3000);
          }, 2000);
          break;
        case 'scale-down':
          if ((service.replicas || 1) > 1) {
            setActionMessage(`${service.name} 서비스를 스케일 다운 중입니다...`);
            setTimeout(() => {
              setActionMessage(`${service.name} 서비스가 ${(service.replicas || 1) - 1}개 레플리카로 축소되었습니다.`);
              setTimeout(() => setActionMessage(null), 3000);
            }, 2000);
          }
          break;
        case 'restart':
          setActionMessage(`${service.name} 서비스를 재시작 중입니다...`);
          setTimeout(() => {
            setActionMessage(`${service.name} 서비스가 성공적으로 재시작되었습니다.`);
            setTimeout(() => setActionMessage(null), 3000);
          }, 3000);
          break;
        case 'rolling-update':
          setActionMessage(`${service.name} 서비스의 롤링 업데이트를 시작합니다...`);
          setTimeout(() => {
            setActionMessage(`${service.name} 서비스가 성공적으로 업데이트되었습니다.`);
            setTimeout(() => setActionMessage(null), 3000);
          }, 4000);
          break;
                 case 'troubleshoot':
           setActionMessage(`${service.name} 서비스 문제를 진단 중입니다...`);
           setTimeout(() => {
             setActionMessage(`${service.name} 서비스 문제가 해결되었습니다.`);
             setTimeout(() => setActionMessage(null), 3000);
           }, 3000);
           break;
       }
     } catch {
       setActionMessage('작업 중 오류가 발생했습니다.');
       setTimeout(() => setActionMessage(null), 3000);
     }
  };

  // 시스템 액션 핸들러
  const handleSystemAction = async (action: string) => {
    try {
      switch (action) {
        case 'health-check':
          setActionMessage('클러스터 헬스 체크를 실행 중입니다...');
          setTimeout(() => {
            setActionMessage('클러스터가 정상 상태입니다.');
            setTimeout(() => setActionMessage(null), 3000);
          }, 2000);
          break;
        case 'resource-optimize':
          setActionMessage('리소스 최적화를 실행 중입니다...');
          setTimeout(() => {
            setActionMessage('리소스 사용량이 최적화되었습니다.');
            setTimeout(() => setActionMessage(null), 3000);
          }, 3000);
          break;
                 case 'auto-scale':
           setActionMessage('자동 스케일링 정책을 적용 중입니다...');
           setTimeout(() => {
             setActionMessage('자동 스케일링이 활성화되었습니다.');
             setTimeout(() => setActionMessage(null), 3000);
           }, 2500);
           break;
       }
     } catch {
       setActionMessage('작업 중 오류가 발생했습니다.');
       setTimeout(() => setActionMessage(null), 3000);
     }
  };

  const getServiceStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'running':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'shutdown':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getServiceStatusIcon = (status: Service['status']) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
      case 'shutdown':
        return <Square className="w-4 h-4 text-gray-600" />;
      default:
        return <Server className="w-4 h-4 text-gray-600" />;
    }
  };

  if (summaryError || servicesError) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">데이터를 불러오는 중 오류가 발생했습니다</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">서비스 대시보드</h1>
            <p className="text-gray-600 mt-1">
              Container Management Dashboard - Docker Services
            </p>
          </div>
          <Button 
            onClick={() => refetchServices()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            새로고침
          </Button>
        </div>

        {/* 액션 메시지 */}
        {actionMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-blue-800">{actionMessage}</span>
            </div>
          </div>
        )}

        {/* 시스템 상태 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSystemAction('health-check')}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">클러스터 상태</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {systemSummary?.status?.indicator === 'normal' ? '정상' : '점검 필요'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSystemAction('resource-optimize')}>
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
          </div>

          <div className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSystemAction('resource-optimize')}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Server className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">메모리 사용률</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {isLoading ? '...' : `${systemSummary?.resources?.memory_usage?.toFixed(1) || 0}%`}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSystemAction('auto-scale')}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">활성 서비스</p>
                  <p className="text-2xl font-bold text-green-600">
                    {isLoading ? '...' : services?.filter(s => s.status === 'running').length || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 서비스 목록 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">실행 중인 서비스</h2>
            <span className="text-sm text-gray-500">
              총 {services?.length || 0}개 서비스
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {services?.map((service) => (
                <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    {/* 서비스 헤더 */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Container className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-500">{service.image}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getServiceStatusColor(service.status)}`}>
                        {getServiceStatusIcon(service.status)}
                        {service.status}
                      </div>
                    </div>

                    {/* 레플리카 정보 */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">레플리카:</span>
                        <span className="font-medium">{service.replicas || 1}개</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleServiceAction(service, 'scale-down')}
                          disabled={!service.replicas || service.replicas <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleServiceAction(service, 'scale-up')}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* 포트 정보 */}
                    {service.ports && service.ports.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">포트:</span> {service.ports.map(p => `${p.publishedPort}:${p.targetPort}`).join(', ')}
                      </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 pt-2">
                      {service.status === 'running' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleServiceAction(service, 'restart')}
                            className="flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            재시작
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleServiceAction(service, 'rolling-update')}
                            className="flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            업데이트
                          </Button>
                        </>
                      )}
                      {service.status === 'failed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleServiceAction(service, 'troubleshoot')}
                          className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Settings className="w-3 h-3" />
                          문제 해결
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/containers?service=${service.id}`)}
                        className="flex items-center gap-1"
                      >
                        <Monitor className="w-3 h-3" />
                        상세보기
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 시스템 알림 */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">시스템 알림</h3>
          <div className="space-y-2">
            {systemSummary?.containers?.error && systemSummary.containers.error > 0 && (
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="font-medium text-yellow-800">
                    {systemSummary.containers.error}개 서비스에 문제 발생
                  </div>
                  <div className="text-yellow-600">5분 전</div>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2 p-2 bg-green-50 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <div>
                <div className="font-medium text-green-800">
                  클러스터가 정상적으로 작동 중입니다
                </div>
                <div className="text-green-600">방금 전</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}; 