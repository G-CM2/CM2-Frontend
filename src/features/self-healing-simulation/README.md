# Self-Healing Simulation Feature

## 목적
셀프 힐링 시뮬레이션의 사용자 인터랙션과 제어 기능을 제공합니다.

## 책임 범위
- 셀프 힐링 시뮬레이션 제어 UI 제공
- 장애 시나리오 선택 기능
- 시뮬레이션 시작/일시정지/초기화 기능
- 복구 진행률 및 통계 표시

## 폴더 구조

### `/ui/`
셀프 힐링 시뮬레이션 제어 관련 UI 컴포넌트들:
- `healing-controls.tsx`: 시뮬레이션 제어 패널

### `/index.ts`
피처의 공개 인터페이스 (UI 컴포넌트 export)

## 주요 기능

### HealingControls 컴포넌트
1. **시나리오 선택**:
   - 드롭다운으로 장애 시나리오 선택
   - 시나리오별 설명 및 예상 다운타임 표시
   - 시뮬레이션 중에는 변경 불가

2. **시뮬레이션 제어**:
   - 시작/일시정지/초기화 버튼
   - 시나리오 선택 후 활성화

3. **진행 상태 표시**:
   - 현재 진행 단계 / 전체 단계
   - 시뮬레이션 상태 (대기/복구 진행중/복구 완료)
   - 전체 진행률 바

4. **복구 통계**:
   - 복구 시간 (초 단위)
   - 다운타임 (초 단위)
   - 실시간 업데이트

5. **현재 단계 정보**:
   - 진행 중인 단계의 제목 및 설명
   - 완료 시 성공 메시지 표시

## 지원 시나리오
1. **컨테이너 크래시**: 애플리케이션 오류로 인한 컨테이너 종료 (예상 다운타임: 10초)
2. **헬스체크 실패**: 헬스체크 엔드포인트 응답 실패 (예상 다운타임: 8초)
3. **노드 장애**: 워커 노드 전체 장애 발생 (예상 다운타임: 15초, 추가 재배치 단계 포함)

## 사용 방법
```tsx
import { HealingControls } from '@/features/self-healing-simulation';

<HealingControls
  simulation={simulationData}
  scenarios={availableScenarios}
  selectedScenario={selectedScenarioId}
  onStart={handleStart}
  onPause={handlePause}
  onReset={handleReset}
  onScenarioChange={handleScenarioChange}
/>
```

## 의존성
- `@/entities/self-healing`: 셀프 힐링 타입 및 데이터 모델
- `@/components/ui`: shadcn/ui 컴포넌트들 (Select, Card, Badge 등)
- `lucide-react`: 아이콘 컴포넌트들

## 상태 관리
- 시뮬레이션 상태는 부모 컴포넌트에서 관리
- 시나리오 선택은 로컬 상태로 관리
- 진행률 및 통계는 시뮬레이션 데이터에서 계산

## 확장 가이드
- 새로운 시나리오 추가 시 `HealingScenario` 타입에 추가
- 추가 제어 기능은 `HealingControls` 컴포넌트 확장
- 복잡한 시각화는 별도 컴포넌트로 분리하여 `/ui/` 폴더에 추가
- 상태 로직이 복잡해지면 커스텀 훅으로 분리 고려 