# 🐳 Docker 컨테이너 관리 대시보드 - 데이터 구조 가이드

이 문서는 Docker Swarm 기반 컨테이너 관리 대시보드의 핵심 데이터 구조와 엔티티 간 관계를 정의합니다.

## 🏗️ 시스템 아키텍처 개요

```
📦 클러스터 (Cluster)
├── 🖥️ 노드 (Node) × N
│   ├── 👑 매니저 노드 (Manager Node) - 클러스터 관리 및 오케스트레이션
│   └── 👷 워커 노드 (Worker Node) - 컨테이너 실행 환경
│
├── 🚀 서비스 (Service) × N
│   ├── 📋 배포 명세 (Deployment Spec)
│   ├── 🔄 레플리카 설정 (Replica Configuration)
│   └── 🌐 네트워크 구성 (Network Configuration)
│
└── 📦 컨테이너 (Container) × N
    ├── 🏃 실행 인스턴스 (Running Instance)
    ├── 📊 리소스 사용량 (Resource Usage)
    └── 🔌 포트 바인딩 (Port Binding)
```

## 🔗 엔티티 관계 정의

### 1. 클러스터 (Cluster) - 최상위 관리 단위

**역할**: Docker Swarm 클러스터 전체를 관리하는 최상위 엔티티
**관계**: 1개 클러스터 → N개 노드, N개 서비스

```typescript
interface ClusterStatus {
  id: string;                    // 클러스터 고유 식별자
  swarmStatus: SwarmStatus;      // 'active' | 'inactive' | 'pending' | 'error'
  nodes: NodeSummary;            // 노드 통계 정보
  services: ServiceSummary;      // 서비스 통계 정보
  version: ClusterVersion;       // 클러스터 버전 정보
}
```

**책임**:
- 전체 인프라 상태 관리
- 노드 간 통신 조율
- 서비스 배포 스케줄링
- 클러스터 레벨 보안 정책

### 2. 노드 (Node) - 물리적 실행 환경

**역할**: 컨테이너가 실제로 실행되는 물리적/가상 서버
**관계**: N개 노드 → 1개 클러스터, N개 컨테이너 호스팅

```typescript
interface Node {
  id: string;                    // 노드 고유 식별자
  role: 'manager' | 'worker';    // 노드 역할
  status: NodeStatus;            // 'active' | 'inactive' | 'draining' | 'unavailable'
  availability: NodeAvailability; // 'active' | 'pause' | 'drain'
  resources: NodeResources;      // CPU, 메모리, 디스크 용량
  labels: Record<string, string>; // 배치 제약 조건용 라벨
  constraints: string[];         // 서비스 배치 제약
}
```

**노드 타입별 역할**:
- **매니저 노드**: 클러스터 관리, API 엔드포인트, 스케줄링 결정
- **워커 노드**: 컨테이너 실행, 태스크 수행

### 3. 서비스 (Service) - 애플리케이션 정의

**역할**: 배포할 애플리케이션의 명세와 실행 정책을 정의
**관계**: N개 서비스 → 1개 클러스터, 1개 서비스 → N개 컨테이너 레플리카

```typescript
interface Service {
  id: string;                    // 서비스 고유 식별자
  name: string;                  // 서비스 이름
  image: string;                 // 컨테이너 이미지
  mode: 'replicated' | 'global'; // 배포 모드
  replicas?: number;             // 레플리카 수 (replicated 모드)
  status: ServiceStatus;         // 서비스 상태
  constraints: string[];         // 노드 배치 제약 조건
  networks: string[];            // 연결된 네트워크
  resources: ServiceResources;   // 리소스 요구사항/제한
  endpoint: ServiceEndpoint;     // 네트워크 엔드포인트 정보
}
```

**서비스 배포 모드**:
- **Replicated**: 지정된 수의 레플리카를 클러스터에 분산 배포
- **Global**: 각 노드마다 하나씩 배포 (데몬셋과 유사)

### 4. 컨테이너 (Container) - 실행 인스턴스

**역할**: 서비스로부터 생성된 실제 실행 인스턴스
**관계**: N개 컨테이너 → 1개 서비스, 1개 컨테이너 → 1개 노드

