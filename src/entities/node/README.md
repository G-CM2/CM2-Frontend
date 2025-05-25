# 노드 엔티티 (Node Entity)

이 폴더는 Docker Swarm 클러스터의 노드와 관련된 도메인 로직과 데이터 모델을 포함합니다.

## 디렉토리 구조

```
node/
├── api/
│   └── fetch-cluster-topology.ts  # 클러스터 토폴로지 데이터 API
├── ui/
│   ├── node-card.tsx             # 노드 시각화 카드 컴포넌트
│   └── connection-line.tsx       # 노드 간 연결선 컴포넌트
├── types.ts                      # 노드 관련 타입 정의
├── README.md                     # 이 파일
└── index.ts                      # 공개 인터페이스
```

## 타입 정의

### Node
Docker Swarm 클러스터의 개별 노드를 나타내는 핵심 엔티티입니다.

**주요 속성:**
- `id`: 노드 고유 식별자
- `name`: 노드 이름
- `role`: 노드 역할 (manager | worker)
- `status`: 노드 상태 (active | inactive | failed | unknown)
- `position`: 토폴로지 뷰에서의 위치 좌표
- `ip`: 노드 IP 주소
- `resources`: CPU, 메모리, 디스크 리소스 정보
- `availability`: 노드 가용성 (active | pause | drain)

### NodeConnection
노드 간의 연결 관계를 나타냅니다.

**주요 속성:**
- `from`, `to`: 연결된 노드 ID
- `type`: 연결 타입 (management | data | heartbeat)
- `status`: 연결 상태 (active | inactive)

### ClusterTopology
전체 클러스터의 토폴로지 정보를 포함합니다.

## UI 컴포넌트

### NodeCard
개별 노드를 시각화하는 카드 컴포넌트입니다.

**기능:**
- 노드 상태에 따른 색상 구분
- 노드 역할 표시 (매니저/워커)
- 리소스 정보 표시
- 클릭 이벤트 처리
- 호버 효과 및 애니메이션

### ConnectionLine
노드 간의 연결을 시각화하는 SVG 라인 컴포넌트입니다.

**기능:**
- 연결 타입에 따른 선 스타일 (실선/점선/대시선)
- 연결 상태에 따른 색상 및 투명도
- 데이터 흐름 애니메이션
- 방향 표시 화살표

## API

### fetchClusterTopology
클러스터 토폴로지 데이터를 가져오는 비동기 함수입니다.

**반환값:** `Promise<ClusterTopology>`

현재는 목 데이터를 반환하며, 실제 환경에서는 Docker API와 연동됩니다.

## 사용 예시

```tsx
import { NodeCard, ConnectionLine, fetchClusterTopology } from '@/entities/node';

// 노드 카드 사용
<NodeCard 
  node={node} 
  onClick={(node) => console.log('Node clicked:', node.name)}
/>

// 연결선 사용 (SVG 내부에서)
<ConnectionLine 
  connection={connection} 
  nodes={nodes}
/>

// 토폴로지 데이터 가져오기
const topology = await fetchClusterTopology();
```

## 의존성

- `@/lib/utils`: 유틸리티 함수
- `@/components/ui/*`: shadcn/ui 컴포넌트
- `lucide-react`: 아이콘 라이브러리

이 엔티티는 Feature-Sliced Design에서 도메인 로직을 담당하며, 다른 엔티티에 의존하지 않습니다. 