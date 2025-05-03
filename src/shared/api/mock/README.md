# API 모킹 (MSW)

이 폴더는 [Mock Service Worker (MSW)](https://mswjs.io/)를 사용한 API 모킹 구현을 포함합니다.

## 구조

- `handlers.ts` - API 엔드포인트별 모킹 핸들러를 정의합니다.
- `index.ts` - MSW 워커를 설정하고 내보냅니다.

## 사용법

1. 개발 모드에서 MSW는 애플리케이션이 시작될 때 자동으로 활성화됩니다.
2. 새로운 API 엔드포인트를 추가하려면 `handlers.ts` 파일에 핸들러를 추가하세요.
3. 실제 API 서버가 개발되면 MSW 사용을 점진적으로 중단할 수 있습니다.

## 환경설정

MSW는 개발 환경(`NODE_ENV === 'development'`)에서만 활성화됩니다. 프로덕션 빌드에서는 모킹이 제외됩니다.

## 관련 파일

- `/public/mockServiceWorker.js` - MSW 서비스 워커 파일
- `main.tsx` - MSW 초기화 코드 