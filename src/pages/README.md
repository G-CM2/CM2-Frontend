# 페이지 (Pages)

이 폴더는 애플리케이션의 각 페이지 컴포넌트를 포함합니다.

## 구조

- `containers/` - 컨테이너 관련 페이지들
  - `container-list-page.tsx` - 컨테이너 목록 페이지
  - `container-details.tsx` - 컨테이너 상세 정보 페이지

## 페이지 구성 원칙

페이지 컴포넌트는 다음 원칙을 따릅니다:

1. 페이지는 위젯, 엔티티, 기능 등을 조합하여 구성됩니다.
2. 페이지 자체는 비즈니스 로직을 포함하지 않고, 구성 요소들을 배치하는 역할만 합니다.
3. 페이지는 라우팅 시스템과 직접 연결됩니다.
4. 페이지 간 데이터 전달은 URL 파라미터나 쿼리 파라미터를 사용합니다.

## 네이밍 규칙

- 페이지 파일 이름: `page-name-page.tsx`
- 페이지 컴포넌트 이름: `PageNamePage`

## 사용법

```tsx
import { Route, Routes } from 'react-router-dom';
import { ContainerListPage, ContainerDetailsPage } from '@/pages/containers';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/containers" element={<ContainerListPage />} />
      <Route path="/containers/:containerId" element={<ContainerDetailsPage />} />
    </Routes>
  );
};
```

이 계층은 Feature-Sliced Design 아키텍처에서 `pages` 계층의 역할을 합니다. 