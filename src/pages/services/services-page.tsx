import { Button } from '@/components/ui/button';
import { servicesApi, useServices } from '@/shared/api';
import { CreateServiceRequest, Service } from '@/shared/api/services';
import { useToastContext } from '@/shared/contexts';
import { Card } from '@/shared/ui/card/card';
import { Layout } from '@/widgets/layout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    AlertTriangle,
    Container,
    Database,
    Globe,
    Minus,
    Monitor,
    Network,
    Play,
    Plus,
    RefreshCw,
    Server,
    Settings,
    Square,
    Trash2,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ServicesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError, showWarning } = useToastContext();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceImage, setNewServiceImage] = useState('nginx:latest');

  const {
    data: services,
    isLoading,
    error,
    refetch
  } = useServices();

  // 서비스 생성 뮤테이션
  const createServiceMutation = useMutation({
    mutationFn: (request: CreateServiceRequest) => servicesApi.createService(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      showSuccess('서비스가 성공적으로 생성되었습니다.');
      setShowCreateForm(false);
      setNewServiceName('');
      setNewServiceImage('nginx:latest');
    },
    onError: () => {
      showError('서비스 생성 중 오류가 발생했습니다.');
    }
  });

  // 서비스 삭제 뮤테이션
  const deleteServiceMutation = useMutation({
    mutationFn: (serviceId: string) => servicesApi.deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      showSuccess('서비스가 성공적으로 삭제되었습니다.');
    },
    onError: () => {
      showError('서비스 삭제 중 오류가 발생했습니다.');
    }
  });

  // 서비스 스케일링 뮤테이션
  const scaleServiceMutation = useMutation({
    mutationFn: ({ serviceId, replicas }: { serviceId: string; replicas: number }) => 
      servicesApi.scaleService(serviceId, { replicas }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      showSuccess('서비스 스케일링이 완료되었습니다.');
    },
    onError: () => {
      showError('서비스 스케일링 중 오류가 발생했습니다.');
    }
  });

  const handleCreateService = () => {
    if (!newServiceName.trim()) {
      showWarning('서비스 이름을 입력해주세요.');
      return;
    }

    const request: CreateServiceRequest = {
      name: newServiceName,
      image: newServiceImage,
      replicas: 1,
      ports: newServiceImage.includes('nginx') ? [
        { internal: 80, external: 8080 }
      ] : []
    };

    createServiceMutation.mutate(request);
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('정말로 이 서비스를 삭제하시겠습니까?')) {
      deleteServiceMutation.mutate(serviceId);
    }
  };

  const handleScaleService = (serviceId: string, currentReplicas: number, direction: 'up' | 'down') => {
    const newReplicas = direction === 'up' ? currentReplicas + 1 : Math.max(1, currentReplicas - 1);
    scaleServiceMutation.mutate({ serviceId, replicas: newReplicas });
  };

  const getServiceTypeIcon = (serviceName: string, image: string) => {
    if (serviceName.includes('web') || image.includes('nginx') || serviceName.includes('frontend')) {
      return <Globe className="w-5 h-5 text-blue-600" />;
    }
    if (serviceName.includes('api') || serviceName.includes('backend')) {
      return <Server className="w-5 h-5 text-green-600" />;
    }
    if (serviceName.includes('db') || serviceName.includes('database') || image.includes('postgres')) {
      return <Database className="w-5 h-5 text-purple-600" />;
    }
    if (serviceName.includes('cache') || image.includes('redis')) {
      return <Zap className="w-5 h-5 text-red-600" />;
    }
    if (serviceName.includes('monitor')) {
      return <Monitor className="w-5 h-5 text-orange-600" />;
    }
    return <Container className="w-5 h-5 text-gray-600" />;
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

  // 사전 정의된 서비스 템플릿
  const serviceTemplates = [
    {
      name: 'nginx-web',
      image: 'nginx:latest',
      description: 'Nginx 웹 서버',
      icon: <Globe className="w-5 h-5 text-blue-600" />
    },
    {
      name: 'redis-cache',
      image: 'redis:alpine',
      description: 'Redis 캐시 서버',
      icon: <Zap className="w-5 h-5 text-red-600" />
    }
  ];

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">서비스 데이터를 불러오는 중 오류가 발생했습니다</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">서비스 관리</h1>
            <p className="text-gray-600 mt-1">
              Docker Swarm 서비스 생성, 관리 및 모니터링
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => refetch()}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              서비스 생성
            </Button>
          </div>
        </div>

        {/* 서비스 생성 폼 */}
        {showCreateForm && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              새 서비스 생성
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    서비스 이름
                  </label>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="예: my-web-service"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Docker 이미지
                  </label>
                  <input
                    type="text"
                    value={newServiceImage}
                    onChange={(e) => setNewServiceImage(e.target.value)}
                    placeholder="예: nginx:latest"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 템플릿 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  서비스 템플릿
                </label>
                <div className="space-y-2">
                  {serviceTemplates.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => {
                        setNewServiceName(template.name);
                        setNewServiceImage(template.image);
                      }}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {template.icon}
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-600">{template.description}</div>
                          <div className="text-xs text-gray-500">{template.image}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button 
                onClick={handleCreateService}
                disabled={createServiceMutation.isPending}
                className="flex items-center gap-2"
              >
                {createServiceMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                생성
              </Button>
              <Button 
                onClick={() => setShowCreateForm(false)}
                variant="outline"
              >
                취소
              </Button>
            </div>
          </Card>
        )}

        {/* 서비스 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 서비스</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '-' : services?.length || 0}
                </p>
              </div>
              <Container className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">실행 중</p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? '-' : services?.filter(s => s.status === 'running').length || 0}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">실패</p>
                <p className="text-2xl font-bold text-red-600">
                  {isLoading ? '-' : services?.filter(s => s.status === 'failed').length || 0}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 레플리카</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '-' : services?.reduce((sum, s) => sum + (s.replicas || 0), 0) || 0}
                </p>
              </div>
              <Network className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* 서비스 목록 */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">서비스 목록</h3>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">서비스 목록을 불러오는 중...</p>
            </div>
          ) : services && services.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {services.map((service) => (
                <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getServiceTypeIcon(service.name, service.image)}
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
                          onClick={() => handleScaleService(service.id, service.replicas || 1, 'down')}
                          disabled={scaleServiceMutation.isPending || (service.replicas || 1) <= 1}
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
                          onClick={() => handleScaleService(service.id, service.replicas || 1, 'up')}
                          disabled={scaleServiceMutation.isPending}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* 액션 버튼 */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/services/${service.id}`)}
                        className="flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        관리
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteService(service.id)}
                        disabled={deleteServiceMutation.isPending}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </Button>
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
                        서비스가 정상적으로 시작되지 않았습니다. 로그를 확인하거나 서비스를 재시작해보세요.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline" className="text-red-600">
                          로그 확인
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          재시작
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Container className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">서비스가 없습니다</h3>
              <p className="text-gray-600 mb-4">
                첫 번째 서비스를 생성하여 애플리케이션을 배포해보세요.
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                서비스 생성
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}; 