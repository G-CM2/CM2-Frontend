import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ContainerActionResponse, 
  useContainer, 
  useContainerTimeline 
} from '@/shared/api';
import { ContainerActionButton } from '@/features/container-control';
import { Card } from '@/shared/ui/card/card';

export const ContainerDetailsPage = () => {
  const { containerId = '' } = useParams<{ containerId: string }>();
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  
  const { 
    data: container, 
    isLoading, 
    isError 
  } = useContainer(containerId);
  
  const { 
    data: timelineData, 
    isLoading: timelineLoading 
  } = useContainerTimeline(containerId, 30000); // 30초마다 타임라인 데이터 갱신

  const handleActionComplete = (response: ContainerActionResponse) => {
    setActionMessage(`${response.action} 작업이 ${response.status === 'success' ? '성공적으로 완료되었습니다' : '실패했습니다'}.`);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">컨테이너 정보를 불러오는 중 오류가 발생했습니다.</span>
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

      {/* 타임라인 섹션 */}
      <Card className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">성능 타임라인</h2>
        
        {timelineLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">타임라인 데이터 로딩 중...</p>
          </div>
        ) : timelineData?.datapoints && timelineData.datapoints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">시간</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">상태</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">CPU 사용량</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">메모리 사용량</th>
                </tr>
              </thead>
              <tbody>
                {timelineData.datapoints.map((point, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b border-gray-200">{new Date(point.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <span className={`px-2 py-1 rounded text-xs ${
                        point.status === 'operational' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {point.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">{point.cpu_usage.toFixed(2)}%</td>
                    <td className="py-2 px-4 border-b border-gray-200">{point.memory_usage} MB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500">타임라인 데이터가 없습니다.</p>
          </div>
        )}
      </Card>
    </div>
  );
}; 