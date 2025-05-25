# 페이지 (Pages)

이 폴더는 애플리케이션의 각 페이지 컴포넌트를 포함합니다. 각 페이지는 라우트와 직접 매핑됩니다.

## 디렉토리 구조

```
pages/
├── dashboard/               # 대시보드 관련 페이지
│   ├── ui/
│   │   └── dashboard-page.tsx    # 메인 대시보드 페이지 컴포넌트
│   └── index.ts             # 내보내기
├── containers/              # 컨테이너 관련 페이지
│   ├── ui/
│   │   ├── container-list-page.tsx   # 컨테이너 목록 페이지
│   │   └── container-details-page.tsx # 컨테이너 상세 페이지
│   └── index.ts             # 내보내기
├── scaling/                 # 스케일링 정책 관련 페이지
│   ├── ui/
│   │   ├── scaling-policy-list-page.tsx  # 스케일링 정책 목록 페이지
│   │   └── create-scaling-policy-page.tsx # 스케일링 정책 생성 페이지
│   └── index.ts             # 내보내기
├── cluster-topology/        # 클러스터 토폴로지 관련 페이지
│   ├── ui/
│   │   └── cluster-topology-page.tsx  # 클러스터 토폴로지 시각화 페이지
│   └── index.ts             # 내보내기
└── service-deployment/      # 서비스 배포 관련 페이지
    ├── ui/
    │   └── service-deployment-page.tsx  # 서비스 배포 시각화 페이지
    └── index.ts             # 내보내기
```

## 현재 페이지

- **dashboard-page**: 메인 대시보드 페이지로, 시스템 요약 정보와 주요 컨테이너 상태를 보여줍니다.
- **container-list-page**: 모든 컨테이너 목록을 표시하는 페이지입니다.
- **container-details-page**: 특정 컨테이너의 상세 정보와 로그, 성능 지표를 표시합니다.
- **scaling-policy-list-page**: 설정된 자동 스케일링 정책 목록을 표시합니다.
- **create-scaling-policy-page**: 새로운 자동 스케일링 정책을 생성하는 페이지입니다.
- **cluster-topology-page**: Docker Swarm 클러스터의 노드 구성과 연결 상태를 시각적으로 표시하는 페이지입니다.
- **service-deployment-page**: Docker Swarm 서비스 배포 과정을 단계별 애니메이션으로 시각화하는 페이지입니다.

## 페이지 구성 원칙

페이지 컴포넌트는 다음 원칙을 따릅니다:

1. 페이지는 위젯, 엔티티, 기능 등을 조합하여 구성됩니다.
2. 페이지 자체는 비즈니스 로직을 포함하지 않고, 구성 요소들을 배치하는 역할만 합니다.
3. 페이지는 라우팅 시스템과 직접 연결됩니다.
4. 페이지 간 데이터 전달은 URL 파라미터나 쿼리 파라미터를 사용합니다.
5. 복잡한 페이지 레이아웃은 위젯을 통해 구현합니다.

## 네이밍 규칙

- 페이지 파일 이름: `page-name-page.tsx`
- 페이지 컴포넌트 이름: `PageNamePage`
- 폴더 이름: `page-category` (kebab-case)

## 페이지 구조

각 페이지 컴포넌트는 일반적으로 다음 구조를 따릅니다:

```tsx
import React from 'react';
import { Layout } from '@/widgets/layout';
import { SomeWidget } from '@/widgets/some-widget';
import { SomeFeature } from '@/features/some-feature';

export const SomePage = () => {
  return (
    <Layout>
      <h1>페이지 제목</h1>
      <SomeWidget />
      <SomeFeature />
    </Layout>
  );
};
```

## 라우팅 사용 예시

```tsx
import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from '@/pages/dashboard';
import { ContainerListPage, ContainerDetailsPage } from '@/pages/containers';
import { ScalingPolicyListPage, CreateScalingPolicyPage } from '@/pages/scaling';
import { ClusterTopologyPage } from '@/pages/cluster-topology';
import { ServiceDeploymentPage } from '@/pages/service-deployment';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/containers" element={<ContainerListPage />} />
      <Route path="/containers/:containerId" element={<ContainerDetailsPage />} />
      <Route path="/scaling" element={<ScalingPolicyListPage />} />
      <Route path="/cluster-topology" element={<ClusterTopologyPage />} />
      <Route path="/service-deployment" element={<ServiceDeploymentPage />} />
    </Routes>
  );
};
```

## 의존성 규칙

- 페이지는 어떤 계층에도 의존할 수 있습니다 (위젯, 기능, 엔티티, 공유).
- 다른 계층은 페이지에 의존해서는 안 됩니다.
- 페이지는 다른 페이지에 직접 의존해서는 안 됩니다 (라우팅을 통한 탐색만 가능).

이 계층은 Feature-Sliced Design 아키텍처에서 `pages` 계층의 역할을 합니다. 