```typescript
interface Container {
  id: string;                    // 컨테이너 고유 식별자
  name: string;                  // 컨테이너 이름
  serviceId?: string;            // 소속 서비스 ID (서비스에서 생성된 경우)
  nodeId?: string;               // 실행 중인 노드 ID
  image: string;                 // 컨테이너 이미지
  status: ContainerStatus;       // 'running' | 'stopped' | 'paused' | 'failed'
  resources: ContainerResources; // 실제 리소스 사용량
  ports: PortBinding[];          // 포트 바인딩 정보
  health: HealthStatus;          // 헬스체크 상태
}
```

**컨테이너 라이프사이클**:
1. **Pending**: 스케줄링 대기
2. **Pulling**: 이미지 다운로드
3. **Starting**: 컨테이너 시작
4. **Running**: 정상 실행
5. **Failed**: 실행 실패

## 🌐 네트워크 및 통신 관계

### 서비스 간 통신

```typescript
interface ServiceEndpoint {
  virtualIPs: VirtualIP[];       // 가상 IP 주소
  ports: ServicePort[];          // 노출된 포트
  loadBalancing: LoadBalancingConfig; // 로드 밸런싱 설정
}

interface VirtualIP {
  networkID: string;             // 네트워크 ID
  addr: string;                  // IP 주소 (CIDR 표기)
}
```

**통신 흐름**:
1. **클라이언트** → **로드밸런서** (가상 IP)
2. **로드밸런서** → **서비스 레플리카** (라운드로빈/가중치)
3. **서비스 A** → **서비스 B** (서비스 디스커버리)

## 📊 리소스 관리 및 스케줄링

### 리소스 할당 흐름

```
1. 서비스 리소스 요구사항 정의
   ├── resources.limits (최대 사용량)
   └── resources.reservations (보장 사용량)

2. 노드 리소스 용량 확인
   ├── node.resources.cpus
   ├── node.resources.memory
   └── node.resources.disk

3. 스케줄링 알고리즘 적용
   ├── 리소스 여유분 확인
   ├── 배치 제약 조건 검증
   └── 최적 노드 선택

4. 컨테이너 배치 및 실행
```

### 제약 조건(Constraints) 시스템

```typescript
// 서비스 배치 제약 조건 예시
service.constraints = [
  'node.role==worker',           // 워커 노드에만 배치
  'node.labels.storage==ssd',    // SSD 스토리지가 있는 노드
  'node.labels.zone!=us-west'    // 특정 가용영역 제외
];
```

## 🔄 상태 관리 및 모니터링

### 헬스체크 및 자가 치유

```typescript
interface HealthCheck {
  containerId: string;
  status: 'healthy' | 'unhealthy' | 'failed' | 'recovering';
  lastCheck: string;
  failureCount: number;
  restartPolicy: RestartPolicy;
}

interface RestartPolicy {
  condition: 'none' | 'on-failure' | 'any';
  delay: string;                 // 재시작 간격
  maxAttempts: number;           // 최대 재시작 횟수
  window: string;                // 모니터링 윈도우
}
```

## 🎯 사용 시나리오

### 1. 서비스 배포 시나리오
```
사용자 → 서비스 생성 요청 → 클러스터 스케줄러 → 노드 선택 → 컨테이너 생성
```

### 2. 스케일링 시나리오
```
모니터링 → 부하 증가 감지 → 레플리카 수 증가 → 추가 컨테이너 배포
```

### 3. 장애 복구 시나리오
```
노드 장애 → 컨테이너 재스케줄링 → 다른 노드에 재배포 → 서비스 연속성 유지
```

## 📋 데이터 일관성 규칙

1. **서비스 → 컨테이너**: 서비스의 `replicas` 수와 실제 실행 중인 컨테이너 수 일치
2. **노드 → 컨테이너**: 노드의 리소스 사용량 = 해당 노드 내 모든 컨테이너 리소스 합
3. **클러스터 → 서비스**: 클러스터 서비스 통계 = 모든 서비스 상태의 집계
4. **네트워크 일관성**: 같은 네트워크의 서비스들은 서로 통신 가능

이 구조를 바탕으로 대시보드의 모든 기능은 이 엔티티 관계를 반영하여 구현되어야 합니다. 