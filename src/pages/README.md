# Pages 모듈

이 폴더는 애플리케이션의 각 페이지 컴포넌트들을 포함합니다. 각 페이지는 독립적인 라우트를 가지며, 여러 위젯과 피처를 조합하여 완전한 사용자 인터페이스를 제공합니다.

## 구조

```
pages/
├── cluster-monitoring/     # 클러스터 모니터링 페이지 (교육용 시각화)
├── cluster-topology/       # 클러스터 토폴로지 페이지
├── containers/             # 컨테이너 관련 페이지들
├── dashboard/              # 대시보드 페이지
├── scaling/                # 스케일링 페이지
├── service-deployment/     # 서비스 배포 페이지
└── README.md               # 이 파일
```

## 페이지 설명

### 1. cluster-monitoring/
**교육용 쿠버네틱스 클러스터 모니터링 시각화 페이지**
- 실시간 클러스터 상태 모니터링
- 노드 상태 시각화
- 시스템 리소스 사용량 대시보드
- 컨테이너 상태 요약
- 교육용 인터랙티브 요소 포함

### 2. cluster-topology/
클러스터의 네트워크 토폴로지와 노드 간 관계를 시각화합니다.

### 3. containers/
컨테이너 관련 페이지들을 포함합니다:
- 컨테이너 목록 페이지
- 개별 컨테이너 상세 페이지

### 4. dashboard/
전체 시스템의 개요를 제공하는 메인 대시보드입니다.

### 5. scaling/
서비스 스케일링 정책 관리 페이지입니다.

### 6. service-deployment/
서비스 배포 및 관리 페이지입니다.

## 페이지 생성 규칙

### 폴더 구조
각 페이지는 다음과 같은 구조를 가져야 합니다:

```
page-name/
├── index.ts              # 페이지 내보내기
├── page-name-page.tsx    # 메인 페이지 컴포넌트
├── ui/                   # 페이지 전용 UI 컴포넌트들
│   ├── component-name.tsx
│   └── index.ts
├── lib/                  # 페이지 전용 로직 (선택적)
│   ├── utils.ts
│   └── index.ts
└── README.md             # 페이지 설명
```

### 명명 규칙
- 폴더명: `kebab-case` (예: `cluster-monitoring`)
- 컴포넌트명: `PascalCase` + `Page` 접미사 (예: `ClusterMonitoringPage`)
- 파일명: `kebab-case` (예: `cluster-monitoring-page.tsx`)

### 페이지 컴포넌트 작성 규칙
1. **단일 책임**: 각 페이지는 하나의 주요 기능에 집중
2. **위젯 조합**: 복잡한 UI는 widgets에서 가져와서 조합
3. **피처 활용**: 비즈니스 로직은 features에서 가져와서 사용
4. **API 훅 사용**: shared/api의 훅을 통해 데이터 관리
5. **반응형 디자인**: 모든 페이지는 반응형으로 구현

### 라우팅 등록
새로운 페이지를 만든 후에는 `src/app/App.tsx`에 라우트를 등록해야 합니다:

```typescript
import { NewPage } from '@/pages/new-page';

// Routes 내부에 추가
<Route path="/new-page" element={<NewPage />} />
```

## 교육용 페이지 특징

### cluster-monitoring 페이지
이 페이지는 쿠버네틱스 교육을 목적으로 하며 다음과 같은 특징을 가집니다:

1. **시각적 학습**: 복잡한 클러스터 개념을 직관적으로 이해할 수 있는 시각화
2. **실시간 데이터**: 실제 클러스터 상태를 실시간으로 보여주는 모니터링
3. **인터랙티브 요소**: 사용자가 직접 조작하고 결과를 확인할 수 있는 기능
4. **교육적 설명**: 각 요소에 대한 설명과 도움말 제공

## 사용 예시

```typescript
// 페이지 컴포넌트 예시
import { useMonitoringInfo, useSystemSummary } from '@/shared/api';
import { ClusterVisualization } from '@/widgets/cluster-visualization';

export const ClusterMonitoringPage = () => {
  const { data: clusterInfo } = useMonitoringInfo(5000);
  const { data: summary } = useSystemSummary(10000);

  return (
    <div className="p-6">
      <h1>클러스터 모니터링</h1>
      <ClusterVisualization 
        clusterInfo={clusterInfo}
        summary={summary}
      />
    </div>
  );
};
```

모든 페이지는 교육적 가치를 제공하고 사용자가 쿠버네틱스 개념을 시각적으로 학습할 수 있도록 설계되어야 합니다. 