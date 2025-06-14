import { Button } from '@/components/ui/button';
import { servicesApi, useServices } from '@/shared/api';
import { CreateServiceRequest, Service } from '@/shared/api/services';
import { Card } from '@/shared/ui/card/card';
import { Layout } from '@/widgets/layout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Activity,
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
  const [actionMessage, setActionMessage] = useState<string | null>(null);
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
      setActionMessage('서비스가 성공적으로 생성되었습니다.');
      setShowCreateForm(false);
      setNewServiceName('');
      setNewServiceImage('nginx:latest');
      setTimeout(() => setActionMessage(null), 3000);
    },
    onError: () => {
      setActionMessage('서비스 생성 중 오류가 발생했습니다.');
      setTimeout(() => setActionMessage(null), 3000);
    }
  });

  // 서비스 삭제 뮤테이션
  const deleteServiceMutation = useMutation({
    mutationFn: (serviceId: string) => servicesApi.deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setActionMessage('서비스가 성공적으로 삭제되었습니다.');
      setTimeout(() => setActionMessage(null), 3000);
    },
    onError: () => {
      setActionMessage('서비스 삭제 중 오류가 발생했습니다.');
      setTimeout(() => setActionMessage(null), 3000);
    }
  });

  // 서비스 스케일링 뮤테이션
  const scaleServiceMutation = useMutation({
    mutationFn: ({ serviceId, replicas }: { serviceId: string; replicas: number }) => 
      servicesApi.scaleService(serviceId, { replicas }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setActionMessage('서비스 스케일링이 완료되었습니다.');
      setTimeout(() => setActionMessage(null), 3000);
    },
    onError: () => {
      setActionMessage('서비스 스케일링 중 오류가 발생했습니다.');
      setTimeout(() => setActionMessage(null), 3000);
    }
  });

  const handleCreateService = () => {
    if (!newServiceName.trim()) {
      setActionMessage('서비스 이름을 입력해주세요.');
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }

    const request: CreateServiceRequest = {
      name: newServiceName,
      image: newServiceImage,
      mode: 'replicated',
      replicas: 1,
      ports: newServiceImage.includes('nginx') ? [
        { protocol: 'tcp', targetPort: 80, publishedPort: 8080 }
      ] : [],
      networks: ['default'],
      labels: {
        'created-by': 'cm2-dashboard',
        'service-type': newServiceImage.includes('nginx') ? 'web' : 'application'
      }
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
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">서비스 관리</h1>
            <p className="text-gray-600 mt-1">
              Docker Swarm 서비스 생성, 관리 및 모니터링
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => refetch()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
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

        {/* 액션 메시지 */}
        {actionMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-blue-800">{actionMessage}</span>
            </div>
          </div>
        )}

        {/* 서비스 생성 폼 */}
        {showCreateForm && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">새 서비스 생성</h3>
            
            {/* 템플릿 선택 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                서비스 템플릿
              </label>
              <div className="grid grid-cols-2 gap-3">
                {serviceTemplates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => {
                      setNewServiceName(template.name);
                      setNewServiceImage(template.image);
                    }}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                  >
                    {template.icon}
                    <div>
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  서비스 이름
                </label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: my-web-service"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Docker 이미지
                </label>
                <input
                  type="text"
                  value={newServiceImage}
                  onChange={(e) => setNewServiceImage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: nginx:latest"
                />
              </div>
            </div>

            <div className="flex gap-2">
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
          ) : services && services.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {services.map((service) => (
                <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    {/* 서비스 헤더 */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getServiceTypeIcon(service.name, service.image)}
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

                    {/* 스케일링 컨트롤 */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Container className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">레플리카</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleScaleService(service.id, service.replicas || 1, 'down')}
                            disabled={!service.replicas || service.replicas <= 1 || scaleServiceMutation.isPending}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="mx-2 font-medium text-sm min-w-[2rem] text-center">
                            {service.replicas || 1}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleScaleService(service.id, service.replicas || 1, 'up')}
                            disabled={scaleServiceMutation.isPending}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* 컨테이너 상태 표시 */}
                      <div className="flex gap-1 mt-2">
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
                                {p.publishedPort ? `${p.publishedPort}:${p.targetPort}` : p.targetPort} ({p.protocol})
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
                              <div key={idx} className="text-xs flex items-center gap-1">
                                <Network className="w-3 h-3" />
                                {network}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 pt-2 border-t">
                      {service.status === 'running' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/containers?service=${service.id}`)}
                          className="flex items-center gap-1"
                        >
                          <Monitor className="w-3 h-3" />
                          상세보기
                        </Button>
                      )}
                      {service.status === 'failed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                        >
                          <Settings className="w-3 h-3" />
                          문제 해결
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteService(service.id)}
                        disabled={deleteServiceMutation.isPending}
                        className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        {deleteServiceMutation.isPending ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        삭제
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <Server className="w-12 h-12 text-gray-400" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">서비스가 없습니다</h3>
                  <p className="text-gray-500 mt-1">새 서비스를 생성하여 시작하세요</p>
                </div>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  첫 번째 서비스 생성
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}; 