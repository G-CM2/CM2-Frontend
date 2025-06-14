import { Button } from '@/components/ui/button';
import {
    useClusterHealth,
    useClusterNodes,
    useClusterStatus,
    useDrainNode,
    useSimulateFailure
} from '@/shared/api/hooks/use-cluster';
import { Card } from '@/shared/ui/card/card';
import { Layout } from '@/widgets/layout';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Crown,
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
    data: clusterHealth,
    isLoading: healthLoading,
    error: healthError,
    refetch: refetchHealth
  } = useClusterHealth();

  const {
    data: clusterNodes,
    isLoading: nodesLoading,
    error: nodesError,
    refetch: refetchNodes
  } = useClusterNodes();

  const {
    data: clusterStatus,
    isLoading: statusLoading,
    error: statusError,
    refetch: refetchStatus
  } = useClusterStatus();

  const drainNodeMutation = useDrainNode();
  const simulateFailureMutation = useSimulateFailure();

  const isLoading = healthLoading || nodesLoading || statusLoading;
  const error = healthError || nodesError || statusError;

  const handleNodeAction = async (nodeId: string, action: string) => {
    setActionMessage(`노드 ${nodeId}에서 ${action} 작업을 실행 중입니다...`);
    
    try {
      switch (action) {
        case 'drain':
          await drainNodeMutation.mutateAsync(nodeId);
          setActionMessage(`노드가 드레인 모드로 전환되었습니다.`);
          break;
        case 'activate':
          await simulateFailureMutation.mutateAsync({ 
            nodeId, 
            failureType: 'activate' 
          });
          setActionMessage(`노드가 활성화되었습니다.`);
          break;
        case 'simulate-drain':
          await simulateFailureMutation.mutateAsync({ 
            nodeId, 
            failureType: 'drain' 
          });
          setActionMessage(`노드 드레인 시뮬레이션이 실행되었습니다.`);
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
      case 'Ready':
        return 'text-green-600 bg-green-100';
      case 'Down':
        return 'text-red-600 bg-red-100';
      case 'Unknown':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getNodeStatusIcon = (status: string) => {
    switch (status) {
      case 'Ready':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Down':
        return <WifiOff className="w-4 h-4 text-red-600" />;
      case 'Unknown':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Server className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'Pause':
        return 'text-yellow-600 bg-yellow-100';
      case 'Drain':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleIcon = (managerStatus: string) => {
    if (managerStatus === 'Leader') {
      return <Crown className="w-5 h-5 text-yellow-600" />;
    } else if (managerStatus === 'Reachable') {
      return <Layers className="w-5 h-5 text-blue-600" />;
    }
    return <Server className="w-5 h-5 text-gray-600" />;
  };

  const handleRefresh = () => {
    refetchHealth();
    refetchNodes();
    refetchStatus();
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

        {/* 클러스터 헬스 개요 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 노드</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '-' : clusterHealth?.totalNodes || 0}
                </p>
              </div>
              <Server className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 매니저</p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? '-' : clusterHealth?.activeManagers || 0}
                </p>
              </div>
              <Crown className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">연결 불가 노드</p>
                <p className="text-2xl font-bold text-red-600">
                  {isLoading ? '-' : clusterHealth?.unreachableNodes || 0}
                </p>
              </div>
              <WifiOff className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        {/* 클러스터 상태 정보 */}
        {clusterStatus && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">클러스터 상태</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">클러스터 ID</p>
                <p className="text-sm text-gray-900 font-mono">{clusterStatus.clusterID}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">이름</p>
                <p className="text-sm text-gray-900">{clusterStatus.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">오케스트레이션</p>
                <p className="text-sm text-gray-900">{clusterStatus.orchestration}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Raft 상태</p>
                <p className="text-sm text-gray-900">{clusterStatus.raftStatus}</p>
              </div>
            </div>
          </Card>
        )}

        {/* 노드 목록 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">노드 목록</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">노드 정보를 불러오는 중...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {clusterNodes?.nodes.map((node) => (
                <div key={node.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getRoleIcon(node.managerStatus)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{node.hostname}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNodeStatusColor(node.status)}`}>
                            {getNodeStatusIcon(node.status)}
                            <span className="ml-1">{node.status}</span>
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(node.availability)}`}>
                            {node.availability}
                          </span>
                          {node.managerStatus && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {node.managerStatus}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 font-mono">{node.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleNodeAction(node.id, 'inspect')}
                      >
                        <Monitor className="w-4 h-4 mr-1" />
                        검사
                      </Button>
                      
                      {node.availability === 'Active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleNodeAction(node.id, 'drain')}
                          disabled={drainNodeMutation.isPending}
                        >
                          <WifiOff className="w-4 h-4 mr-1" />
                          드레인
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleNodeAction(node.id, 'activate')}
                          disabled={simulateFailureMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          활성화
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleNodeAction(node.id, 'simulate-drain')}
                        disabled={simulateFailureMutation.isPending}
                      >
                        <Activity className="w-4 h-4 mr-1" />
                        시뮬레이션
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {clusterNodes?.nodes.length === 0 && (
                <div className="text-center py-8">
                  <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">등록된 노드가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}; 