# Features Layer

피처 레이어는 사용자 상호작용과 비즈니스 기능을 담당합니다.

## 📁 구조

```
features/
├── container-control/      # 단일 컨테이너 제어 기능
│   ├── ui/                # 컨테이너 액션 버튼
│   ├── index.ts           # 공개 API
│   └── README.md          # 기능 문서
└── README.md              # 이 파일
```

## 🎯 책임

### Container Control Feature
- 개별 컨테이너에 대한 액션 버튼 제공
- 컨테이너 시작/중지/재시작/삭제 등의 단일 액션 처리

## 📋 규칙

1. **기능 독립성**: 각 피처는 독립적으로 동작
2. **엔티티 활용**: entities 레이어의 도메인 로직 활용
3. **UI 집중**: 사용자 상호작용에 집중
4. **재사용성**: 여러 페이지에서 사용 가능한 구조

## 🔄 확장 가이드

새로운 피처 추가 시:
1. 기능별 폴더 생성
2. `ui/`, `lib/`, `api/` 구조 유지
3. `index.ts`에서 공개 API 정의
4. README.md로 기능 문서화
5. 이 README 업데이트

## 📝 예시

```typescript
// features/container-control/ui/container-action-button.tsx
export const ContainerActionButton = ({ action, containerId }) => {
  // 컨테이너 액션 처리 로직
};

// features/container-control/index.ts
export { ContainerActionButton } from './ui/container-action-button';
``` 