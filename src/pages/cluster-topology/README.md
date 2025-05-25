# 클러스터 토폴로지 (Cluster Topology)

이 폴더는 Docker Swarm 클러스터의 토폴로지를 시각화하는 페이지를 포함합니다.

## 디렉토리 구조

```
cluster-topology/
├── ui/
│   └── cluster-topology-page.tsx  # 클러스터 토폴로지 메인 페이지
└── index.ts                       # 내보내기
```

## 페이지 기능

**cluster-topology-page**: Docker Swarm 클러스터의 네트워크 토폴로지를 시각화하는 페이지입니다.

### 주요 기능
- 매니저 노드와 워커 노드의 관계를 네트워크 다이어그램으로 표현
- 각 노드의 상태(활성/비활성/장애)를 색상으로 구분
- 노드 간 통신 흐름을 애니메이션으로 시각화
- 노드 클릭 시 상세 정보 표시
- 실시간 상태 업데이트

### 사용하는 컴포넌트
- `@/widgets/cluster-topology-view`: 클러스터 토폴로지 시각화 위젯
- `@/entities/node`: 노드 관련 엔티티
- `@/features/node-interaction`: 노드 상호작용 기능

## 라우팅

이 페이지는 `/cluster-topology` 경로에 매핑됩니다.

## 의존성

- 위젯: cluster-topology-view
- 엔티티: node
- 기능: node-interaction
- 공유: layout, ui 컴포넌트들 