# Docker Container Management Dashboard Frontend 

Docker 컨테이너 모니터링 및 관리를 위한 웹 대시보드입니다.

## 기술 스택

- **React**: UI 컴포넌트 라이브러리
- **TypeScript**: 정적 타입 지원
- **Vite**: 빌드 도구
- **TailwindCSS**: CSS 프레임워크
- **Tanstack Query**: 서버 상태 관리 및 데이터 페칭
- **React Router DOM**: 클라이언트 사이드 라우팅

## 주요 기능

- 컨테이너 목록 조회 및 필터링
- 컨테이너 상세 정보 확인
- 컨테이너 시작/중지/재시작 등 제어
- 시스템 리소스 모니터링
- 자동 스케일링 정책 관리

## 프로젝트 구조

이 프로젝트는 Feature-Sliced Design (FSD) 아키텍처를 따릅니다.

```
src/
├── app/         # 앱 수준 설정 (라우팅, 레이아웃, 테마, 프로바이더)
│   ├── providers/  # 앱 전역 프로바이더 설정
│   │   └── query-provider.tsx  # Tanstack Query 프로바이더
│   └── App.tsx    # 루트 앱 컴포넌트
├── pages/       # 페이지 구성
│   ├── home/    # 홈 페이지(대시보드)
│   ├── containers/  # 컨테이너 관련 페이지
│   └── scaling/  # 스케일링 정책 관련 페이지
├── widgets/     # 레이아웃 블록 (헤더, 사이드바 등)
│   ├── header/  # 헤더 컴포넌트
│   ├── sidebar/  # 사이드바 내비게이션
│   ├── layout/  # 페이지 레이아웃 구조
│   ├── container-grid/  # 컨테이너 그리드 위젯
│   └── stats-overview/  # 통계 개요 위젯
├── features/    # 기능 단위
│   ├── container-actions/  # 컨테이너 액션 관련 기능
│   └── scaling-policy/  # 스케일링 정책 관련 기능 
├── entities/    # 도메인 로직 및 모델
│   ├── container/  # 컨테이너 관련 도메인 로직
│   └── system/  # 시스템 정보 관련 도메인 로직
├── shared/      # 전역 UI, 유틸리티, 타입
│   ├── api/  # API 클라이언트 및 유틸리티
│   ├── ui/  # UI 기본 컴포넌트
│   ├── lib/  # 유틸리티 함수
│   └── types/  # 공통 타입 정의
└── processes/   # 높은 수준의 비즈니스 프로세스
```

## 주요 파일 및 역할

- **src/main.tsx**: 애플리케이션 진입점
- **src/app/App.tsx**: 루트 애플리케이션 컴포넌트
- **src/app/providers/query-provider.tsx**: Tanstack Query 설정
- **src/widgets/layout/ui/layout.tsx**: 메인 레이아웃 구조
- **src/widgets/sidebar/ui/sidebar.tsx**: 사이드바 내비게이션 컴포넌트
- **src/widgets/header/ui/header.tsx**: 상단 헤더 컴포넌트
- **package.json**: 프로젝트 의존성 및 스크립트
- **vite.config.ts**: Vite 빌드 도구 설정
- **tailwind.config.js**: Tailwind CSS 설정

## API 통신

Tanstack Query를 사용하여 서버와의 통신 및 상태 관리를 구현했습니다:

- `useContainers`: 컨테이너 목록 조회
- `useContainer`: 컨테이너 상세 정보 조회
- `useContainerAction`: 컨테이너 동작 수행 (시작, 중지 등)
- `useContainerTimeline`: 컨테이너 성능 타임라인 데이터 조회
- `useScalingPolicies`: 자동 스케일링 정책 목록 조회
- `useCreateScalingPolicy`: 자동 스케일링 정책 생성
- `useDashboardSummary`: 대시보드 요약 정보 조회
- `useSystemSummary`: 시스템 요약 정보 조회

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 빌드

```bash
npm run build
```

## 테스트

```bash
npm run test
```

## 개발 가이드라인

- **클린 코드**: 의미 있는 이름, 작은 함수, DRY 원칙 적용
- **React 모범 사례**: 함수형 컴포넌트, 훅 규칙 준수, 적절한 상태 관리
- **Tailwind CSS**: 유틸리티 클래스 사용, 컴포넌트 스타일 일관성 유지
- **TypeScript**: 인터페이스 사용, 명확한 타입 정의, 엄격한 타입 체크
- **FSD 원칙**: 레이어 간 의존성 규칙 준수, 단방향 의존성 유지

# CM2-Frontend

Docker 컨테이너 관리를 위한 교육용 대시보드 프론트엔드 애플리케이션입니다.

## 🎯 프로젝트 목표

이 프로젝트는 **교육용 쿠버네틱스 시각화 학습 플랫폼**을 목표로 합니다:

