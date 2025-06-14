import { ContainerActionButton } from '@/features/container-control';
import { useContainer } from '@/shared/api';
import { Card } from '@/shared/ui/card/card';
import { Layout } from '@/widgets/layout';
import { Link, useParams } from 'react-router-dom';

export const ContainerDetailsPage = () => {
  const { containerId = '' } = useParams<{ containerId: string }>();

  const {
    data: container,
    isLoading,
    error
  } = useContainer(containerId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-500 bg-green-100 border-green-300';
      case 'stopped':
        return 'text-red-500 bg-red-100 border-red-300';
      case 'paused':
        return 'text-yellow-500 bg-yellow-100 border-yellow-300';
      default:
        return 'text-gray-500 bg-gray-100 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">컨테이너 정보를 불러오는 중 오류가 발생했습니다.</p>
            <Link to="/containers" className="text-blue-600 hover:underline mt-2 inline-block">
              컨테이너 목록으로 돌아가기  
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!container) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">컨테이너를 찾을 수 없습니다.</p>
            <Link to="/containers" className="text-blue-600 hover:underline mt-2 inline-block">
              컨테이너 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">컨테이너: {container.name}</h1>
            <span className={`px-3 py-1 rounded-full ${getStatusColor(container.status)} bg-opacity-20 border border-current`}>
              {container.status}
            </span>
          </div>
          <Link to="/containers" className="text-blue-600 hover:underline">
            ← 목록으로 돌아가기
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <Card title="기본 정보">
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">컨테이너 ID</span>
                <p className="font-mono text-sm">{container.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">이미지</span>
                <p>{container.image}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">생성 시간</span>
                <p>{new Date(container.created_at).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">재시작 횟수</span>
                <p>{container.restart_count}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">상태</span>
                <p className={container.health === 'healthy' ? 'text-green-500' : 'text-red-500'}>
                  {container.health}
                </p>
              </div>
            </div>
          </Card>

          {/* 로그 */}
          {container.logs && (
            <Card title="로그">
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">{container.logs}</pre>
            </Card>
          )}

                     {/* 컨테이너 작업 */}
           <Card title="컨테이너 작업">
             <div className="grid grid-cols-2 gap-2">
               <ContainerActionButton
                 containerId={container.id}
                 action="start"
                 label="시작"
                 variant="primary"
               />
               <ContainerActionButton
                 containerId={container.id}
                 action="stop"
                 label="중지"
                 variant="danger"
               />
               <ContainerActionButton
                 containerId={container.id}
                 action="restart"
                 label="재시작"
                 variant="secondary"
               />
               <ContainerActionButton
                 containerId={container.id}
                 action="pause"
                 label="일시정지"
                 variant="secondary"
               />
               <ContainerActionButton
                 containerId={container.id}
                 action="unpause"
                 label="재개"
                 variant="primary"
               />
             </div>
           </Card>

          {/* 볼륨 마운트 */}
          {container.volumes && container.volumes.length > 0 && (
            <Card title="볼륨 마운트">
              <div className="space-y-2">
                {container.volumes.map((volume, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-mono">{volume.source}</span>
                    <span className="mx-2">→</span>
                    <span className="font-mono">{volume.target}</span>
                    {index < container.volumes!.length - 1 && <hr className="my-2" />}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 환경 변수 */}
          {container.environment && container.environment.length > 0 && (
            <Card title="환경 변수">
              <div className="space-y-2">
                {container.environment.map((env, index) => (
                  <div key={index} className="text-sm font-mono">
                    <span className="text-blue-600">{env.key}</span>=<span>{env.value}</span>
                    {index < container.environment!.length - 1 && <hr className="my-2" />}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 리소스 사용량 */}
          <Card title="리소스 사용량">
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">CPU 사용률</span>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${container.cpu_usage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{container.cpu_usage}%</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">메모리 사용률</span>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${container.memory_usage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{container.memory_usage}%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 포트 매핑 */}
          {container.ports && container.ports.length > 0 && (
            <Card title="포트 매핑">
              <div className="space-y-2">
                {container.ports.map((port, index) => (
                  <div key={index} className="text-sm font-mono">
                    <span className="text-blue-600">{port.external}</span>
                    <span className="mx-2">→</span>
                    <span>{port.internal}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}; 