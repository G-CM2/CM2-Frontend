# 서비스 배포 엔티티 (Service Deployment Entity)

이 폴더는 Docker Swarm 서비스 배포와 관련된 도메인 로직과 데이터 모델을 포함합니다.

## 디렉토리 구조

```
service-deployment/
├── types.ts                        # 서비스 배포 관련 타입 정의
├── api/
│   └── fetch-deployment-simulation.ts  # 배포 시뮬레이션 데이터 API
├── ui/
│   ├── replica-container.tsx        # 컨테이너 레플리카 시각화 컴포넌트
│   └── traffic-flow.tsx            # 트래픽 흐름 시각화 컴포넌트
├── README.md                       # 이 파일
└── index.ts                        # 공개 인터페이스
```

## 타입 정의

### ServiceDeployment
서비스 배포 정보를 나타내는 기본 타입입니다.

**속성:**
- `id`: 서비스 고유 식별자
- `name`: 서비스명
- `image`: 컨테이너 이미지
- `replicas`: 레플리카 수
- `status`: 배포 상태 (pending/deploying/running/failed)
- `created_at`, `updated_at`: 생성/수정 시간

### DeploymentStep
배포 과정의 각 단계를 나타냅니다.

**속성:**
- `step`: 단계 번호
- `title`: 단계 제목
- `description`: 단계 설명
- `status`: 단계 상태
- `duration`: 애니메이션 지속 시간

### ContainerReplica
개별 컨테이너 레플리카 정보입니다.

**속성:**
- `serviceId`: 소속 서비스 ID
- `nodeId`: 배포된 노드 ID
- `status`: 컨테이너 상태 (pending/pulling/starting/running/failed)
- `position`: 시각화 좌표
- `resources`: CPU/메모리 리소스

### LoadBalancerTraffic
로드 밸런서 트래픽 흐름 정보입니다.

**속성:**
- `source`: 트래픽 시작점 좌표
- `target`: 트래픽 목적지 (노드/레플리카)
- `weight`: 트래픽 가중치 (1-100)
- `active`: 활성 상태

## UI 컴포넌트

### ReplicaContainer
컨테이너 레플리카를 시각적으로 표현하는 SVG 컴포넌트입니다.

**기능:**
- 상태별 색상 구분 (대기/풀링/시작/실행/실패)
- 상태별 아이콘 및 애니메이션
- 리소스 정보 표시
- 배포 과정 애니메이션 효과

### TrafficFlow
로드 밸런서에서 컨테이너로의 트래픽 흐름을 시각화합니다.

**기능:**
- 곡선 경로로 트래픽 흐름 표현
- 가중치에 따른 선 두께 조절
- 데이터 패킷 애니메이션
- 활성/비활성 상태 구분

## API

### fetchDeploymentSimulation
배포 시뮬레이션에 필요한 모든 데이터를 가져옵니다.

**반환값:**
- 서비스 정보
- 배포 단계 목록
- 레플리카 배치 정보
- 트래픽 흐름 데이터

## 사용 예시

```typescript
import { 
  DeploymentSimulation, 
  fetchDeploymentSimulation,
  ReplicaContainer,
  TrafficFlow 
} from '@/entities/service-deployment';

// 시뮬레이션 데이터 로드
const simulation = await fetchDeploymentSimulation();

// 컴포넌트 사용
<ReplicaContainer replica={replica} isAnimating={true} />
<TrafficFlow traffic={traffic} isActive={true} />
```

## 확장 가능성

이 엔티티는 다음과 같은 기능으로 확장할 수 있습니다:

- 실제 Docker API 연동
- 다양한 배포 전략 지원 (rolling update, blue-green 등)
- 실시간 메트릭 연동
- 배포 히스토리 관리
- 롤백 기능 