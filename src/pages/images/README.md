# Images 페이지

이 디렉토리는 Docker 이미지 관리를 위한 페이지들을 포함합니다.

## 페이지 구성

### ImagesPage (index.tsx)

- Docker 이미지 목록을 표시하는 메인 페이지
- 이미지 조회, 삭제 등의 기능 지원
- 이미지 목록을 그리드 형태로 표시

## 파일 구조

```
images/
├── index.tsx       # 이미지 목록 페이지
├── README.md       # 문서
```

## 확장 방법

이미지 관련 기능을 확장하려면:

1. 이미지 상세 정보 페이지 추가:
   ```
   image-details.tsx    # 개별 이미지 상세 정보
   ```

2. 이미지 풀(Pull) 페이지 추가:
   ```
   image-pull.tsx       # 새 이미지 풀 페이지
   ```

3. 확장 후 페이지 구조:
   ```
   images/
   ├── index.tsx           # 이미지 목록 페이지
   ├── image-details.tsx   # 이미지 상세 정보
   ├── image-pull.tsx      # 이미지 풀 페이지
   ├── README.md           # 문서
   ```

## 주의사항

- 이미지 관련 비즈니스 로직은 `/entities/image`에 위치
- UI 컴포넌트는 `/entities/image/ui`에 위치
- API 호출은 `/shared/api/images.ts`에 정의 