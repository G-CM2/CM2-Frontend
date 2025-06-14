# 서비스 페이지

이 폴더는 Docker Swarm 서비스 관련 페이지들을 포함합니다.

## 구조

- `services-page.tsx` - 서비스 관리 메인 페이지
- `index.ts` - 공개 API

## 페이지 역할

### 서비스 관리 페이지

Docker Swarm 서비스의 생성, 관리, 모니터링을 담당합니다. 이 페이지는 다음을 제공합니다:

#### 핵심 기능
- **서비스 생성**: 사전 정의된 템플릿(nginx, redis)을 통한 빠른 서비스 생성
- **서비스 삭제**: 불필요한 서비스 제거
- **실시간 스케일링**: 레플리카 수 증가/감소를 통한 동적 스케일링
- **상태 모니터링**: 서비스와 컨테이너의 running/stopped/failed 상태 실시간 표시

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

## 사용법

```tsx
import { ServicesPage } from '@/pages/services';
import { Route } from 'react-router-dom';

export const App = () => {
  return (
    <Route path="/services" element={<ServicesPage />} />
  );
};
```

## API와의 통합

이 페이지는 `@/shared/api/services`를 통해 백엔드 API와 통신합니다:
- 서비스 목록 조회 (`useServices`)
- 서비스 생성 (`createService`)
- 서비스 삭제 (`deleteService`)
- 서비스 스케일링 (`scaleService`)

## 시나리오 기반 동작

페이지는 시나리오별로 다른 UI를 자연스럽게 표시합니다:
- **정상**: 모든 서비스 정상 작동, 스케일링 컨트롤 활성화
- **스케일링**: 레플리카 수 조정 시 실시간 반영
- **장애**: failed 서비스에 문제 해결 옵션 자동 표시 