# 🚀 개발 가이드라인 - Docker 컨테이너 관리 대시보드

이 문서는 `ARCHITECTURE_PROMPT.md`에서 정의된 데이터 구조를 실제 개발에 적용하는 방법을 안내합니다.

## 📋 개발 원칙

### 1. 엔티티별 책임 분리
```typescript
// ❌ 잘못된 예 - 혼재된 책임
interface BadContainerData {
  containerId: string;
  clusterHealth: string;    // 클러스터 레벨 데이터
  serviceReplicas: number;  // 서비스 레벨 데이터
  nodeStatus: string;       // 노드 레벨 데이터
}

// ✅ 올바른 예 - 명확한 책임 분리
interface Container {
  id: string;
  serviceId: string;  // 관계만 참조
  nodeId: string;     // 관계만 참조
  status: ContainerStatus;
  resources: ContainerResources;
}
```

### 2. 계층적 데이터 흐름
```typescript
// 데이터 흐름: 클러스터 → 노드 → 서비스 → 컨테이너
const fetchDashboardData = async () => {
  // 1. 클러스터 상태 먼저 확인
  const clusterStatus = await clusterApi.getClusterStatus();
  
  // 2. 노드 정보 조회
  const nodes = await clusterApi.getNodes();
  
  // 3. 서비스 목록 조회
  const services = await servicesApi.getServices();
  
  // 4. 컨테이너 세부 정보 조회
  const containers = await containersApi.getContainers();
  
  return {
    cluster: clusterStatus,
    nodes,
    services,
    containers
  };
};
```

## 🔄 상태 관리 패턴

### 1. 엔티티별 상태 구조
```typescript
// 전역 상태 구조
interface AppState {
  cluster: {
    status: ClusterStatus | null;
    health: ClusterHealth | null;
    loading: boolean;
    error: string | null;
  };
  nodes: {
    items: Node[];
    topology: ClusterTopology | null;
    loading: boolean;
    error: string | null;
  };
  services: {
    items: Service[];
    deployments: ServiceDeployment[];
    loading: boolean;
    error: string | null;
  };
  containers: {
    items: Container[];
    healthChecks: ContainerHealth[];
    loading: boolean;
    error: string | null;
  };
}
```

### 2. 관계 데이터 계산
```typescript
// 파생 데이터 계산 (React Query + 셀렉터 패턴)
const useServiceContainers = (serviceId: string) => {
  const { data: containers } = useContainers();
  
  return useMemo(() => 
    containers?.filter(container => container.serviceId === serviceId) || [],
    [containers, serviceId]
  );
};

const useNodeContainers = (nodeId: string) => {
  const { data: containers } = useContainers();
  
  return useMemo(() => 
    containers?.filter(container => container.nodeId === nodeId) || [],
    [containers, nodeId]
  );
};

const useClusterSummary = () => {
  const { data: nodes } = useNodes();
  const { data: services } = useServices();
  const { data: containers } = useContainers();
  
  return useMemo(() => ({
    totalNodes: nodes?.length || 0,
    activeNodes: nodes?.filter(n => n.status === 'active').length || 0,
    totalServices: services?.length || 0,
    runningServices: services?.filter(s => s.status === 'running').length || 0,
    totalContainers: containers?.length || 0,
    runningContainers: containers?.filter(c => c.status === 'running').length || 0,
  }), [nodes, services, containers]);
};
```

## 🎨 UI 컴포넌트 패턴

### 1. 계층별 컴포넌트 구조
```
widgets/
├── cluster-overview/           # 클러스터 전체 개요
├── node-topology/             # 노드 토폴로지 시각화
├── service-dashboard/         # 서비스 관리 대시보드
└── container-monitor/         # 컨테이너 모니터링

features/
├── cluster-management/        # 클러스터 관리 기능
├── service-deployment/        # 서비스 배포 기능
├── container-operations/      # 컨테이너 작업 기능
└── monitoring-alerts/         # 모니터링 및 알림
```

### 2. 상태 기반 UI 렌더링
```typescript
// 서비스 상태에 따른 UI 표시
const ServiceStatusBadge: React.FC<{ service: Service }> = ({ service }) => {
  const containers = useServiceContainers(service.id);
  const runningCount = containers.filter(c => c.status === 'running').length;
  
  const getStatusInfo = () => {
    if (service.status === 'failed') {
      return { color: 'red', text: 'Failed' };
    }
    if (runningCount < (service.replicas || 0)) {
      return { color: 'yellow', text: `${runningCount}/${service.replicas} Running` };
    }
    return { color: 'green', text: 'Healthy' };
  };
  
  const { color, text } = getStatusInfo();
  
  return (
    <Badge className={`bg-${color}-100 text-${color}-800`}>
      {text}
    </Badge>
  );
};
```

## 📊 데이터 검증 및 일관성

### 1. 타입 가드 함수
```typescript
// 데이터 무결성 검증
const validateServiceData = (service: unknown): service is Service => {
  if (typeof service !== 'object' || service === null) return false;
  
  const s = service as Service;
  return (
    typeof s.id === 'string' &&
    typeof s.name === 'string' &&
    typeof s.image === 'string' &&
    ['replicated', 'global'].includes(s.mode) &&
    ['pending', 'running', 'complete', 'shutdown', 'failed'].includes(s.status)
  );
};

// API 응답 검증
const validateApiResponse = <T>(data: unknown, validator: (item: unknown) => item is T): T[] => {
  if (!Array.isArray(data)) return [];
  return data.filter(validator);
};
```

