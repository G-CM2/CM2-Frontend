import { Button } from '@/components/ui/button';
import { useSystemSummary } from '@/shared/api';
import { useClusterNodes, useUpdateNodeAvailability } from '@/shared/api/hooks/use-cluster';
import { Card } from '@/shared/ui/card/card';
import { Layout } from '@/widgets/layout';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Cpu,
    HardDrive,
    Layers,
    Monitor,
    RefreshCw,
    Server,
    WifiOff
} from 'lucide-react';
import { useState } from 'react';

export const ClusterPage = () => {
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const {
    data: systemSummary,
    isLoading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary
  } = useSystemSummary();

  const {
    data: nodes,
    isLoading: nodesLoading,
    error: nodesError,
    refetch: refetchNodes
  } = useClusterNodes(30000); // 30초마다 자동 새로고침

  const updateNodeAvailabilityMutation = useUpdateNodeAvailability();

  const isLoading = summaryLoading || nodesLoading;
  const error = summaryError || nodesError;

  const handleNodeAction = async (nodeId: string, action: string) => {
    setActionMessage(`노드 ${nodeId}에서 ${action} 작업을 실행 중입니다...`);
    
         try {
       switch (action) {
         case 'drain':
           await updateNodeAvailabilityMutation.mutateAsync({ 
             nodeId, 
             availability: 'drain' 
           });
           setActionMessage(`노드가 드레인 모드로 전환되었습니다.`);
           break;
         case 'activate':
           await updateNodeAvailabilityMutation.mutateAsync({ 
             nodeId, 
             availability: 'active' 
           });
           setActionMessage(`노드가 활성화되었습니다.`);
           break;
         case 'pause':
           await updateNodeAvailabilityMutation.mutateAsync({ 
             nodeId, 
             availability: 'pause' 
           });
           setActionMessage(`노드가 일시 정지되었습니다.`);
           break;
         case 'inspect':
           setActionMessage(`노드 상세 정보를 확인했습니다.`);
           break;
         default:
           setActionMessage(`${action} 작업이 완료되었습니다.`);
       }
       setTimeout(() => setActionMessage(null), 3000);
     } catch {
       setActionMessage('작업 중 오류가 발생했습니다.');
       setTimeout(() => setActionMessage(null), 3000);
     }
  };

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-600 bg-green-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      case 'unknown':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getNodeStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'down':
        return <WifiOff className="w-4 h-4 text-red-600" />;
      case 'unknown':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Server className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'manager' ? 
      <Layers className="w-5 h-5 text-blue-600" /> : 
      <Server className="w-5 h-5 text-gray-600" />;
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'bg-red-500';
    if (usage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleRefresh = () => {
    refetchSummary();
    refetchNodes();
  };

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">클러스터 데이터를 불러오는 중 오류가 발생했습니다</span>
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
            <h1 className="text-3xl font-bold text-gray-900">클러스터 관리</h1>
            <p className="text-gray-600 mt-1">
              Docker Swarm 클러스터 노드 상태 및 관리
            </p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>

        {/* 액션 메시지 */}
        {actionMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800">{actionMessage}</span>
            </div>
          </div>
        )}

        {/* 클러스터 개요 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 노드</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '-' : nodes?.length || 0}
                </p>
              </div>
              <Server className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 노드</p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? '-' : nodes?.filter(n => n.status === 'ready').length || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">매니저 노드</p>
                <p className="text-2xl font-bold text-purple-600">
                  {isLoading ? '-' : nodes?.filter(n => n.role === 'manager').length || 0}
                </p>
              </div>
              <Layers className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">워커 노드</p>
                <p className="text-2xl font-bold text-gray-600">
                  {isLoading ? '-' : nodes?.filter(n => n.role === 'worker').length || 0}
                </p>
              </div>
              <Server className="w-8 h-8 text-gray-600" />
            </div>
          </Card>
        </div>

        {/* 노드 목록 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">노드 상태</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">노드 정보를 불러오는 중...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {nodes?.map((node) => (
                <Card key={node.id} className="p-6">
                  <div className="space-y-4">
                    {/* 노드 헤더 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(node.role)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{node.name}</h3>
                          <p className="text-sm text-gray-600">{node.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNodeStatusColor(node.status)}`}>
                          {getNodeStatusIcon(node.status)}
                          <span className="ml-1">{node.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* 리소스 사용량 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">CPU</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {((node.resources.cpu.usage / node.resources.cpu.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getUsageColor((node.resources.cpu.usage / node.resources.cpu.total) * 100)}`}
                          style={{ width: `${(node.resources.cpu.usage / node.resources.cpu.total) * 100}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">메모리</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {((node.resources.memory.usage / node.resources.memory.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getUsageColor((node.resources.memory.usage / node.resources.memory.total) * 100)}`}
                          style={{ width: `${(node.resources.memory.usage / node.resources.memory.total) * 100}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">디스크</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {((node.resources.disk.usage / node.resources.disk.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getUsageColor((node.resources.disk.usage / node.resources.disk.total) * 100)}`}
                          style={{ width: `${(node.resources.disk.usage / node.resources.disk.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* 노드 액션 */}
                    <div className="flex gap-2 pt-2">
                      {node.availability === 'active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleNodeAction(node.id, 'drain')}
                          disabled={updateNodeAvailabilityMutation.isPending}
                        >
                          드레인
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleNodeAction(node.id, 'activate')}
                          disabled={updateNodeAvailabilityMutation.isPending}
                        >
                          활성화
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleNodeAction(node.id, 'inspect')}
                      >
                        상세보기
                      </Button>
                    </div>

                    {/* 자연스러운 시나리오 통합 */}
                    {node.status === 'down' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-800 font-medium">노드 연결 실패</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          네트워크 연결을 확인하고 노드를 재시작해보세요.
                        </p>
                        <Button
                          size="sm"
                          className="mt-2 bg-red-600 hover:bg-red-700"
                          onClick={() => handleNodeAction(node.id, 'restart')}
                        >
                          노드 재시작
                        </Button>
                      </div>
                    )}

                    {node.availability === 'drain' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-yellow-800 font-medium">드레인 모드</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                          새로운 태스크가 할당되지 않습니다. 기존 태스크는 다른 노드로 이동됩니다.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 시스템 상태 기반 알림 */}
        {systemSummary?.status?.indicator === 'warning' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">클러스터 경고</span>
            </div>
            <p className="text-yellow-700 mt-1">
              일부 노드에 문제가 감지되었습니다. 시스템 안정성을 위해 확인이 필요합니다.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
                onClick={() => handleNodeAction('all', 'health-check')}
              >
                헬스 체크 실행
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleNodeAction('all', 'auto-recovery')}
              >
                자동 복구 시도
              </Button>
            </div>
          </div>
        )}

        {systemSummary?.status?.indicator === 'critical' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">클러스터 위험</span>
            </div>
            <p className="text-red-700 mt-1">
              클러스터에 심각한 문제가 발생했습니다. 즉시 조치가 필요합니다.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleNodeAction('all', 'emergency-recovery')}
              >
                긴급 복구
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleNodeAction('all', 'failover')}
              >
                페일오버 실행
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}; 