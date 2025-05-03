# API 모듈

이 디렉토리는 Docker 컨테이너 관리 대시보드의 백엔드 API와 통신하는 모듈을 포함하고 있습니다.

## 디렉토리 구조

```
api/
├── api-client.ts    # 기본 HTTP 클라이언트 (Axios) 설정
├── containers.ts    # 컨테이너 관련 API
├── scaling.ts       # 스케일링 정책 관련 API
├── system.ts        # 시스템 및 대시보드 관련 API
├── hooks/           # React Query 훅
└── mock/            # MSW를 사용한 API 모킹
```

## 도메인 분리

API는 다음과 같은 도메인으로 분리되어 있습니다:

### 1. 컨테이너 (containers.ts)
- 컨테이너 목록 조회
- 컨테이너 상세 정보 조회
- 컨테이너 시작/중지/재시작 등 동작 수행

### 2. 스케일링 (scaling.ts)
- 자동 스케일링 정책 목록 조회
- 자동 스케일링 정책 상세 조회
- 정책 생성, 수정, 삭제

### 3. 시스템 (system.ts)
- 시스템 요약 정보 (CPU, 메모리, 디스크 사용량 등)
- 대시보드 요약 정보

## 사용 방법

각 도메인 모듈은 관련 인터페이스와 API 함수를 내보냅니다. 모든 API 함수는 비동기적이며 Promise를 반환합니다.

```typescript
import { containersApi, Container } from '@/shared/api';

// 컨테이너 목록 가져오기
const containers = await containersApi.getContainers();

// 특정 컨테이너 시작
await containersApi.startContainer('container-id');
```

## React Query 훅

데이터 페칭 및 캐싱을 위해 React Query 훅이 `hooks/` 디렉토리에 구현되어 있습니다.

### 주요 훅 목록

```typescript
// 컨테이너 관련 훅
import { 
  useContainers,          // 컨테이너 목록 조회
  useContainer,           // 단일 컨테이너 조회
  useContainerAction,     // 범용 컨테이너 액션 수행
  useStartContainer,      // 컨테이너 시작
  useStopContainer,       // 컨테이너 중지
  useRestartContainer,    // 컨테이너 재시작
  usePauseContainer,      // 컨테이너 일시중지
  useUnpauseContainer     // 컨테이너 일시중지 해제
} from '@/shared/api';

// 스케일링 관련 훅
import {
  useScalingPolicies,     // 스케일링 정책 목록 조회
  useScalingPolicy,       // 단일 스케일링 정책 조회
  useCreateScalingPolicy, // 스케일링 정책 생성
  useUpdateScalingPolicy, // 스케일링 정책 수정
  useDeleteScalingPolicy  // 스케일링 정책 삭제
} from '@/shared/api';
```

## 모킹

개발 환경에서는 [MSW(Mock Service Worker)](https://mswjs.io/)를 사용하여 API 요청을 가로채고 모의 응답을 제공합니다. 이 모킹 설정은 `mock/` 디렉토리에 있습니다.

## 인터페이스

각 도메인 모듈은 자체 인터페이스를 정의하고 있습니다:

### containers.ts
- `Container` - 컨테이너 정보 인터페이스
- `ContainersResponse` - 컨테이너 목록 응답 인터페이스
- `ContainerActionRequest` - 컨테이너 동작 요청 인터페이스
- `ContainerActionResponse` - 컨테이너 동작 응답 인터페이스

### scaling.ts
- `ScalingPolicy` - 스케일링 정책 인터페이스
- `ScalingMetric` - 스케일링 지표 인터페이스
- `CreateScalingPolicyRequest` - 스케일링 정책 생성 요청 인터페이스

### system.ts
- `SystemSummary` - 시스템 요약 정보 인터페이스
- `DashboardSummary` - 대시보드 요약 정보 인터페이스 