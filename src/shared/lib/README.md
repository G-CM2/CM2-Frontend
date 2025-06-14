# Shared Library

공통으로 사용되는 유틸리티 함수와 라이브러리들을 관리합니다.

## 파일 구조

### `storage.ts`
localStorage 기반 데이터 관리 유틸리티입니다.

**주요 기능:**
- `Storage.set(key, data)`: 데이터 저장
- `Storage.get(key, defaultValue)`: 데이터 조회
- `Storage.has(key)`: 데이터 존재 여부 확인
- `Storage.remove(key)`: 데이터 삭제
- `Storage.clear()`: 모든 데이터 삭제

**저장 키:**
- `SERVICES`: 서비스 목록 데이터
- `CONTAINERS`: 컨테이너 목록 데이터
- `SYSTEM_SUMMARY`: 시스템 요약 정보
- `CLUSTER_NODES`: 클러스터 노드 정보

### `mock-data.ts`
초기 mock 데이터를 정의합니다.

**포함 데이터:**
- `INITIAL_SERVICES`: 초기 서비스 데이터
- `INITIAL_CONTAINERS`: 초기 컨테이너 데이터
- `INITIAL_SYSTEM_SUMMARY`: 초기 시스템 요약 정보
- `INITIAL_CLUSTER_NODES`: 초기 클러스터 노드 데이터
- `ClusterNode`: 클러스터 노드 타입 정의

### `msw-handlers.ts`
MSW(Mock Service Worker) 핸들러를 정의합니다.

**API 엔드포인트:**
- `GET /api/services`: 서비스 목록 조회
- `POST /api/services`: 서비스 생성
- `PATCH /api/services/:id/scale`: 서비스 스케일링
- `DELETE /api/services/:id`: 서비스 삭제
- `GET /api/summary`: 시스템 요약 정보 조회
- `GET /api/containers`: 컨테이너 목록 조회
- `GET /api/cluster/nodes`: 클러스터 노드 목록 조회
- `PATCH /api/cluster/nodes/:id/availability`: 노드 가용성 변경

**특징:**
- localStorage를 통한 데이터 영속성
- 자동 데이터 초기화
- 실시간 시스템 요약 정보 업데이트

## 데이터 흐름

1. **초기화**: 앱 시작 시 localStorage에 초기 데이터가 없으면 `mock-data.ts`의 초기 데이터로 설정
2. **API 호출**: React Query를 통해 MSW 핸들러로 API 요청
3. **데이터 조작**: MSW 핸들러에서 localStorage 데이터를 읽고 수정
4. **영속성**: 모든 변경사항이 localStorage에 자동 저장되어 페이지 새로고침 후에도 유지

## 사용 예시

```typescript
// 직접 Storage 사용
import { Storage } from '@/shared/lib/storage';

const services = Storage.get('SERVICES', []);
Storage.set('SERVICES', updatedServices);

// API 훅 사용 (권장)
import { useServices } from '@/shared/api/hooks/use-services';

const { data: services, isLoading } = useServices();
```

## 주의사항

- localStorage는 브라우저별로 독립적으로 관리됩니다
- 개발자 도구에서 localStorage를 직접 수정할 수 있습니다
- MSW는 개발 환경에서만 동작하며, 실제 API 서버가 있을 때는 비활성화해야 합니다 