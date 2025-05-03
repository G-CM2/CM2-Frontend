# API 서비스

이 폴더는 백엔드 API와의 통신을 위한 서비스를 포함합니다.

## 구조

- `api-service.ts` - Docker 컨테이너 관리 관련 API 서비스를 제공합니다.
- `index.ts` - API 서비스의 진입점입니다.

## 사용법

```typescript
import { apiService, Container } from '@/shared/api';

// 컨테이너 목록 조회
const getContainers = async () => {
  const response = await apiService.getContainers();
  return response.data;
};

// 컨테이너 상세 정보 조회
const getContainerDetails = async (containerId: string) => {
  const response = await apiService.getContainerById(containerId);
  return response.data;
};

// 컨테이너 액션 수행 (시작, 중지, 재시작 등)
const restartContainer = async (containerId: string) => {
  const response = await apiService.performContainerAction(containerId, {
    action: 'restart'
  });
  return response.data;
};
```

## 인터페이스

각 API 요청 및 응답에 필요한 타입 인터페이스를 함께 제공합니다:

- `Container` - 컨테이너 정보 인터페이스
- `ContainersResponse` - 컨테이너 목록 응답 인터페이스
- `ContainerActionRequest` - 컨테이너 동작 요청 인터페이스
- `ContainerActionResponse` - 컨테이너 동작 응답 인터페이스 