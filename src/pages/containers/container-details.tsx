import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService, Container, ContainerActionResponse } from '@/shared/api';
import { ContainerActionButton } from '@/features/container-control';
import { Card } from '@/shared/ui/card/card';

export const ContainerDetailsPage = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [container, setContainer] = useState<Container | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchContainerDetails = async () => {
      if (!containerId) {
        setError('컨테이너 ID가 제공되지 않았습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiService.getContainerById(containerId);
        setContainer(response.data);
        setError(null);
      } catch (err) {
        setError('컨테이너 상세 정보를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching container details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContainerDetails();
  }, [containerId]);

  const handleActionComplete = (response: ContainerActionResponse) => {
    setActionMessage(response.message);
    
    // 액션 완료 후 최신 컨테이너 정보 다시 가져오기
    setTimeout(async () => {
      try {
        if (containerId) {
          const response = await apiService.getContainerById(containerId);
          setContainer(response.data);
        }
      } catch (err) {
        console.error('Error refreshing container details:', err);
      }
    }, 1000);
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'text-gray-500';
    
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!container) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">컨테이너 정보를 찾을 수 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{container.name}</h1>
        <span className={`px-3 py-1 rounded-full ${getStatusColor(container.status)} bg-opacity-20 border border-current`}>
          {container.status}
        </span>
      </div>

      {actionMessage && (
        <div className="mb-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{actionMessage}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4"
            onClick={() => setActionMessage(null)}
          >
            &times;
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="컨테이너 기본 정보">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                  <p className="font-mono text-sm">{container.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">이미지</p>
                  <p>{container.image}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">생성 시간</p>
                  <p>{new Date(container.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">재시작 횟수</p>
                  <p>{container.restart_count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">헬스</p>
                  <p className={container.health === 'healthy' ? 'text-green-500' : 'text-red-500'}>
                    {container.health}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {container.logs && (
            <Card title="로그" className="mt-6">
              <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-auto max-h-96">
                <pre>{container.logs}</pre>
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card title="컨테이너 제어">
            <div className="space-y-4">
              <ContainerActionButton 
                containerId={container.id}
                action="start"
                label="시작"
                variant="primary"
                onActionComplete={handleActionComplete}
              />
              
              <ContainerActionButton 
                containerId={container.id}
                action="stop"
                label="중지"
                variant="danger"
                onActionComplete={handleActionComplete}
              />
              
              <ContainerActionButton 
                containerId={container.id}
                action="restart"
                label="재시작"
                variant="secondary"
                onActionComplete={handleActionComplete}
              />
              
              <ContainerActionButton 
                containerId={container.id}
                action="pause"
                label="일시 중지"
                variant="secondary"
                onActionComplete={handleActionComplete}
              />
              
              <ContainerActionButton 
                containerId={container.id}
                action="unpause"
                label="일시 중지 해제"
                variant="primary"
                onActionComplete={handleActionComplete}
              />
            </div>
          </Card>

          <Card title="리소스 사용량" className="mt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">CPU 사용량</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(container.cpu_usage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs mt-1">{container.cpu_usage}%</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">메모리 사용량</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min((container.memory_usage / 1024), 100)}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs mt-1">{container.memory_usage} MB</p>
              </div>
            </div>
          </Card>

          {container.ports && container.ports.length > 0 && (
            <Card title="포트 매핑" className="mt-6">
              <div className="space-y-2">
                {container.ports.map((port, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{port.internal}</span>
                    <span className="text-gray-500 dark:text-gray-400">→</span>
                    <span>{port.external}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {container.volumes && container.volumes.length > 0 && (
            <Card title="볼륨 마운트" className="mt-6">
              <div className="space-y-2">
                {container.volumes.map((volume, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">소스:</p>
                    <p className="text-sm font-mono truncate">{volume.source}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">대상:</p>
                    <p className="text-sm font-mono truncate">{volume.target}</p>
                    {index < container.volumes!.length - 1 && <hr className="my-2" />}
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {container.environment && container.environment.length > 0 && (
            <Card title="환경 변수" className="mt-6">
              <div className="space-y-2">
                {container.environment.map((env, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{env.key}</p>
                    <p className="text-sm font-mono truncate">{env.value}</p>
                    {index < container.environment!.length - 1 && <hr className="my-2" />}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}; 