# 배포 시뮬레이션 기능 (Deployment Simulation Feature)

이 폴더는 서비스 배포 과정을 시뮬레이션하고 제어하는 기능을 포함합니다.

## 디렉토리 구조

```
deployment-simulation/
├── ui/
│   └── deployment-controls.tsx     # 시뮬레이션 제어 컴포넌트
├── README.md                       # 이 파일
└── index.ts                        # 공개 인터페이스
```

## 기능 설명

### DeploymentControls
배포 시뮬레이션을 제어하고 진행 상황을 표시하는 컴포넌트입니다.

**주요 기능:**
- 서비스 정보 표시 (이름, 이미지, 레플리카 수, 상태)
- 시뮬레이션 제어 (시작/일시정지/초기화)
- 배포 단계별 진행 상황 표시
- 단계별 직접 이동 기능
- 상태 범례 제공

**제어 기능:**
1. **시작/일시정지**: 시뮬레이션 실행 제어
2. **초기화**: 모든 상태를 초기값으로 리셋
3. **단계 이동**: 특정 배포 단계로 직접 이동

**표시 정보:**

1. **서비스 정보**
   - 서비스명
   - 컨테이너 이미지
   - 레플리카 수
   - 현재 상태

2. **배포 단계**
   - 이미지 풀링
   - 컨테이너 생성
   - 서비스 시작
   - 로드 밸런서 설정

3. **상태 범례**
   - 대기중 (회색)
   - 이미지 풀링 (파란색)
   - 시작중 (노란색)
   - 실행중 (녹색)

## 컴포넌트 인터페이스

```typescript
interface DeploymentControlsProps {
  simulation: DeploymentSimulation;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepChange: (step: number) => void;
}
```

## 사용 예시

```typescript
import { DeploymentControls } from '@/features/deployment-simulation';

<DeploymentControls
  simulation={simulation}
  onStart={handleStart}
  onPause={handlePause}
  onReset={handleReset}
  onStepChange={handleStepChange}
/>
```

## 상태 관리

이 기능은 다음과 같은 상태를 관리합니다:

- **시뮬레이션 실행 상태**: 시작/중지 여부
- **현재 단계**: 진행 중인 배포 단계
- **단계별 상태**: 각 단계의 완료/진행/대기 상태
- **서비스 상태**: 전체 서비스의 배포 상태

## 스타일링

컴포넌트는 다음과 같은 UI 특징을 가집니다:

- **카드 기반 레이아웃**: 정보를 구조화하여 표시
- **상태별 색상**: 직관적인 상태 구분
- **인터랙티브 요소**: 클릭 가능한 단계 및 버튼
- **반응형 디자인**: 다양한 화면 크기 지원

## 확장 가능성

이 기능은 다음과 같이 확장할 수 있습니다:

- 배포 설정 편집 기능
- 배포 히스토리 저장/불러오기
- 실시간 로그 표시
- 배포 실패 시 롤백 기능
- 다양한 배포 전략 선택 