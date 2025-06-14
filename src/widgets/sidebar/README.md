# 사이드바 위젯

이 폴더는 애플리케이션의 사이드바 네비게이션 위젯을 포함합니다.

## 구조

- `ui/sidebar.tsx` - 사이드바 컴포넌트
- `index.ts` - 공개 API

## 위젯 역할

### 사이드바 컴포넌트

애플리케이션의 주요 네비게이션을 담당하는 사이드바입니다. 다음 기능을 제공합니다:

#### 메뉴 항목
- **대시보드** (`/dashboard`) - 전체 시스템 현황 및 서비스 관리
- **컨테이너** (`/containers`) - 컨테이너 목록 및 상세 관리
- **서비스** (`/services`) - Docker Swarm 서비스 생성/관리/스케일링
- **클러스터** (`/cluster`) - 클러스터 노드 상태 및 관리

#### UI 구성요소
- 브랜드 헤더 (CM2 Dashboard)
- 아이콘과 함께하는 메뉴 항목
- 현재 페이지 활성 상태 표시

#### 아이콘 매핑
- 대시보드: `LayoutDashboard`
- 컨테이너: `Container`
- 서비스: `Server`
- 클러스터: `Layers`

## 사용법

```tsx
import { Sidebar } from '@/widgets/sidebar';

export const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
```

## 네비게이션 로직

- `useLocation` 훅을 사용하여 현재 경로 감지
- 활성 메뉴 항목에 대한 시각적 피드백 제공
- 루트 경로(`/`)는 대시보드로 리다이렉트

## 스타일링

- Tailwind CSS를 사용한 반응형 디자인
- 활성 상태: 파란색 배경과 테두리
- 호버 효과: 회색 배경 전환
- 고정 너비 (w-64) 사이드바 