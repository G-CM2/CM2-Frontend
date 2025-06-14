# Entities Layer

엔티티 레이어는 비즈니스 도메인의 핵심 로직과 데이터 모델을 담당합니다.

## 📁 구조

```
entities/
├── container/          # 컨테이너 도메인 로직
│   ├── model/         # 컨테이너 상태 관리
│   ├── ui/            # 컨테이너 UI 컴포넌트
│   ├── types/         # 컨테이너 타입 정의
│   └── index.ts       # 공개 API
└── README.md          # 이 파일
```

## 🎯 책임

### Container Entity
- 컨테이너의 상태와 속성 정의
- 컨테이너 관련 UI 컴포넌트 제공
- 컨테이너 데이터 타입 정의

## 📋 규칙

1. **도메인 순수성**: 비즈니스 로직만 포함, UI 프레임워크에 의존하지 않음
2. **타입 안전성**: 모든 데이터 구조에 대한 TypeScript 타입 정의
3. **재사용성**: 다른 레이어에서 쉽게 사용할 수 있는 인터페이스 제공
4. **독립성**: 다른 엔티티에 직접 의존하지 않음

## 🔄 확장 가이드

새로운 엔티티 추가 시:
1. 도메인별 폴더 생성
2. `types/`, `model/`, `ui/` 구조 유지
3. `index.ts`에서 공개 API 정의
4. 이 README 업데이트

## 📝 예시

```typescript
// entities/container/types/index.ts
export interface Container {
  id: string;
  name: string;
  status: ContainerStatus;
}

// entities/container/index.ts
export type { Container } from './types';
export { ContainerCard } from './ui/container-card';
``` 