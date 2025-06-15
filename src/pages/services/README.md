# 서비스 페이지

이 폴더는 Docker Swarm 서비스 관련 페이지들을 포함합니다.

## 구조

- `services-page.tsx` - 서비스 관리 메인 페이지
- `service-details-page.tsx` - 개별 서비스 상세 관리 페이지
- `index.ts` - 공개 API

## 페이지 역할

### 서비스 관리 페이지 (`services-page.tsx`)

Docker Swarm 서비스의 생성, 관리, 모니터링을 담당합니다. 이 페이지는 다음을 제공합니다:

#### 핵심 기능
- **서비스 생성**: 사전 정의된 템플릿(nginx, redis)을 통한 빠른 서비스 생성
- **서비스 삭제**: 불필요한 서비스 제거
- **실시간 스케일링**: 레플리카 수 증가/감소를 통한 동적 스케일링
- **상태 모니터링**: 서비스와 컨테이너의 running/stopped/failed 상태 실시간 표시
- **서비스 상세 관리**: "관리" 버튼을 통한 개별 서비스 상세 페이지 이동

#### 자연스러운 시나리오 통합
- **정상 상태**: 모든 서비스가 running 상태로 표시
- **스케일링 시나리오**: 스케일링 컨트롤을 통해 자연스럽게 레플리카 조정
- **장애 복구**: failed 상태 서비스에 "문제 해결" 버튼 자동 표시

#### UI 구성요소
- 서비스 템플릿 선택기
- 실시간 서비스 상태 카드
- 레플리카 시각화 (점으로 표시)
- 네트워크 및 포트 정보
- 액션 버튼 (상세보기, 문제 해결, 삭제)

### 서비스 상세 페이지 (`service-details-page.tsx`)

개별 서비스의 상세 정보와 고급 관리 기능을 제공합니다:

#### 핵심 기능
- **서비스 상세 정보**: ID, 이미지, 생성일, 업데이트일 등 상세 정보 표시
- **롤링 업데이트**: 서비스 중단 없이 새로운 이미지로 업데이트
- **스케일링**: 레플리카 수 증가/감소 (+ / - 버튼)
- **서비스 재시작**: 현재 이미지로 서비스 재시작
- **서비스 삭제**: 확인 후 서비스 완전 삭제
- **리소스 모니터링**: CPU, 메모리 사용량 실시간 표시
- **네트워크 정보**: 포트 매핑, 네트워크 설정 표시

#### UI 구성요소
- 서비스 헤더 (이름, 이미지, 상태)
- 상태 카드 (상태, 레플리카, 배포 모드)
- 기본 정보 카드 (ID, 이미지, 생성일, 업데이트일)
- 네트워크 정보 카드 (포트 매핑, 네트워크)
- 리소스 사용량 카드 (CPU, 메모리 프로그레스 바)
- 롤링 업데이트 카드 (이미지 입력, 업데이트 버튼)
- 서비스 관리 카드 (재시작, 삭제 버튼)

## 라우팅

```tsx
// App.tsx
<Route path="/services" element={<ServicesPage />} />
<Route path="/services/:serviceId" element={<ServiceDetailsPage />} />
```

## 사용법

```tsx
import { ServicesPage, ServiceDetailsPage } from '@/pages/services';
import { Route } from 'react-router-dom';

export const App = () => {
  return (
    <>
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:serviceId" element={<ServiceDetailsPage />} />
    </>
  );
};
```

## API와의 통합

이 페이지들은 `@/shared/api/services`를 통해 백엔드 API와 통신합니다:

### 서비스 목록 페이지
- 서비스 목록 조회 (`useServices`)
- 서비스 생성 (`createService`)
- 서비스 삭제 (`deleteService`)
- 서비스 스케일링 (`scaleService`)

### 서비스 상세 페이지
- 개별 서비스 조회 (`useService`)
- 서비스 업데이트 (`useUpdateService`)
- 서비스 스케일링 (`useScaleService`)
- 서비스 삭제 (`useDeleteService`)

## 시나리오 기반 동작

페이지는 시나리오별로 다른 UI를 자연스럽게 표시합니다:
- **정상**: 모든 서비스 정상 작동, 스케일링 컨트롤 활성화
- **스케일링**: 레플리카 수 조정 시 실시간 반영
- **장애**: failed 서비스에 문제 해결 옵션 자동 표시
- **업데이트**: 롤링 업데이트 진행 상황 표시
- **삭제**: 확인 다이얼로그 후 안전한 삭제 