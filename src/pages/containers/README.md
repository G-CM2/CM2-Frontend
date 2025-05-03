# 컨테이너 페이지

이 폴더는 Docker 컨테이너 관련 페이지들을 포함합니다.

## 구조

- `container-list-page.tsx` - 컨테이너 목록 페이지
- `container-details.tsx` - 컨테이너 상세 정보 페이지
- `index.ts` - 공개 API

## 페이지 역할

### 컨테이너 목록 페이지

사용 가능한 모든 Docker 컨테이너의 목록을 표시합니다. 이 페이지는 다음을 제공합니다:
- 페이지네이션을 통한 컨테이너 목록 조회
- 컨테이너의 기본 정보 표시(이름, 상태, 이미지, CPU/메모리 사용량)
- 상세 정보 페이지로의 링크

### 컨테이너 상세 정보 페이지

특정 컨테이너의 상세 정보를 표시합니다. 이 페이지는 다음을 제공합니다:
- 컨테이너의 기본 정보 표시
- 리소스 사용량(CPU, 메모리) 모니터링
- 컨테이너 제어 기능(시작, 중지, 재시작, 일시 중지, 일시 중지 해제)
- 컨테이너 로그, 포트 매핑, 볼륨 마운트, 환경 변수 등의 상세 정보 표시

## 사용법

```tsx
import { ContainerListPage, ContainerDetailsPage } from '@/pages/containers';
import { Route, Routes } from 'react-router-dom';

export const App = () => {
  return (
    <Routes>
      <Route path="/containers" element={<ContainerListPage />} />
      <Route path="/containers/:containerId" element={<ContainerDetailsPage />} />
    </Routes>
  );
};
```

## API와의 통합

이 페이지들은 `@/shared/api`를 통해 백엔드 API와 통신합니다. 컨테이너 목록과 상세 정보를 가져오고, 컨테이너 제어 기능을 수행합니다. 