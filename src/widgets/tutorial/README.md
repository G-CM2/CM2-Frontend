# Tutorial Widget

Docker 컨테이너 관리 대시보드의 사용자 온보딩을 위한 인터랙티브 튜토리얼 시스템입니다.

## 📁 구조

```
tutorial/
├── ui/                     # UI 컴포넌트들
│   ├── tutorial-widget.tsx    # 메인 위젯 컴포넌트
│   ├── tutorial-overlay.tsx   # 튜토리얼 오버레이 (단계별 가이드)
├── index.ts               # Public exports
└── README.md
```

## 🎯 목적

- 새로운 사용자의 온보딩 경험 개선
- 복잡한 기능들에 대한 단계별 가이드 제공
- 사용자 자율 학습 지원

## 🔧 주요 기능

### 1. 플로팅 도움말 버튼
- (기존) 화면 우하단에 고정된 `?` 버튼 → **튜토리얼 메뉴(모달)는 더 이상 제공하지 않음**
- 튜토리얼 진입은 사이드바의 "튜토리얼" 메뉴 클릭 시 `/tutorial` 페이지로 이동하여 시작
- 튜토리얼 진행 중에는 오버레이만 표시

### 2. 튜토리얼 시나리오
**서비스 생명주기 관리**
- 서비스 생성, 스케일링, 업데이트, 삭제 과정
- 실제 작업 흐름에 따른 단계별 가이드

**클러스터 모니터링**
- 클러스터 상태 확인 방법
- 노드 관리 및 리소스 모니터링

**장애 대응**
- 장애 시뮬레이션 및 복구 프로세스
- 실제 장애 상황 대응 방법

### 3. 인터랙티브 가이드
- 실제 UI 요소 하이라이트
- 단계별 설명과 액션 가이드
- 자동 네비게이션 및 클릭 액션

## 📋 상태 관리

`/shared/stores/tutorial-store.ts`에서 Zustand를 사용한 전역 상태 관리:

```typescript
interface TutorialState {
  isOpen: boolean;              // 튜토리얼 진행 여부
  currentScenario: string | null; // 현재 시나리오 ID
  currentStepIndex: number;     // 현재 단계 인덱스
  scenarios: TutorialScenario[]; // 사용 가능한 시나리오들
  // ... 액션들
}
```

## 🏷️ 데이터 속성 시스템

튜토리얼은 `data-tour` 속성을 사용하여 타겟 요소를 식별합니다:

```html
<!-- 예시 -->
<button data-tour="create-service-button">서비스 생성</button>
<div data-tour="services-list">서비스 목록</div>
```

## 변경 이력 및 규칙
- 2024-06: 튜토리얼 메뉴(모달) 및 관련 파일 제거, 진입 방식은 페이지(`/tutorial`)로만 통일
- 튜토리얼 위젯은 오버레이만 담당하며, 메뉴/모달은 제공하지 않음

## 🎮 사용자 인터랙션

### 키보드 단축키
- `Esc`: 튜토리얼 중단 또는 메뉴 닫기

### 네비게이션
- 이전/다음 버튼을 통한 단계 이동
- 진행률 표시 바
- 건너뛰기 옵션

## 🔄 액션 시스템

각 튜토리얼 단계는 다음 액션을 가질 수 있습니다:

- `navigate`: 지정된 경로로 이동
- `click`: 타겟 요소 자동 클릭
- `wait`: 사용자 대기 (기본값)

## 📝 새로운 튜토리얼 추가 방법

1. **시나리오 정의**: `tutorial-store.ts`의 `tutorialScenarios` 배열에 추가
2. **타겟 요소 마킹**: 관련 페이지/컴포넌트에 `data-tour` 속성 추가
3. **단계 정의**: 각 단계의 제목, 내용, 배치 위치 등 설정

```typescript
{
  id: 'new-scenario',
  title: '새로운 기능',
  description: '새로운 기능에 대한 설명',
  steps: [
    {
      target: '[data-tour="new-feature"]',
      title: '단계 제목',
      content: '단계 설명',
      placement: 'bottom',
      action: 'navigate',
      actionData: '/new-page'
    }
  ]
}
```

## 🔗 의존성

- `zustand`: 상태 관리
- `react-router-dom`: 네비게이션
- 공통 UI 컴포넌트 (`@/shared/ui`)

## 🎨 스타일링

- TailwindCSS 기반 스타일링
- 다크 모드 지원
- 반응형 디자인 (모바일 대응)

## 📱 접근성

- 키보드 내비게이션 지원
- 적절한 ARIA 레이블
- 고대비 색상 조합

## 🚀 향후 개선 사항

- 튜토리얼 진행 상태 저장 (localStorage)
- 다국어 지원
- 사용자 맞춤형 튜토리얼 추천
- 튜토리얼 완료 통계 