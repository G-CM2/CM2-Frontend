# 롤링 업데이트 모달 위젯

이 위젯은 Docker 서비스의 롤링 업데이트 진행 상황을 실시간으로 시각화하는 모달 컴포넌트를 제공합니다.

## 구조

- `ui/rolling-update-modal.tsx` - 롤링 업데이트 진행 상황 모달 컴포넌트
- `index.ts` - 공개 API

## 기능

### 롤링 업데이트 시뮬레이션
- **3단계 진행**: 이미지 다운로드 → 컨테이너 업데이트 → 헬스체크
- **실시간 진행률**: 전체 진행률과 단계별 상태 표시
- **검증 단계**: 5초 카운트다운으로 안정성 확인
- **자동 완료**: 업데이트 완료 후 자동으로 모달 닫기

### UI 특징
- **상태별 아이콘**: 대기(시계), 진행(회전), 완료(체크)
- **색상 코딩**: 단계별 상태에 따른 색상 변화
- **진행률 바**: 시각적 진행 상황 표시
- **로그 시뮬레이션**: Docker CLI와 유사한 로그 출력

### 사용법

```tsx
import { RollingUpdateModal } from '@/widgets/rolling-update-modal';

const ServicePage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleUpdateComplete = () => {
    // 업데이트 완료 후 처리 로직
    console.log('롤링 업데이트 완료');
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        롤링 업데이트 시작
      </button>
      
      <RollingUpdateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        serviceName="my-service"
        serviceId="abc123def456"
        onComplete={handleUpdateComplete}
      />
    </div>
  );
};
```

## Props

### RollingUpdateModalProps

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `isOpen` | `boolean` | ✓ | 모달 표시 여부 |
| `onClose` | `() => void` | ✓ | 모달 닫기 콜백 |
| `serviceName` | `string` | ✓ | 서비스 이름 |
| `serviceId` | `string` | ✓ | 서비스 ID |
| `onComplete` | `() => void` | ✓ | 업데이트 완료 콜백 |

## 동작 흐름

1. **모달 열기**: `isOpen=true`로 모달 표시
2. **초기화**: 1초 대기 후 업데이트 시작
3. **단계별 진행**: 각 단계마다 2-5초 랜덤 진행
4. **검증 단계**: 5초 카운트다운으로 안정성 확인
5. **완료**: `onComplete` 콜백 호출 후 2초 뒤 자동 닫기

## 기술적 특징

- **비동기 시뮬레이션**: Promise 기반 단계별 진행
- **상태 관리**: 각 단계의 상태를 독립적으로 관리
- **자동 정리**: 모달 닫힐 때 모든 상태 초기화
- **사용자 경험**: 진행 중에는 모달 닫기 비활성화

## 확장 가능성

- 실제 Docker API와 연동하여 실시간 업데이트 상황 반영
- 에러 상황 처리 및 롤백 기능 추가
- 다양한 업데이트 전략 지원 (blue-green, canary 등)
- 업데이트 로그 저장 및 히스토리 관리 