- 실시간 클러스터 모니터링을 통한 쿠버네틱스 개념 학습
- 시각적 인터페이스를 통한 직관적인 시스템 이해
- 실제 클러스터 환경과의 상호작용을 통한 실습 경험

## 🚀 주요 기능

### 📊 클러스터 모니터링 (신규)
- **실시간 클러스터 상태 모니터링**: 5초마다 자동 갱신
- **노드 상태 시각화**: 매니저/워커 노드 구분 및 상태 표시
- **리소스 사용량 대시보드**: CPU, 메모리, 디스크 사용률 실시간 추적
- **컨테이너 상태 요약**: 실행/중지/오류 상태별 컨테이너 현황
- **교육적 학습 포인트**: 각 개념에 대한 설명과 가이드

### 🏠 대시보드
- 전체 시스템 상태 개요
- 빠른 상태 확인 카드
- 클러스터 모니터링으로의 원클릭 이동

### 📦 컨테이너 관리
- 컨테이너 목록 조회
- 개별 컨테이너 상세 정보

## 🛠 기술 스택

- **Frontend**: React 18 + TypeScript
- **상태 관리**: TanStack Query (React Query)
- **스타일링**: TailwindCSS + shadcn/ui
- **아키텍처**: Feature-Sliced Design (FSD)
- **빌드 도구**: Vite
- **라우팅**: React Router

## 📁 프로젝트 구조

```
src/
├── app/                    # 앱 레벨 설정
├── pages/                  # 페이지 컴포넌트들
│   ├── cluster-monitoring/ # 🆕 클러스터 모니터링 페이지
│   ├── dashboard/          # 메인 대시보드
│   └── containers/         # 컨테이너 관련 페이지들
├── widgets/                # 레이아웃 블록들
├── features/               # 기능별 모듈들
├── entities/               # 도메인 로직
└── shared/                 # 공통 유틸리티
    ├── api/                # API 클라이언트 및 훅들
    └── ui/                 # 공통 UI 컴포넌트들
```

## 🔗 API 연동

이 프론트엔드는 다음 백엔드 API와 연동됩니다:

- **Base URL**: `http://localhost:8080/`
- **모니터링 엔드포인트**:
  - `GET /` - 클러스터 정보 조회
  - `GET /summary` - 시스템 요약 정보
- **클러스터 관리**:
  - `GET /cluster/nodes` - 노드 목록
  - `GET /cluster/status` - 클러스터 상태
  - `GET /cluster/health` - 헬스체크
- **컨테이너 관리**:
  - `GET /containers` - 컨테이너 목록
  - `GET /containers/{id}` - 컨테이너 상세 정보

## 🎓 교육적 특징

### 실시간 학습
- 5-10초 간격의 자동 데이터 갱신으로 실시간 변화 관찰
- 시각적 상태 표시기를 통한 직관적 이해

### 개념 설명
- 각 페이지마다 포함된 "학습 포인트" 섹션
- 쿠버네틱스 핵심 개념에 대한 실용적 설명

### 인터랙티브 요소
- 클릭 가능한 상태 카드
- 실시간 새로고침 기능
- 페이지 간 원활한 네비게이션

## 🚀 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

## 📱 주요 페이지

### 1. 대시보드 (`/`)
- 전체 시스템 상태 개요
- 클러스터 모니터링으로의 빠른 접근

### 2. 클러스터 모니터링 (`/cluster-monitoring`) 🆕
- **실시간 모니터링**: 클러스터 상태 실시간 추적
- **노드 관리**: 각 노드의 상태와 역할 확인
- **리소스 모니터링**: CPU, 메모리, 디스크 사용량
- **교육 가이드**: 쿠버네틱스 개념 학습 지원

### 3. 컨테이너 관리 (`/containers`)
- 컨테이너 목록 및 상태 확인
- 개별 컨테이너 상세 정보

## 🔄 실시간 업데이트

- **클러스터 정보**: 5초마다 갱신
- **시스템 요약**: 10초마다 갱신
- **대시보드 데이터**: 10초마다 갱신

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일부터 데스크톱까지 지원
- **다크/라이트 테마**: 사용자 선호에 따른 테마 선택
- **로딩 상태**: 스켈레톤 UI와 로딩 인디케이터
- **에러 처리**: 사용자 친화적 에러 메시지

## 📚 학습 리소스

이 애플리케이션을 통해 다음 개념들을 학습할 수 있습니다:

- **클러스터 아키텍처**: 매니저 노드와 워커 노드의 역할
- **리소스 모니터링**: 시스템 성능 지표 해석
- **컨테이너 라이프사이클**: 컨테이너 상태 변화 추적
- **실시간 운영**: 실제 운영 환경에서의 모니터링 방법

---

**교육 목적으로 개발된 쿠버네틱스 학습 플랫폼입니다. 실제 프로덕션 환경에서는 추가적인 보안 및 성능 최적화가 필요합니다.**
