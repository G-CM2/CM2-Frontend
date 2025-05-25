import React, { useState, useEffect } from 'react';
import { Node, ClusterTopology, fetchClusterTopology, NodeCard, ConnectionLine } from '@/entities/node';
import { NodeDetailsModal } from '@/features/node-details';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Network, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClusterTopologyViewProps {
  className?: string;
}

export const ClusterTopologyView: React.FC<ClusterTopologyViewProps> = ({ className }) => {
  const [topology, setTopology] = useState<ClusterTopology | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showNodeDetails, setShowNodeDetails] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadTopology = async () => {
    setLoading(true);
    try {
      const data = await fetchClusterTopology();
      setTopology(data);
      setLastUpdated(new Date().toLocaleTimeString('ko-KR'));
    } catch (error) {
      console.error('Failed to load cluster topology:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopology();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadTopology, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setShowNodeDetails(true);
  };

  const getClusterStats = () => {
    if (!topology) return { total: 0, managers: 0, workers: 0, active: 0, failed: 0 };
    
    const total = topology.nodes.length;
    const managers = topology.nodes.filter(node => node.role === 'manager').length;
    const workers = topology.nodes.filter(node => node.role === 'worker').length;
    const active = topology.nodes.filter(node => node.status === 'active').length;
    const failed = topology.nodes.filter(node => node.status === 'failed').length;
    
    return { total, managers, workers, active, failed };
  };

  const stats = getClusterStats();

  if (loading && !topology) {
    return (
      <Card className={cn('w-full h-[600px] flex items-center justify-center', className)}>
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>클러스터 토폴로지를 로딩 중...</span>
        </div>
      </Card>
    );
  }

  if (!topology) {
    return (
      <Card className={cn('w-full h-[600px] flex items-center justify-center', className)}>
        <div className="text-center">
          <p className="text-gray-500 mb-4">클러스터 토폴로지를 로드할 수 없습니다.</p>
          <Button onClick={loadTopology} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with stats */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              클러스터 토폴로지
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                마지막 업데이트: {lastUpdated}
              </span>
              <Button
                onClick={loadTopology}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">전체 노드: {stats.total}</Badge>
              <Badge variant="default">매니저: {stats.managers}</Badge>
              <Badge variant="secondary">워커: {stats.workers}</Badge>
              <Badge variant="default" className="bg-green-100 text-green-800">
                활성: {stats.active}
              </Badge>
              {stats.failed > 0 && (
                <Badge variant="destructive">장애: {stats.failed}</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topology visualization */}
      <Card>
        <CardContent className="p-6">
          <div className="relative w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden">
            {/* SVG for connections */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 1 }}
            >
              {topology.connections.map((connection, index) => (
                <ConnectionLine
                  key={`${connection.from}-${connection.to}-${index}`}
                  connection={connection}
                  nodes={topology.nodes}
                />
              ))}
            </svg>

            {/* Nodes */}
            <div className="relative w-full h-full" style={{ zIndex: 2 }}>
              {topology.nodes.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  onClick={handleNodeClick}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border" style={{ zIndex: 3 }}>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                범례
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>활성 노드</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>비활성 노드</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>장애 노드</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-blue-400"></div>
                  <span>관리 연결</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-purple-400 border-dashed border-t-2 border-purple-400"></div>
                  <span>데이터 연결</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Node details modal */}
      <NodeDetailsModal
        node={selectedNode}
        open={showNodeDetails}
        onOpenChange={setShowNodeDetails}
      />
    </div>
  );
}; 