# Docker Container Management Dashboard Frontend 

Docker 컨테이너 모니터링 및 관리를 위한 웹 대시보드입니다.

## 기술 스택

- **React**: UI 컴포넌트 라이브러리
- **TypeScript**: 정적 타입 지원
- **Vite**: 빌드 도구
- **TailwindCSS**: CSS 프레임워크
- **Tanstack Query**: 서버 상태 관리 및 데이터 페칭

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
├── pages/       # 페이지 구성
├── widgets/     # 레이아웃 블록 (헤더, 사이드바 등)
├── features/    # 기능 단위 (로그인 폼 등)
├── entities/    # 도메인 로직 및 모델 (사용자 등)
├── shared/      # 전역 UI, 유틸리티, 타입 (비즈니스 로직 없음)
```

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
