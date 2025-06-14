# API 모듈

이 폴더는 백엔드 API와의 통신을 담당하는 모듈들을 포함합니다. **Notion API 명세서**를 기반으로 구현되었으며, 모든 엔드포인트는 명세서에 정의된 내용과 정확히 일치합니다.

## 구조

```
api/
├── api-client.ts           # 기본 API 클라이언트 설정
├── cluster.ts              # 클러스터 관련 API
├── containers.ts           # 컨테이너 관련 API  
├── monitoring.ts           # 모니터링 및 시스템 요약 API
├── services.ts             # 서비스 관리 API
├── hooks/                  # React Query 훅들
│   ├── use-cluster.ts      # 클러스터 관련 훅
│   ├── use-containers.ts   # 컨테이너 관련 훅
│   ├── use-monitoring.ts   # 모니터링 관련 훅
│   ├── use-services.ts     # 서비스 관련 훅
│   └── index.ts            # 모든 훅 내보내기
├── mock/                   # MSW 모킹 설정
└── index.ts                # 모든 API 모듈 내보내기
```

## 기본 설정

### API 클라이언트 (`api-client.ts`)
- 기본 URL: `http://localhost:8080/`
- Axios 기반 HTTP 클라이언트
- 요청/응답 인터셉터 포함
- 에러 처리 및 로깅

## API 모듈

### 1. 모니터링 API (`monitoring.ts`)
Docker Swarm 클러스터의 모니터링 정보와 시스템 요약을 제공합니다.

#### 인터페이스:
- `MonitoringResponse` - 클러스터 정보 (GET /)
- `SystemSummary` - 시스템 요약 정보 (GET /summary)
- `ClusterNode` - 클러스터 노드 정보
- `SystemStatus` - 시스템 상태 정보
- `ContainersSummary` - 컨테이너 요약 정보
- `ResourceUsage` - 리소스 사용량 정보

#### 메서드:
- `getMonitoringInfo()` - 클러스터 기본 정보 및 노드 목록 조회
- `getSystemSummary()` - 전체 시스템 상태, 컨테이너 및 리소스 요약 정보 조회

### 2. 클러스터 API (`cluster.ts`)
Docker Swarm 클러스터 노드 관리 및 상태 확인 기능을 제공합니다.

#### 인터페이스:
- `Node` - 노드 정보
- `ClusterStatus` - 클러스터 상태
- `ClusterHealth` - 클러스터 헬스 체크
- `NodeDrainRequest/Response` - 노드 드레인 요청/응답
- `FailureSimulationRequest/Response` - 장애 시뮬레이션 요청/응답

#### 메서드:
- `getNodes()` - 노드 목록 조회
- `getClusterStatus()` - 클러스터 상태 조회
- `getClusterHealth()` - 클러스터 헬스 체크
- `drainNode()` - 노드 드레인 실행
- `simulateFailure()` - 장애 시뮬레이션 실행

### 3. 서비스 API (`services.ts`)
Docker Swarm 서비스 생성, 수정, 삭제 및 스케일링 기능을 제공합니다.

#### 인터페이스:
- `Service` - 서비스 정보
- `ServicePort` - 서비스 포트 설정
- `ServiceResources` - 서비스 리소스 설정
- `UpdateConfig` - 업데이트 설정
- `CreateServiceRequest` - 서비스 생성 요청
- `UpdateServiceRequest` - 서비스 업데이트 요청
- `ScaleServiceRequest` - 서비스 스케일링 요청

#### 메서드:
- `getServices()` - 서비스 목록 조회
- `getService()` - 특정 서비스 조회
- `createService()` - 새 서비스 생성
- `updateService()` - 서비스 롤링 업데이트
- `scaleService()` - 서비스 스케일링
- `deleteService()` - 서비스 삭제

### 4. 컨테이너 API (`containers.ts`)
Docker 컨테이너 정보 조회 기능을 제공합니다.

#### 인터페이스:
- `Container` - 컨테이너 정보
- `ContainersResponse` - 컨테이너 목록 응답

#### 메서드:
- `getContainers()` - 컨테이너 목록 조회
- `getContainer()` - 특정 컨테이너 상세 정보 조회

## React Query 훅

### 모니터링 훅 (`use-monitoring.ts`)
- `useMonitoringInfo()` - 클러스터 기본 정보 조회
- `useSystemSummary()` - 시스템 요약 정보 조회

### 클러스터 훅 (`use-cluster.ts`)
- `useNodes()` - 노드 목록 조회
- `useClusterStatus()` - 클러스터 상태 조회
- `useClusterHealth()` - 클러스터 헬스 체크
- `useDrainNode()` - 노드 드레인 실행
- `useSimulateFailure()` - 장애 시뮬레이션 실행

### 서비스 훅 (`use-services.ts`)
- `useServices()` - 서비스 목록 조회
- `useService()` - 특정 서비스 조회
- `useCreateService()` - 서비스 생성
- `useUpdateService()` - 서비스 업데이트
- `useScaleService()` - 서비스 스케일링
- `useDeleteService()` - 서비스 삭제

### 컨테이너 훅 (`use-containers.ts`)
- `useContainers()` - 컨테이너 목록 조회
- `useContainer()` - 특정 컨테이너 조회

## 사용 예시

```typescript
import { useMonitoringInfo, useSystemSummary } from '@/shared/api';

// 클러스터 기본 정보 조회
const { data: clusterInfo } = useMonitoringInfo(5000); // 5초마다 갱신

// 시스템 요약 정보 조회
const { data: summary } = useSystemSummary(10000); // 10초마다 갱신
```

## 주요 특징

- **타입 안전성**: 모든 API 요청/응답에 대한 TypeScript 인터페이스 제공
- **자동 캐싱**: React Query를 통한 효율적인 데이터 캐싱
- **실시간 업데이트**: `refetchInterval` 옵션으로 주기적 데이터 갱신
- **에러 처리**: 일관된 에러 처리 및 로깅 메커니즘
- **API 모킹**: MSW를 활용한 개발 환경 모킹 지원

모든 API는 **Notion API 명세서**의 정의를 완전히 준수하며, 명세서에서 정의되지 않은 엔드포인트는 포함하지 않습니다. 