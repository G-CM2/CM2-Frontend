import { useDeleteService, useScaleService, useService, useUpdateService } from '@/shared/api';
import { UpdateServiceRequest } from '@/shared/api/services';
import { useToastContext } from '@/shared/contexts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';
import { Button } from '@/shared/ui/button';
import { Layout } from '@/widgets/layout';
import {
    AlertTriangle,
    ArrowLeft,
    Container,
    Database,
    Globe,
    Minus,
    Network,
    Play,
    Plus,
    RefreshCw,
    RotateCcw,
    Settings,
    Trash2,
    Upload,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const ServiceDetailsPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, showInfo } = useToastContext();

  // 상태 관리
  const [isUpdating, setIsUpdating] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // API 훅들
  const {
    data: service,
    isLoading,
    error,
    refetch
  } = useService(serviceId!);

  const scaleServiceMutation = useScaleService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  // 이미지 업데이트 폼 초기화
  const initializeUpdateForm = () => {
    if (service) {
      setNewImage(service.image);
      setShowUpdateForm(true);
    }
  };

  // 스케일링 핸들러
  const handleScale = async (direction: 'up' | 'down') => {
    if (!service) return;

    const currentReplicas = service.replicas || 1;
    const newReplicas = direction === 'up' ? currentReplicas + 1 : Math.max(1, currentReplicas - 1);

    if (direction === 'down' && currentReplicas <= 1) {
      showWarning('최소 1개의 레플리카가 필요합니다.');
      return;
    }

    try {
      showInfo(`서비스를 ${newReplicas}개 레플리카로 ${direction === 'up' ? '확장' : '축소'} 중입니다...`);
      await scaleServiceMutation.mutateAsync({
        id: service.id,
        request: { replicas: newReplicas }
      });
      showSuccess(`서비스가 ${newReplicas}개 레플리카로 ${direction === 'up' ? '확장' : '축소'}되었습니다.`);
      refetch();
    } catch {
      showError('스케일링 중 오류가 발생했습니다.');
    }
  };

  // 롤링 업데이트 핸들러
  const handleRollingUpdate = async () => {
    if (!service || !newImage.trim()) {
      showWarning('업데이트할 이미지를 입력해주세요.');
      return;
    }

    setIsUpdating(true);
    try {
      showInfo('롤링 업데이트를 시작합니다...');
      const updateRequest: UpdateServiceRequest = {
        image: newImage.trim()
      };

      await updateServiceMutation.mutateAsync({
        id: service.id,
        request: updateRequest
      });

      showSuccess('롤링 업데이트가 완료되었습니다.');
      setShowUpdateForm(false);
      refetch();
    } catch {
      showError('롤링 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 서비스 삭제 핸들러
  const handleDelete = async () => {
    if (!service) return;

    const confirmed = window.confirm(
      `정말로 "${service.name}" 서비스를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );

    if (!confirmed) return;

    try {
      showInfo('서비스를 삭제하는 중입니다...');
      await deleteServiceMutation.mutateAsync(service.id);
      showSuccess('서비스가 성공적으로 삭제되었습니다.');
      navigate('/services');
    } catch {
      showError('서비스 삭제 중 오류가 발생했습니다.');
    }
  };

  // 서비스 재시작 핸들러
  const handleRestart = async () => {
    if (!service) return;

    try {
      showInfo('서비스를 재시작하는 중입니다...');
      await updateServiceMutation.mutateAsync({
        id: service.id,
        request: { image: service.image }
      });
      showSuccess('서비스가 성공적으로 재시작되었습니다.');
      refetch();
    } catch {
      showError('서비스 재시작 중 오류가 발생했습니다.');
    }
  };

  // 서비스 타입 아이콘 가져오기
  const getServiceIcon = (name: string, image: string) => {
    if (name.includes('nginx') || image.includes('nginx')) {
      return <Globe className="w-6 h-6 text-blue-600" />;
    }
    if (name.includes('redis') || image.includes('redis')) {
      return <Zap className="w-6 h-6 text-red-600" />;
    }
    if (name.includes('db') || name.includes('database') || image.includes('postgres') || image.includes('mysql')) {
      return <Database className="w-6 h-6 text-green-600" />;
    }
    return <Container className="w-6 h-6 text-gray-600" />;
  };

  // 상태 색상 가져오기
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'stopped':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">서비스 정보를 불러오는 중...</span>
          </div>
        </div>
      </Layout>
    );
  }

  // 에러 상태
  if (error || !service) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">
                서비스를 찾을 수 없습니다
              </span>
            </div>
            <p className="text-red-700 mt-2">
              요청하신 서비스가 존재하지 않거나 삭제되었을 수 있습니다.
            </p>
            <Button
              onClick={() => navigate('/services')}
              variant="outline"
              className="mt-4"
            >
              서비스 목록으로 돌아가기
            </Button>
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
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/services')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로가기
            </Button>
            <div className="flex items-center gap-3">
              {getServiceIcon(service.name, service.image)}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
                <p className="text-gray-600">{service.image}</p>
              </div>
            </div>
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
          </div>
        </div>

        {/* 서비스 상태 및 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">상태</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
                <Play className="w-4 h-4 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">레플리카</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{service.replicas || 1}</span>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleScale('down')}
                    disabled={scaleServiceMutation.isPending || (service.replicas || 1) <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleScale('up')}
                    disabled={scaleServiceMutation.isPending}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">배포 모드</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-600" />
                <span className="capitalize">{service.mode || 'replicated'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 상세 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>서비스의 기본 설정 정보</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">서비스 ID</label>
                <p className="text-sm text-gray-600 font-mono">{service.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">이미지</label>
                <p className="text-sm text-gray-600 font-mono">{service.image}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">생성일</label>
                <p className="text-sm text-gray-600">
                  {service.created_at ? new Date(service.created_at).toLocaleString('ko-KR') : '정보 없음'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">마지막 업데이트</label>
                <p className="text-sm text-gray-600">
                  {service.updated_at ? new Date(service.updated_at).toLocaleString('ko-KR') : '정보 없음'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 네트워크 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>네트워크 정보</CardTitle>
              <CardDescription>포트 및 네트워크 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">포트 매핑</label>
                {service.ports && service.ports.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {service.ports.map((port, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                          {port.external}:{port.internal}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">포트 매핑 없음</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">네트워크</label>
                <div className="space-y-1 mt-2">
                  {service.networks?.map((network, index) => (
                    <span key={index} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {network}
                    </span>
                  )) || <span className="text-sm text-gray-500">기본 네트워크</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 리소스 사용량 */}
        <Card>
          <CardHeader>
            <CardTitle>리소스 사용량</CardTitle>
            <CardDescription>현재 CPU 및 메모리 사용량</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">CPU 사용률</span>
                  <span className="text-sm text-gray-600">{service.cpu_usage?.toFixed(1) || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(service.cpu_usage || 0, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">메모리 사용량</span>
                  <span className="text-sm text-gray-600">{service.memory_usage || 0} MB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((service.memory_usage || 0) / 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 롤링 업데이트 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                롤링 업데이트
              </CardTitle>
              <CardDescription>
                서비스 중단 없이 새로운 이미지로 업데이트
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showUpdateForm ? (
                <Button
                  onClick={initializeUpdateForm}
                  className="w-full flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  업데이트 시작
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      새 이미지
                    </label>
                    <input
                      type="text"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="예: nginx:1.21"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRollingUpdate}
                      disabled={isUpdating || updateServiceMutation.isPending}
                      className="flex-1 flex items-center gap-2"
                    >
                      {isUpdating ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      업데이트
                    </Button>
                    <Button
                      onClick={() => setShowUpdateForm(false)}
                      variant="outline"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 기타 액션들 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                서비스 관리
              </CardTitle>
              <CardDescription>
                서비스 재시작, 삭제 등의 관리 작업
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleRestart}
                disabled={updateServiceMutation.isPending}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                서비스 재시작
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteServiceMutation.isPending}
                variant="outline"
                className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                서비스 삭제
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}; 