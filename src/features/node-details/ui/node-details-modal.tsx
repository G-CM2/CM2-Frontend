import React from 'react';
import { Node } from '@/entities/node';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Server, HardDrive, Cpu, MemoryStick, Network, Calendar, Tag } from 'lucide-react';

interface NodeDetailsModalProps {
  node: Node | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatBytes = (bytes: number): string => {
  return `${(bytes / 1024).toFixed(1)} GB`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ko-KR');
};

const getStatusBadgeVariant = (status: Node['status']) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'inactive':
      return 'secondary';
    case 'failed':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getAvailabilityBadgeVariant = (availability: Node['availability']) => {
  switch (availability) {
    case 'active':
      return 'default';
    case 'pause':
      return 'secondary';
    case 'drain':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const NodeDetailsModal: React.FC<NodeDetailsModalProps> = ({
  node,
  open,
  onOpenChange
}) => {
  if (!node) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {node.role === 'manager' ? (
              <Server className="w-5 h-5 text-blue-600" />
            ) : (
              <HardDrive className="w-5 h-5 text-purple-600" />
            )}
            {node.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">노드 ID</label>
                  <p className="text-sm font-mono">{node.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">호스트명</label>
                  <p className="text-sm">{node.hostname}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">IP 주소</label>
                  <p className="text-sm font-mono flex items-center gap-1">
                    <Network className="w-4 h-4" />
                    {node.ip}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Docker 엔진</label>
                  <p className="text-sm">{node.engineVersion}</p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">역할</label>
                  <div className="mt-1">
                    <Badge variant={node.role === 'manager' ? 'default' : 'secondary'}>
                      {node.role}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">상태</label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(node.status)}>
                      {node.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">가용성</label>
                  <div className="mt-1">
                    <Badge variant={getAvailabilityBadgeVariant(node.availability)}>
                      {node.availability}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">리소스</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Cpu className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{node.resources.cpus}</p>
                  <p className="text-sm text-gray-600">CPUs</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <MemoryStick className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {formatBytes(node.resources.memory)}
                  </p>
                  <p className="text-sm text-gray-600">메모리</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <HardDrive className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{node.resources.disk} GB</p>
                  <p className="text-sm text-gray-600">디스크</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Labels */}
          {Object.keys(node.labels).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  라벨
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(node.labels).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key}: {value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                타임스탬프
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">생성일</label>
                <p className="text-sm">{formatDate(node.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">마지막 업데이트</label>
                <p className="text-sm">{formatDate(node.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 