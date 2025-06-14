import { Button } from '@/components/ui/button';
import { useSystemSummary } from '@/shared/api';
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
    Network,
    RefreshCw,
    Server,
    WifiOff
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Docker Swarm 노드 인터페이스
interface SwarmNode {
  id: string;
  hostname: string;
  role: 'manager' | 'worker';
  status: 'ready' | 'down' | 'unknown';
  availability: 'active' | 'pause' | 'drain';
  address: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
  usage: {
    cpu: number;
    memory: number;
    disk: number;
  };
  labels: Record<string, string>;
  version: string;
}

export const ClusterPage = () => {
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [nodes, setNodes] = useState<SwarmNode[]>([]);

  const {
    data: systemSummary,
    isLoading,
    error,
    refetch
  } = useSystemSummary();

  // 모의 노드 데이터 생성
  useEffect(() => {
    const mockNodes: SwarmNode[] = [
      {
        id: 'node-manager-1',
        hostname: 'swarm-manager-01',
        role: 'manager',
        status: 'ready',
        availability: 'active',
        address: '192.168.1.10',
        resources: { cpu: 4, memory: 8192, disk: 100 },
        usage: { cpu: 45.2, memory: 62.8, disk: 35.5 },
        labels: { 'node.role': 'manager', 'zone': 'us-west-1a' },
        version: '20.10.17'
      },
      {
        id: 'node-worker-1',
        hostname: 'swarm-worker-01',
        role: 'worker',
        status: 'ready',
        availability: 'active',
        address: '192.168.1.11',
        resources: { cpu: 2, memory: 4096, disk: 50 },
        usage: { cpu: 28.7, memory: 41.3, disk: 22.1 },
        labels: { 'node.role': 'worker', 'zone': 'us-west-1b' },
        version: '20.10.17'
      },
      {
        id: 'node-worker-2',
        hostname: 'swarm-worker-02',
        role: 'worker',
        status: 'ready',
        availability: 'active',
        address: '192.168.1.12',
        resources: { cpu: 2, memory: 4096, disk: 50 },
        usage: { cpu: 15.4, memory: 33.9, disk: 18.7 },
        labels: { 'node.role': 'worker', 'zone': 'us-west-1c' },
        version: '20.10.17'
      }
    ];

    // 시나리오 기반 상태 변경
    if (systemSummary?.status?.indicator === 'warning') {
      mockNodes[2].status = 'down';
      mockNodes[2].availability = 'drain';
    } else if (systemSummary?.status?.indicator === 'critical') {
      mockNodes[1].status = 'unknown';
      mockNodes[2].status = 'down';
    }

    setNodes(mockNodes);
  }, [systemSummary]);

  const handleNodeAction = (nodeId: string, action: string) => {
    setActionMessage(`노드 ${nodeId}에서 ${action} 작업을 실행 중입니다...`);
    
    setTimeout(() => {
      switch (action) {
        case 'drain':
          setActionMessage(`노드가 드레인 모드로 전환되었습니다.`);
          break;
        case 'activate':
          setActionMessage(`노드가 활성화되었습니다.`);
          break;
        case 'inspect':
          setActionMessage(`노드 상세 정보를 확인했습니다.`);
          break;
        default:
          setActionMessage(`${action} 작업이 완료되었습니다.`);
      }
      setTimeout(() => setActionMessage(null), 3000);
    }, 2000);
  };

  const getNodeStatusColor = (status: SwarmNode['status']) => {
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

  const getNodeStatusIcon = (status: SwarmNode['status']) => {
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

  const getRoleIcon = (role: SwarmNode['role']) => {
    return role === 'manager' ? 
      <Layers className="w-5 h-5 text-blue-600" /> : 
      <Server className="w-5 h-5 text-gray-600" />;
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'bg-red-500';
    if (usage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
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
            onClick={() => refetch()}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">총 노드</p>
                <p className="text-2xl font-bold text-blue-600">
                  {nodes.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">활성 노드</p>
                <p className="text-2xl font-bold text-green-600">
                  {nodes.filter(n => n.status === 'ready').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Server className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">매니저 노드</p>
                <p className="text-2xl font-bold text-purple-600">
                  {nodes.filter(n => n.role === 'manager').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Network className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">클러스터 상태</p>
                <p className="text-2xl font-bold text-orange-600">
                  {systemSummary?.status?.indicator === 'normal' ? '정상' : '점검 필요'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 노드 목록 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">클러스터 노드</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
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
              {nodes.map((node) => (
                <Card key={node.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    {/* 노드 헤더 */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getRoleIcon(node.role)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{node.hostname}</h3>
                          <p className="text-sm text-gray-500">{node.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">역할:</span>
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                              node.role === 'manager' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {node.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getNodeStatusColor(node.status)}`}>
                        {getNodeStatusIcon(node.status)}
                        {node.status}
                      </div>
                    </div>

                    {/* 리소스 사용량 */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-gray-700">CPU</span>
                          </div>
                          <span className="text-sm text-gray-600">{node.usage.cpu.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(node.usage.cpu)}`}
                            style={{ width: `${node.usage.cpu}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">메모리</span>
                          </div>
                          <span className="text-sm text-gray-600">{node.usage.memory.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(node.usage.memory)}`}
                            style={{ width: `${node.usage.memory}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <HardDrive className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">디스크</span>
                          </div>
                          <span className="text-sm text-gray-600">{node.usage.disk.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(node.usage.disk)}`}
                            style={{ width: `${node.usage.disk}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* 노드 정보 */}
                    <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 rounded-lg p-3">
                      <div>
                        <span className="font-medium text-gray-700">가용성:</span>
                        <div className="text-gray-600 mt-1">
                          <span className={`px-2 py-1 rounded text-xs ${
                            node.availability === 'active' ? 'bg-green-100 text-green-700' :
                            node.availability === 'drain' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {node.availability}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">버전:</span>
                        <div className="text-gray-600 mt-1 text-xs">{node.version}</div>
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 pt-2 border-t">
                      {node.status === 'ready' && node.availability === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleNodeAction(node.hostname, 'drain')}
                          className="flex items-center gap-1 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          드레인
                        </Button>
                      )}
                      {node.availability === 'drain' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleNodeAction(node.hostname, 'activate')}
                          className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <CheckCircle className="w-3 h-3" />
                          활성화
                        </Button>
                      )}
                      {node.status === 'down' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <WifiOff className="w-3 h-3" />
                          연결 끊김
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleNodeAction(node.hostname, 'inspect')}
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

        {/* 클러스터 상태 알림 */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">클러스터 상태</h3>
          <div className="space-y-2">
            {nodes.filter(n => n.status === 'down').length > 0 && (
              <div className="flex items-start gap-2 p-2 bg-red-50 rounded">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="font-medium text-red-800">
                    {nodes.filter(n => n.status === 'down').length}개 노드가 오프라인 상태입니다
                  </div>
                  <div className="text-red-600 text-sm">클러스터 안정성에 영향을 줄 수 있습니다</div>
                </div>
              </div>
            )}
            {nodes.filter(n => n.status === 'unknown').length > 0 && (
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="font-medium text-yellow-800">
                    {nodes.filter(n => n.status === 'unknown').length}개 노드의 상태를 확인할 수 없습니다
                  </div>
                  <div className="text-yellow-600 text-sm">네트워크 연결을 확인하세요</div>
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
                  {nodes.filter(n => n.status === 'ready').length}개 노드가 활성 상태입니다
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}; 