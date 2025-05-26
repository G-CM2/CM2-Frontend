# 클러스터 관리 (Cluster Management)

이 폴더는 Docker Swarm 클러스터의 토폴로지, 오토스케일링, 셀프 힐링 기능을 통합 관리하는 페이지를 포함합니다.

## 디렉토리 구조

```
cluster-topology/
├── ui/
│   └── cluster-topology-page.tsx  # 클러스터 관리 메인 페이지
└── index.ts                       # 내보내기
```

## 페이지 기능

**cluster-topology-page**: Docker Swarm 클러스터의 종합 관리 페이지입니다.

### 주요 기능
1. **클러스터 토폴로지**:
   - 매니저 노드와 워커 노드의 관계를 네트워크 다이어그램으로 표현
   - 각 노드의 상태(활성/비활성/장애)를 색상으로 구분
   - 노드 간 통신 흐름을 애니메이션으로 시각화
   - 노드 클릭 시 상세 정보 표시
   - 실시간 상태 업데이트

2. **오토스케일링 시뮬레이션**:
   - 실시간 메트릭 기반 오토스케일링 동작 시뮬레이션
   - CPU/메모리 사용률 실시간 차트
   - 임계값 기반 자동 스케일 아웃/인 실행
   - 컨테이너 스케일링 과정 애니메이션
   - 수동 스케일링 트리거 기능

3. **셀프 힐링 시뮬레이션**:
   - 컨테이너 장애 발생 시 자동 복구 과정 시뮬레이션
   - 5단계 복구 프로세스 타임라인 시각화
   - 다양한 장애 시나리오 지원 (컨테이너 크래시, 헬스체크 실패, 노드 장애)
   - 컨테이너 헬스 상태 실시간 모니터링
   - 복구 시간 및 다운타임 통계

### 탭 구성
페이지는 3개의 탭으로 구성되어 있습니다:
- **클러스터 토폴로지**: 네트워크 토폴로지 시각화
- **오토스케일링 시뮬레이션**: 자동 스케일링 기능 시뮬레이션
- **셀프 힐링 시뮬레이션**: 자동 복구 기능 시뮬레이션

### 사용하는 컴포넌트
- `@/widgets/cluster-topology-view`: 클러스터 토폴로지 시각화 위젯
- `@/widgets/autoscaling-simulation-view`: 오토스케일링 시뮬레이션 위젯
- `@/widgets/self-healing-simulation-view`: 셀프 힐링 시뮬레이션 위젯
- `@/components/ui/tabs`: 탭 네비게이션 컴포넌트

## 라우팅

이 페이지는 `/cluster-topology` 경로에 매핑됩니다.

## 의존성

### 위젯
- cluster-topology-view: 클러스터 토폴로지 시각화
- autoscaling-simulation-view: 오토스케일링 시뮬레이션
- self-healing-simulation-view: 셀프 힐링 시뮬레이션

### 엔티티
- node: 노드 관련 도메인 로직
- autoscaling: 오토스케일링 도메인 로직
- self-healing: 셀프 힐링 도메인 로직

### 기능
- node-interaction: 노드 상호작용 기능
- autoscaling-simulation: 오토스케일링 시뮬레이션 제어
- self-healing-simulation: 셀프 힐링 시뮬레이션 제어

### 공유
- layout: 페이지 레이아웃
- ui 컴포넌트들: shadcn/ui 기반 컴포넌트

## 확장 가이드
- 새로운 시뮬레이션 기능 추가 시 새 탭으로 확장
- 각 시뮬레이션은 독립적인 위젯으로 구성하여 재사용성 확보
- 실제 환경 연동 시 시뮬레이션 데이터를 실제 API로 교체 