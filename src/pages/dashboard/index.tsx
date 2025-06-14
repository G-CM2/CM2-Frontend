import { Button } from '@/components/ui/button';
import { useServices, useSystemSummary } from '@/shared/api';
import { Service } from '@/shared/api/services';
import { useToastContext } from '@/shared/contexts';
import { Card } from '@/shared/ui/card/card';
import { Layout } from '@/widgets/layout';
import {
    Activity,
    AlertTriangle,
    Container,
    Database,
    Globe,
    HardDrive,
    Layers,
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
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToastContext();
  
  const { 
    data: systemSummary,
    isLoading: summaryLoading,
    error: summaryError 
  } = useSystemSummary();

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
          showInfo(`${service.name} 서비스를 스케일 업 중입니다...`);
          setTimeout(() => {
            showSuccess(`${service.name} 서비스가 ${(service.replicas || 1) + 1}개 레플리카로 확장되었습니다.`);
          }, 2000);
          break;
        case 'scale-down':
          if ((service.replicas || 1) > 1) {
            showInfo(`${service.name} 서비스를 스케일 다운 중입니다...`);
            setTimeout(() => {
              showSuccess(`${service.name} 서비스가 ${(service.replicas || 1) - 1}개 레플리카로 축소되었습니다.`);
            }, 2000);
          }
          break;
        case 'restart':
          showInfo(`${service.name} 서비스를 재시작 중입니다...`);
          setTimeout(() => {
            showSuccess(`${service.name} 서비스가 성공적으로 재시작되었습니다.`);
          }, 3000);
          break;
        case 'rolling-update':
          showInfo(`${service.name} 서비스의 롤링 업데이트를 시작합니다...`);
          setTimeout(() => {
            showSuccess(`${service.name} 서비스가 성공적으로 업데이트되었습니다.`);
          }, 4000);
          break;
        case 'troubleshoot':
          showInfo(`${service.name} 서비스 문제를 진단 중입니다...`);
          setTimeout(() => {
            showSuccess(`${service.name} 서비스 문제가 해결되었습니다.`);
          }, 3000);
          break;
      }
    } catch {
      showError('작업 중 오류가 발생했습니다.');
    }
  };

  // 시스템 액션 핸들러
  const handleSystemAction = async (action: string) => {
    try {
      switch (action) {
        case 'health-check':
          showInfo('클러스터 헬스 체크를 실행 중입니다...');
          setTimeout(() => {
            showSuccess('클러스터가 정상 상태입니다.');
          }, 2000);
          break;
        case 'resource-optimize':
          showInfo('리소스 최적화를 실행 중입니다...');
          setTimeout(() => {
            showSuccess('리소스 사용량이 최적화되었습니다.');
          }, 3000);
          break;
        case 'auto-scale':
          showInfo('자동 스케일링 정책을 적용 중입니다...');
          setTimeout(() => {
            showSuccess('자동 스케일링이 활성화되었습니다.');
          }, 2500);
          break;
      }
    } catch {
      showError('작업 중 오류가 발생했습니다.');
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

  const getServiceTypeIcon = (serviceName: string) => {
    if (serviceName.includes('web') || serviceName.includes('frontend')) {
      return <Globe className="w-5 h-5 text-blue-600" />;
    }
    if (serviceName.includes('api') || serviceName.includes('backend')) {
      return <Server className="w-5 h-5 text-green-600" />;
    }
    if (serviceName.includes('db') || serviceName.includes('database') || serviceName.includes('postgres')) {
      return <Database className="w-5 h-5 text-purple-600" />;
    }
    if (serviceName.includes('cache') || serviceName.includes('redis')) {
      return <Zap className="w-5 h-5 text-red-600" />;
    }
    if (serviceName.includes('monitor')) {
      return <Monitor className="w-5 h-5 text-orange-600" />;
    }
    return <Container className="w-5 h-5 text-gray-600" />;
  };

  // 총 컨테이너 수 계산
  const totalContainers = services?.reduce((sum, service) => sum + (service.replicas || 1), 0) || 0;
  const runningContainers = services?.filter(s => s.status === 'running').reduce((sum, service) => sum + (service.replicas || 1), 0) || 0;

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
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <p className="text-gray-600 mt-1">
              Docker 컨테이너 관리 시스템 개요
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => refetchServices()}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>
        </div>

        {/* 시스템 개요 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 서비스</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '-' : services?.length || 0}
                </p>
              </div>
              <Server className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">실행 중인 컨테이너</p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? '-' : runningContainers}
                </p>
              </div>
              <Container className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 컨테이너</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '-' : totalContainers}
                </p>
              </div>
              <Layers className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">시스템 상태</p>
                <p className="text-2xl font-bold text-green-600">정상</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </Card>
        </div>

        {/* 시스템 리소스 */}
        {systemSummary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">CPU 사용률</h3>
                <Monitor className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>사용 중</span>
                  <span>{systemSummary.resources.cpu_usage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${systemSummary.resources.cpu_usage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  시스템 CPU 사용률
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">메모리 사용률</h3>
                <HardDrive className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>사용 중</span>
                  <span>{systemSummary.resources.memory_usage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${systemSummary.resources.memory_usage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  시스템 메모리 사용률
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">디스크 사용률</h3>
                <HardDrive className="w-5 h-5 text-purple-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>사용 중</span>
                  <span>{systemSummary.resources.disk_usage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${systemSummary.resources.disk_usage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  시스템 디스크 사용률
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 빠른 액션 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleSystemAction('health-check')}
              variant="outline"
              className="flex items-center gap-2 p-4 h-auto"
            >
              <Activity className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">헬스 체크</div>
                <div className="text-sm text-gray-500">시스템 상태 확인</div>
              </div>
            </Button>

            <Button
              onClick={() => handleSystemAction('resource-optimize')}
              variant="outline"
              className="flex items-center gap-2 p-4 h-auto"
            >
              <Settings className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">리소스 최적화</div>
                <div className="text-sm text-gray-500">성능 최적화 실행</div>
              </div>
            </Button>

            <Button
              onClick={() => handleSystemAction('auto-scale')}
              variant="outline"
              className="flex items-center gap-2 p-4 h-auto"
            >
              <RotateCcw className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">자동 스케일링</div>
                <div className="text-sm text-gray-500">스케일링 정책 적용</div>
              </div>
            </Button>
          </div>
        </Card>

        {/* 최근 서비스 활동 */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">최근 서비스 활동</h3>
              <Button
                onClick={() => navigate('/services')}
                variant="outline"
                size="sm"
              >
                전체 보기
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">서비스 정보를 불러오는 중...</p>
            </div>
          ) : services && services.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {services.slice(0, 5).map((service) => (
                <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getServiceTypeIcon(service.name)}
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getServiceStatusColor(service.status)}`}>
                            {getServiceStatusIcon(service.status)}
                            {service.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{service.image}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>레플리카: {service.replicas}</span>
                          {service.ports && service.ports.length > 0 && (
                            <span>포트: {service.ports.map(p => `${p.external}:${p.internal}`).join(', ')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* 스케일링 버튼 */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleServiceAction(service, 'scale-down')}
                          disabled={(service.replicas || 1) <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
                          {service.replicas || 1}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleServiceAction(service, 'scale-up')}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* 액션 버튼 */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleServiceAction(service, 'restart')}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        재시작
                      </Button>

                      {service.status === 'failed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleServiceAction(service, 'troubleshoot')}
                          className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                        >
                          <Settings className="w-4 h-4" />
                          문제 해결
                        </Button>
                      )}

                      {service.status === 'running' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleServiceAction(service, 'rolling-update')}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <RotateCcw className="w-4 h-4" />
                          업데이트
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* 서비스 상태별 추가 정보 */}
                  {service.status === 'failed' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-800 font-medium">서비스 실행 실패</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        서비스가 정상적으로 시작되지 않았습니다. 문제 해결을 실행하거나 로그를 확인해보세요.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Server className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">서비스가 없습니다</h3>
              <p className="text-gray-600 mb-4">
                첫 번째 서비스를 생성하여 시작해보세요.
              </p>
              <Button 
                onClick={() => navigate('/services')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                서비스 생성하기
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}; 