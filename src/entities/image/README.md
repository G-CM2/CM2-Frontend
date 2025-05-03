# Image Entity

이 디렉토리는 Docker 이미지와 관련된 도메인 로직과 UI 컴포넌트를 포함합니다.

## 구조

- `/types`: Docker 이미지의 타입 정의
- `/ui`: 이미지 관련 UI 컴포넌트 (이미지 목록, 이미지 카드 등)

## 핵심 컴포넌트

### ImageList

이미지 목록을 표시하는 컴포넌트입니다. 페이지네이션을 지원하며 모든 Docker 이미지를 그리드 레이아웃으로 표시합니다.

### ImageCard

개별 이미지의 정보를 표시하는 카드 컴포넌트입니다.

## 사용 방법

```tsx
// 이미지 목록 표시
import { ImageList } from '@/entities/image';

const ImagesPage = () => {
  return (
    <div>
      <h1>Docker 이미지</h1>
      <ImageList />
    </div>
  );
};

// 개별 이미지 카드 표시
import { ImageCard } from '@/entities/image';

const SingleImageComponent = ({ image }) => {
  return (
    <div>
      <h2>이미지 상세 정보</h2>
      <ImageCard 
        image={image}
        onDelete={(id) => handleImageDelete(id)}
      />
    </div>
  );
};
```

## 확장 방법

이미지 관련 기능을 확장하려면:

1. `/types`에 새로운 타입이나 인터페이스 추가
2. `/ui`에 새로운 UI 컴포넌트 추가 (필요한 경우)
3. 메인 `index.ts` 파일에서 해당 요소를 내보내기 