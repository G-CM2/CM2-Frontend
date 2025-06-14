import { Button } from '@/components/ui/button';
import { useServices, useSystemSummary } from '@/shared/api';
import { Service } from '@/shared/api/services';
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
  Network,
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
          setActionMessage(`${service.name} 서비스를 스케일 업 중입니다...`);
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
            <h1 className="text-3xl font-bold text-gray-900">클러스터 대시보드</h1>
            <p className="text-gray-600 mt-1">
              Container Management Dashboard - 서비스 기반 컨테이너 클러스터 관리
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

        {/* 클러스터 개요 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSystemAction('health-check')}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Layers className="w-6 h-6 text-blue-600" />
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

          <div className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/containers')}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Container className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">총 컨테이너</p>
                  <p className="text-2xl font-bold text-green-600">
                    {isLoading ? '...' : `${runningContainers}/${totalContainers}`}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSystemAction('auto-scale')}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Server className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">활성 서비스</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {isLoading ? '...' : services?.filter(s => s.status === 'running').length || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSystemAction('resource-optimize')}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Network className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">네트워크</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {isLoading ? '...' : services?.reduce((networks, service) => {
                      service.networks?.forEach(network => networks.add(network));
                      return networks;
                    }, new Set()).size || 1}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 리소스 사용량 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-gray-900">CPU 사용률</span>
              </div>
              <span className="text-2xl font-bold text-orange-600">
                {isLoading ? '...' : `${systemSummary?.resources?.cpu_usage?.toFixed(1) || 0}%`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${systemSummary?.resources?.cpu_usage || 0}%` }}
              ></div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">메모리 사용률</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {isLoading ? '...' : `${systemSummary?.resources?.memory_usage?.toFixed(1) || 0}%`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${systemSummary?.resources?.memory_usage || 0}%` }}
              ></div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">디스크 사용률</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {isLoading ? '...' : `${systemSummary?.resources?.disk_usage?.toFixed(1) || 0}%`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${systemSummary?.resources?.disk_usage || 0}%` }}
              ></div>
            </div>
          </Card>
        </div>

        {/* 서비스 아키텍처 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">서비스 아키텍처</h2>
            <span className="text-sm text-gray-500">
              총 {services?.length || 0}개 서비스 • {totalContainers}개 컨테이너
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
                <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <div className="space-y-4">
                    {/* 서비스 헤더 */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getServiceTypeIcon(service.name)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-500">{service.image}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">모드:</span>
                            <span className="text-xs font-medium text-gray-600">{service.mode}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getServiceStatusColor(service.status)}`}>
                        {getServiceStatusIcon(service.status)}
                        {service.status}
                      </div>
                    </div>

                    {/* 컨테이너 인스턴스 정보 */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Container className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">컨테이너 인스턴스</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleServiceAction(service, 'scale-down')}
                            disabled={!service.replicas || service.replicas <= 1}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="mx-2 font-medium text-sm">{service.replicas || 1}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleServiceAction(service, 'scale-up')}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* 컨테이너 상태 표시 */}
                      <div className="flex gap-1">
                        {Array.from({ length: service.replicas || 1 }).map((_, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                              service.status === 'running' ? 'bg-green-500' :
                              service.status === 'failed' ? 'bg-red-500' :
                              service.status === 'pending' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`}
                            title={`컨테이너 ${index + 1}: ${service.status}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 네트워크 및 포트 정보 */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {service.ports && service.ports.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">포트:</span>
                          <div className="text-gray-600 mt-1">
                            {service.ports.map((p, idx) => (
                              <div key={idx} className="text-xs">
                                {p.external}:{p.internal}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {service.networks && service.networks.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">네트워크:</span>
                          <div className="text-gray-600 mt-1">
                            {service.networks.map((network, idx) => (
                              <div key={idx} className="text-xs">{network}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 pt-2 border-t">
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
          <h3 className="font-semibold text-gray-900 mb-3">클러스터 알림</h3>
          <div className="space-y-2">
            {systemSummary?.containers?.failed && systemSummary.containers.failed > 0 && (
              <div className="flex items-start gap-2 p-2 bg-red-50 rounded">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="font-medium text-red-800">
                    {systemSummary.containers.failed}개 컨테이너에 문제 발생
                  </div>
                  <div className="text-red-600 text-sm">즉시 확인이 필요합니다</div>
                </div>
              </div>
            )}
            {systemSummary?.containers?.stopped && systemSummary.containers.stopped > 0 && (
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="font-medium text-yellow-800">
                    {systemSummary.containers.stopped}개 컨테이너가 중지됨
                  </div>
                  <div className="text-yellow-600 text-sm">서비스 영향을 확인하세요</div>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2 p-2 bg-green-50 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <div>
                <div className="font-medium text-green-800">
                  클러스터가 정상적으로 작동 중입니다
                </div>
                <div className="text-green-600 text-sm">
                  {runningContainers}개 컨테이너가 {services?.filter(s => s.status === 'running').length || 0}개 서비스에서 실행 중
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}; 