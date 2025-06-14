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

**엔드포인트:**
- `GET /` - 시스템 모니터링 상태 조회
- `GET /summary` - 전체 시스템 상태 요약 정보

**인터페이스:**
- `MonitoringStatus` - 기본 모니터링 정보
- `SystemSummary` - 전체 시스템 요약 (클러스터, 서비스, 컨테이너, 리소스, 알림)

### 2. 클러스터 API (`cluster.ts`)

**엔드포인트:**
- `GET /cluster/nodes` - 노드 목록 조회
- `GET /cluster/status` - 클러스터 상태 조회  
- `GET /cluster/health` - 클러스터 헬스체크
- `POST /cluster/nodes/{nodeId}/drain` - 노드 드레인 실행
- `POST /cluster/simulate/failure` - 장애 시뮬레이션 실행

**인터페이스:**
- `Node` - 노드 정보
- `ClusterStatus` - 클러스터 상태
- `ClusterHealth` - 헬스체크 결과
- `FailureSimulationRequest/Response` - 장애 시뮬레이션
- `NodeDrainRequest/Response` - 노드 드레인

### 3. 서비스 API (`services.ts`)

**엔드포인트:**
- `GET /services` - 서비스 목록 조회
- `GET /services/{id}` - 특정 서비스 조회
- `POST /services` - 서비스 생성
- `POST /services/{id}/update` - 서비스 롤링 업데이트
- `PUT /services/{id}/scale` - 서비스 스케일링
- `DELETE /services/{id}` - 서비스 삭제

**인터페이스:**
- `Service` - 서비스 정보
- `CreateServiceRequest` - 서비스 생성 요청
- `UpdateServiceRequest` - 서비스 업데이트 요청
- `ScaleServiceRequest` - 스케일링 요청
- `ServicePort`, `ServiceResources` - 서비스 설정

### 4. 컨테이너 API (`containers.ts`)

**엔드포인트:**
- `GET /containers` - 모든 컨테이너 목록 조회
- `GET /containers/{containerId}` - 특정 컨테이너의 상세 정보 조회

**인터페이스:**
- `Container` - 컨테이너 정보
- `ContainersResponse` - 컨테이너 목록 응답

## React Query 훅

### 모니터링 훅
- `useMonitoringStatus()` - 모니터링 상태 조회
- `useSystemSummary()` - 시스템 요약 정보 조회

### 클러스터 훅
- `useNodes()` - 노드 목록 조회
- `useClusterStatus()` - 클러스터 상태 조회
- `useClusterHealth()` - 클러스터 헬스체크
- `useDrainNode()` - 노드 드레인 실행
- `useSimulateFailure()` - 장애 시뮬레이션 실행

### 서비스 훅
- `useServices()` - 서비스 목록 조회
- `useService(id)` - 특정 서비스 조회
- `useCreateService()` - 서비스 생성
- `useUpdateService()` - 서비스 업데이트
- `useScaleService()` - 서비스 스케일링
- `useDeleteService()` - 서비스 삭제

### 컨테이너 훅
- `useContainers()` - 컨테이너 목록 조회
- `useContainer(id)` - 특정 컨테이너 조회

## 사용법

```typescript
import { useMonitoringStatus, useNodes, useServices } from '@/shared/api';

// 컴포넌트에서 사용
function Dashboard() {
  const { data: monitoring } = useMonitoringStatus();
  const { data: nodes } = useNodes();
  const { data: services } = useServices();
  
  // ...
}
```

## 타입 안전성

모든 API 함수와 훅은 TypeScript로 완전히 타입이 지정되어 있으며, Notion API 명세서의 요청/응답 스키마를 정확히 반영합니다.

## 명세서 준수

이 API 모듈은 **Notion의 "API 명세서 - 최종 (1)"**에 정의된 모든 엔드포인트를 완전히 구현하며, 명세서에 없는 엔드포인트는 포함하지 않습니다. 