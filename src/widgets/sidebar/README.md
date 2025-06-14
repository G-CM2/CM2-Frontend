# 사이드바 위젯 (Sidebar Widget)

이 폴더는 애플리케이션의 메인 네비게이션 사이드바를 구현합니다.

## 디렉토리 구조

```
sidebar/
├── ui/
│   └── sidebar.tsx    # 메인 사이드바 컴포넌트
├── README.md          # 이 파일
└── index.ts           # 공개 인터페이스
```

## 주요 기능

### 네비게이션 메뉴
현재 구현된 메뉴 항목들:

- **대시보드** (`/dashboard`): 전체 시스템 현황 및 서비스 관리
- **컨테이너** (`/containers`): 컨테이너 목록 및 관리

### 시각적 특징
- 현재 활성 페이지 하이라이트
- 호버 효과 및 트랜지션
- 아이콘과 설명이 포함된 메뉴 항목
- 반응형 디자인

## 컴포넌트 구조

### Sidebar
메인 사이드바 컴포넌트입니다.

**주요 기능:**
- React Router의 `useLocation`을 사용한 현재 경로 감지
- 활성 메뉴 항목 스타일링
- 메뉴 항목별 아이콘 및 설명 표시
- 브랜드 헤더 및 버전 정보 표시

**사용된 아이콘:**
- `LayoutDashboard`: 대시보드
- `Container`: 컨테이너
- `ChevronRight`: 메뉴 화살표

## 스타일링

### TailwindCSS 클래스
- 기본 배경: `bg-white`
- 테두리: `border-r border-gray-200`
- 활성 상태: `bg-blue-50 text-blue-700 border border-blue-200`
- 호버 상태: `hover:bg-gray-50 hover:text-gray-900`

### 반응형 디자인
- 고정 너비: `w-64`
- 전체 높이: `h-full`
- 플렉스 레이아웃: `flex flex-col`

## 메뉴 항목 추가 가이드

새로운 메뉴 항목을 추가하려면:

1. **menuItems 배열에 새 항목 추가**:
```typescript
{
  title: '새 메뉴',
  icon: NewIcon,
  path: '/new-path',
  description: '새 메뉴 설명'
}
```

2. **아이콘 import 추가**:
```typescript
import { NewIcon } from 'lucide-react';
```

3. **라우트 확인**: `src/app/App.tsx`에 해당 라우트가 존재하는지 확인

## 활성 상태 로직

`isActive` 함수는 현재 경로와 메뉴 항목의 경로를 비교하여 활성 상태를 결정합니다:

```typescript
const isActive = (path: string) => {
  return location.pathname === path || location.pathname.startsWith(path + '/');
};
```

이 로직은 정확한 경로 매칭과 하위 경로 매칭을 모두 지원합니다.

## 브랜딩

### 헤더 섹션
- 애플리케이션 이름: "Container Manager"
- 부제목: "Docker 컨테이너 관리 대시보드"

### 푸터 섹션
- 버전 정보: "Version 1.0.0"
- 저작권: "© 2024 Container Manager"

## 접근성 고려사항

- **키보드 네비게이션**: Tab 키로 메뉴 항목 간 이동 가능
- **시맨틱 HTML**: `nav`, `ul`, `li` 태그 사용
- **명확한 링크 텍스트**: 각 메뉴 항목에 설명 포함
- **시각적 피드백**: 호버 및 활성 상태 명확히 표시

## 확장 가능성

향후 다음과 같은 기능을 추가할 수 있습니다:

- **메뉴 그룹화**: 관련 메뉴들을 섹션별로 그룹화
- **접기/펼치기**: 사이드바 축소/확장 기능
- **사용자 프로필**: 사용자 정보 및 설정 메뉴
- **알림 배지**: 메뉴 항목에 알림 개수 표시
- **검색 기능**: 메뉴 항목 빠른 검색 