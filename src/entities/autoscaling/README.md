# Autoscaling Entity

## 목적
Docker 컨테이너의 오토스케일링 기능과 관련된 도메인 로직과 데이터 모델을 관리합니다.

## 책임 범위
- 오토스케일링 메트릭 데이터 모델 정의
- 스케일링 임계값 및 이벤트 타입 정의
- 오토스케일링 시뮬레이션 상태 관리
- 메트릭 차트 및 스케일링 애니메이션 UI 컴포넌트 제공

## 폴더 구조

### `/types.ts`
오토스케일링과 관련된 모든 TypeScript 타입 정의:
- `AutoscalingMetrics`: CPU/메모리 사용률 메트릭
- `AutoscalingThreshold`: 스케일 아웃/인 임계값
- `AutoscalingEvent`: 스케일링 이벤트 정보
- `AutoscalingSimulation`: 시뮬레이션 전체 상태
- `ServiceMetrics`: 서비스별 메트릭 정보

### `/api/`
오토스케일링 데이터 API 관련 함수들:
- `fetch-autoscaling-simulation.ts`: 시뮬레이션 데이터 조회 및 목 데이터 생성

### `/ui/`
오토스케일링 관련 UI 컴포넌트들:
- `metrics-chart.tsx`: 실시간 메트릭 차트 (SVG 기반)
- `scaling-animation.tsx`: 스케일링 과정 애니메이션

### `/index.ts`
엔티티의 공개 인터페이스 (타입, API, UI 컴포넌트 export)

## 주요 기능
1. **실시간 메트릭 시각화**: CPU/메모리 사용률을 실시간 라인 차트로 표시
2. **임계값 표시**: 스케일 아웃/인 임계값을 차트에 점선으로 표시
3. **스케일링 애니메이션**: 컨테이너 추가/제거 과정을 시각적으로 표현
4. **상태별 색상 구분**: 컨테이너 상태(실행중/시작중/중지중)에 따른 색상 표시

## 확장 가이드
- 새로운 메트릭 타입 추가 시 `AutoscalingMetrics` 인터페이스 확장
- 새로운 스케일링 정책 추가 시 `AutoscalingThreshold` 구조 수정
- 추가 시각화 컴포넌트는 `/ui/` 폴더에 추가
- API 엔드포인트 추가 시 `/api/` 폴더에 새 파일 생성 