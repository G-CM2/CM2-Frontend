# CM2-Frontend

Docker 컨테이너 관리를 위한 대시보드 애플리케이션입니다.

## 기술 스택

- **React**: UI 라이브러리
- **TypeScript**: 정적 타입 시스템
- **Vite**: 빌드 도구
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **shadcn/ui**: 재사용 가능한 UI 컴포넌트
- **Feature-Sliced Design**: 프로젝트 구조 아키텍처

## 프로젝트 구조

```
src/
├── app/         # 앱 수준 설정 (라우팅, 레이아웃, 테마, 프로바이더)
├── pages/       # 라우트 매핑
├── processes/   # 상위 수준 비즈니스 흐름
├── widgets/     # 레이아웃 블록 (예: 헤더, 사이드바)
├── features/    # 기능 단위 (예: 로그인 폼)
├── entities/    # 도메인 로직 및 모델 (예: 사용자)
├── shared/      # 전역 UI, 유틸리티, 타입 (비즈니스 로직 없음)
└── index.tsx
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 개발 가이드라인

- **클린 코드**: 의미 있는 이름, 작은 함수, DRY 원칙 적용
- **React 모범 사례**: 함수형 컴포넌트, 훅 규칙 준수, 적절한 상태 관리
- **Tailwind CSS**: 유틸리티 클래스 사용, 컴포넌트 스타일 일관성 유지
- **TypeScript**: 인터페이스 사용, 명확한 타입 정의, 엄격한 타입 체크
- **FSD 원칙**: 레이어 간 의존성 규칙 준수, 단방향 의존성 유지
