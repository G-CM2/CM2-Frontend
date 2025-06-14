# Widgets Layer

위젯 레이어는 페이지의 레이아웃 블록과 복합 UI 컴포넌트를 담당합니다.

## 📁 구조

```
widgets/
├── header/                 # 헤더 위젯
│   ├── ui/                # 헤더 컴포넌트
│   ├── index.ts           # 공개 API
│   └── README.md          # 위젯 문서
├── sidebar/               # 사이드바 위젯
│   ├── ui/                # 사이드바 컴포넌트
│   ├── index.ts           # 공개 API
│   └── README.md          # 위젯 문서
├── layout/                # 레이아웃 위젯
│   ├── ui/                # 레이아웃 컴포넌트
│   ├── index.ts           # 공개 API
│   └── README.md          # 위젯 문서
├── index.ts               # 모든 위젯 export
└── README.md              # 이 파일
```

## 🎯 책임

### Header Widget
- 애플리케이션 상단 헤더 UI
- 네비게이션 및 사용자 정보 표시

### Sidebar Widget
- 사이드 네비게이션 메뉴
- 페이지 간 이동 링크 제공

### Layout Widget
- 전체 페이지 레이아웃 구조
- Header와 Sidebar를 조합한 메인 레이아웃

## 📋 규칙

1. **레이아웃 집중**: 페이지 구조와 레이아웃에 집중
2. **컴포지션**: 여러 features와 entities를 조합
3. **재사용성**: 여러 페이지에서 공통으로 사용
4. **독립성**: 비즈니스 로직 포함하지 않음

## 🔄 확장 가이드

새로운 위젯 추가 시:
1. 위젯별 폴더 생성
2. `ui/` 구조 유지
3. `index.ts`에서 공개 API 정의
4. README.md로 위젯 문서화
5. 메인 `index.ts`에 export 추가
6. 이 README 업데이트

## 📝 예시

```typescript
// widgets/header/ui/header.tsx
export const Header = () => {
  return (
    <header className="...">
      {/* 헤더 내용 */}
    </header>
  );
};

// widgets/header/index.ts
export { Header } from './ui/header';
``` 