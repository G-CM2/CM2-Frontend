# App

이 디렉토리는 애플리케이션 수준의 설정과 구성을 포함합니다:

- 라우팅 설정
- 레이아웃
- 테마
- 프로바이더
- 전역 스타일

## 디렉토리 구조

```
app/
├── providers/        # 애플리케이션 프로바이더
│   └── query-provider.tsx  # TanStack Query 설정
├── App.tsx           # 루트 애플리케이션 컴포넌트
└── index.ts          # 내보내기 파일
```

## 파일 설명

- **App.tsx**: 애플리케이션의 진입점이 되는 컴포넌트입니다. 레이아웃과 라우팅을 포함합니다.
- **providers/query-provider.tsx**: TanStack Query의 QueryClient를 설정하고 QueryClientProvider를 제공합니다.
- **index.ts**: App 컴포넌트를 내보내는 파일입니다.

## 확장 방법

새로운 전역 프로바이더가 필요한 경우:

1. `providers/` 디렉토리에 새 프로바이더 파일을 생성합니다.
2. `providers/index.tsx`에서 새 프로바이더를 포함시킵니다.

라우팅 설정이 필요한 경우:

1. React Router의 RouterProvider를 `providers/router-provider.tsx`에 구현합니다.
2. 라우트 설정을 `routes.tsx` 파일에 정의합니다. 