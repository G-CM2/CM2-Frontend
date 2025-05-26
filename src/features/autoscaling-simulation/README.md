# Autoscaling Simulation Feature

## 목적
오토스케일링 시뮬레이션의 사용자 인터랙션과 제어 기능을 제공합니다.

## 책임 범위
- 오토스케일링 시뮬레이션 제어 UI 제공
- 시뮬레이션 시작/일시정지/초기화 기능
- 수동 스케일링 트리거 기능
- 실시간 상태 및 이벤트 표시

## 폴더 구조

### `/ui/`
오토스케일링 시뮬레이션 제어 관련 UI 컴포넌트들:
- `autoscaling-controls.tsx`: 시뮬레이션 제어 패널

### `/index.ts`
피처의 공개 인터페이스 (UI 컴포넌트 export)

## 주요 기능

### AutoscalingControls 컴포넌트
1. **시뮬레이션 제어**:
   - 시작/일시정지/초기화 버튼
   - 현재 상태 표시 (모니터링/스케일링/안정화)

2. **현재 상태 표시**:
   - 현재 레플리카 수
   - 목표 레플리카 수
   - 시뮬레이션 단계

3. **임계값 정보**:
   - CPU/메모리 스케일 아웃 임계값
   - CPU/메모리 스케일 인 임계값

4. **수동 제어**:
   - 수동 스케일 아웃 트리거
   - 수동 스케일 인 트리거
   - 시뮬레이션 중에는 비활성화

5. **이벤트 히스토리**:
   - 최근 3개 스케일링 이벤트 표시
   - 이벤트 타입 및 레플리카 변화 정보

## 사용 방법
```tsx
import { AutoscalingControls } from '@/features/autoscaling-simulation';

<AutoscalingControls
  simulation={simulationData}
  onStart={handleStart}
  onPause={handlePause}
  onReset={handleReset}
  onTriggerScaleOut={handleScaleOut}
  onTriggerScaleIn={handleScaleIn}
/>
```

## 의존성
- `@/entities/autoscaling`: 오토스케일링 타입 및 데이터 모델
- `@/components/ui`: shadcn/ui 컴포넌트들
- `lucide-react`: 아이콘 컴포넌트들

## 확장 가이드
- 새로운 제어 기능 추가 시 `AutoscalingControls` 컴포넌트 확장
- 추가 시각화 요소는 새로운 컴포넌트로 분리하여 `/ui/` 폴더에 추가
- 복잡한 상태 로직은 별도 훅으로 분리 고려 