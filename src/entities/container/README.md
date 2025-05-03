# Container Entity

이 폴더는 Docker 컨테이너와 관련된 도메인 로직을 담고 있습니다.

## 구조

- `ui/` - 컨테이너 관련 UI 컴포넌트
  - `container-list.tsx` - 컨테이너 목록을 표시하는 컴포넌트
  - `container-card.tsx` - 개별 컨테이너 카드 컴포넌트
- `model/` - 컨테이너 관련 상태 및 로직
  - `mocks.ts` - 목업 데이터
- `types/` - 컨테이너 관련 타입 정의
- `index.ts` - 공개 API

## 사용법

```tsx
import { ContainerList } from '@/entities/container';

export const ContainersPage = () => {
  return (
    <div>
      <h1>컨테이너 목록</h1>
      <ContainerList />
    </div>
  );
};
```

## API와의 통합

이 엔티티는 `@/shared/api`를 통해 백엔드 API와 통신합니다. 컨테이너 목록 조회, 특정 컨테이너 상세 정보 조회, 컨테이너 제어(시작, 중지, 재시작 등) 기능을 제공합니다. 