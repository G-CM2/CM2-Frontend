# 페이지 (Pages)

이 폴더는 애플리케이션의 모든 페이지 컴포넌트를 포함합니다.

## 구조

- `dashboard/` - 메인 대시보드 페이지
- `containers/` - 컨테이너 관련 페이지들
- `services/` - 서비스 관리 페이지
- `cluster/` - 클러스터 관리 페이지
- `README.md` - 이 파일

## 페이지 역할

### 대시보드 (`/dashboard`)
- **목적**: 전체 시스템 현황을 한눈에 파악
- **기능**: 클러스터 상태, 서비스 현황, 컨테이너 통계, 리소스 사용량
- **시나리오**: 정상 상태, 스케일링 필요, 장애 상황을 자연스럽게 표시

### 컨테이너 (`/containers`)
- **목적**: 개별 컨테이너의 상세 관리
- **기능**: 컨테이너 목록, 상세 정보, 제어 (시작/중지/재시작)
- **시나리오**: 컨테이너 상태별 필터링 및 관리

### 서비스 (`/services`)
- **목적**: Docker Swarm 서비스 생성 및 관리
- **기능**: 서비스 생성/삭제, 실시간 스케일링, 상태 모니터링
- **시나리오**: 
  - 정상 상태: 모든 서비스 running
  - 스케일링: 레플리카 수 조정
  - 장애 복구: failed 서비스에 문제 해결 옵션 표시

### 클러스터 (`/cluster`)
- **목적**: Docker Swarm 클러스터 노드 관리
- **기능**: 노드 상태 시각화, 리소스 모니터링, 노드 제어
- **시나리오**:
  - 정상 상태: 모든 노드 ready
  - 장애 상황: down/unknown 노드에 대한 알림 및 복구 가이드

## 라우팅 구조

```
/ → /dashboard (리다이렉트)
/dashboard → DashboardPage
/containers → ContainerListPage
/containers/:containerId → ContainerDetailsPage
/services → ServicesPage
/cluster → ClusterPage
```

## 공통 패턴

### 레이아웃
모든 페이지는 `Layout` 위젯을 사용하여 일관된 구조를 유지합니다:
- 사이드바 네비게이션
- 메인 콘텐츠 영역
- 반응형 디자인

### 상태 관리
- React Query를 사용한 서버 상태 관리
- 실시간 데이터 업데이트 (refetchInterval)
- 낙관적 업데이트 및 에러 처리

### 시나리오 통합
각 페이지는 사전 정의된 시나리오를 자연스럽게 통합합니다:
- **정상 상태**: 모든 시스템이 정상 작동
- **스케일링**: 리소스 사용량에 따른 스케일링 필요성 표시
- **장애 복구**: 문제 상황에 대한 자동 감지 및 복구 옵션 제공

## 사용법

```tsx
import { DashboardPage } from '@/pages/dashboard';
import { ContainerListPage, ContainerDetailsPage } from '@/pages/containers';
import { ServicesPage } from '@/pages/services';
import { ClusterPage } from '@/pages/cluster';

// 라우터 설정에서 사용
<Routes>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/containers" element={<ContainerListPage />} />
  <Route path="/containers/:containerId" element={<ContainerDetailsPage />} />
  <Route path="/services" element={<ServicesPage />} />
  <Route path="/cluster" element={<ClusterPage />} />
</Routes>
```

## 확장 가이드

새 페이지를 추가할 때:

1. **폴더 생성**: `src/pages/new-page/`
2. **컴포넌트 작성**: `new-page.tsx`
3. **인덱스 파일**: `index.ts`에서 export
4. **README 작성**: 페이지 목적과 기능 설명
5. **라우트 추가**: `src/app/App.tsx`에 라우트 추가
6. **사이드바 메뉴**: 필요시 사이드바에 메뉴 항목 추가

## API 통합

모든 페이지는 `@/shared/api`를 통해 백엔드와 통신합니다:
- 일관된 에러 처리
- 로딩 상태 관리
- 캐싱 및 동기화 