### 2. 일관성 체크 함수
```typescript
// 서비스와 컨테이너 일관성 체크
const checkServiceContainerConsistency = (service: Service, containers: Container[]) => {
  const serviceContainers = containers.filter(c => c.serviceId === service.id);
  const runningContainers = serviceContainers.filter(c => c.status === 'running');
  
  return {
    expectedReplicas: service.replicas || 0,
    actualReplicas: serviceContainers.length,
    runningReplicas: runningContainers.length,
    isConsistent: serviceContainers.length === (service.replicas || 0)
  };
};

// 노드 리소스 일관성 체크
const checkNodeResourceConsistency = (node: Node, containers: Container[]) => {
  const nodeContainers = containers.filter(c => c.nodeId === node.id);
  const totalCpuUsage = nodeContainers.reduce((sum, c) => sum + c.resources.cpu, 0);
  const totalMemoryUsage = nodeContainers.reduce((sum, c) => sum + c.resources.memory, 0);
  
  return {
    availableCpu: node.resources.cpus - totalCpuUsage,
    availableMemory: node.resources.memory - totalMemoryUsage,
    cpuUtilization: (totalCpuUsage / node.resources.cpus) * 100,
    memoryUtilization: (totalMemoryUsage / node.resources.memory) * 100
  };
};
```

## 🔍 검색 및 필터링

### 1. 다중 레벨 검색
```typescript
// 통합 검색 함수
const useGlobalSearch = (query: string) => {
  const { data: services } = useServices();
  const { data: containers } = useContainers();
  const { data: nodes } = useNodes();
  
  return useMemo(() => {
    if (!query.trim()) return { services: [], containers: [], nodes: [] };
    
    const searchTerm = query.toLowerCase();
    
    return {
      services: services?.filter(s => 
        s.name.toLowerCase().includes(searchTerm) ||
        s.image.toLowerCase().includes(searchTerm)
      ) || [],
      containers: containers?.filter(c => 
        c.name.toLowerCase().includes(searchTerm) ||
        c.image.toLowerCase().includes(searchTerm)
      ) || [],
      nodes: nodes?.filter(n => 
        n.name.toLowerCase().includes(searchTerm) ||
        n.hostname.toLowerCase().includes(searchTerm)
      ) || []
    };
  }, [query, services, containers, nodes]);
};
```

### 2. 상태 기반 필터링
```typescript
// 상태별 필터링 훅
const useServiceFilters = () => {
  const { data: services } = useServices();
  
  return useMemo(() => ({
    all: services || [],
    running: services?.filter(s => s.status === 'running') || [],
    failed: services?.filter(s => s.status === 'failed') || [],
    pending: services?.filter(s => s.status === 'pending') || [],
    byNode: (nodeId: string) => services?.filter(s => 
      s.constraints.some(c => c.includes(nodeId))
    ) || []
  }), [services]);
};
```

## 🚨 에러 처리 및 예외 상황

### 1. 계층별 에러 처리
```typescript
// 에러 타입 정의
interface ApiError {
  level: 'cluster' | 'node' | 'service' | 'container';
  message: string;
  code: string;
  timestamp: string;
  affectedResources: string[];
}

// 에러 처리 훅
const useErrorHandler = () => {
  const handleApiError = (error: ApiError) => {
    switch (error.level) {
      case 'cluster':
        // 클러스터 레벨 에러 - 전체 시스템 알림
        toast.error(`클러스터 에러: ${error.message}`);
        break;
      case 'node':
        // 노드 레벨 에러 - 해당 노드 관련 기능 비활성화
        toast.warning(`노드 ${error.affectedResources[0]} 에러: ${error.message}`);
        break;
      case 'service':
        // 서비스 레벨 에러 - 서비스 상태 업데이트
        toast.info(`서비스 에러: ${error.message}`);
        break;
      case 'container':
        // 컨테이너 레벨 에러 - 개별 컨테이너 표시
        console.warn(`컨테이너 에러: ${error.message}`);
        break;
    }
  };
  
  return { handleApiError };
};
```

## 📈 성능 최적화

### 1. 데이터 캐싱 전략
```typescript
// React Query 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 클러스터 정보는 길게 캐시
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
      // 실시간 데이터는 짧게 캐시
      refetchInterval: (data) => {
        if (data?.type === 'container') return 5000; // 5초
        if (data?.type === 'service') return 15000;  // 15초
        if (data?.type === 'node') return 30000;     // 30초
        return 60000; // 기본 1분
      }
    }
  }
});
```

### 2. 가상화 및 페이지네이션
```typescript
// 대량 데이터 처리를 위한 가상화
const VirtualizedContainerList: React.FC<{ containers: Container[] }> = ({ containers }) => {
  const rowVirtualizer = useVirtualizer({
    count: containers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });
  
  return (
    <div ref={parentRef} className="h-400 overflow-auto">
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ContainerCard container={containers[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

이 가이드라인을 따라 개발하면 데이터 구조의 일관성을 유지하면서 효율적인 Docker 컨테이너 관리 대시보드를 구축할 수 있습니다. 