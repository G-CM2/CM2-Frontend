# 클러스터 토폴로지 뷰 위젯 (Cluster Topology View Widget)

이 폴더는 Docker Swarm 클러스터의 토폴로지를 시각화하는 위젯을 포함합니다.

## 디렉토리 구조

```
cluster-topology-view/
├── ui/
│   └── cluster-topology-view.tsx  # 클러스터 토폴로지 시각화 위젯
├── README.md                      # 이 파일
└── index.ts                       # 공개 인터페이스
```

## 위젯 기능

### ClusterTopologyView
Docker Swarm 클러스터의 네트워크 토폴로지를 시각화하는 메인 위젯입니다.

**주요 기능:**
- 클러스터 통계 표시 (전체 노드, 매니저/워커 수, 활성/장애 노드 수)
- 노드 간 관계를 네트워크 다이어그램으로 시각화
- 노드 상태에 따른 색상 구분 (활성: 녹색, 비활성: 노란색, 장애: 빨간색)
- 연결 타입별 선 스타일 구분 (관리: 실선, 데이터: 점선)
- 실시간 데이터 흐름 애니메이션
- 노드 클릭 시 상세 정보 모달 표시
- 자동 새로고침 (30초 간격)
- 수동 새로고침 버튼

**시각화 요소:**
- **노드 카드**: 각 노드의 기본 정보와 상태를 표시
- **연결선**: 노드 간의 통신 관계를 시각화
- **애니메이션**: 활성 연결에서 데이터 흐름을 표현
- **범례**: 색상과 선 스타일의 의미를 설명

**상호작용:**
- 노드 클릭: 상세 정보 모달 열기
- 새로고침 버튼: 수동으로 데이터 업데이트
- 호버 효과: 노드에 마우스 오버 시 확대 효과

## 사용하는 컴포넌트

- `@/entities/node`: 노드 관련 엔티티 (NodeCard, ConnectionLine, fetchClusterTopology)
- `@/features/node-details`: 노드 상세 정보 모달
- `@/components/ui/*`: shadcn/ui 컴포넌트들

## 사용 예시

```tsx
import { ClusterTopologyView } from '@/widgets/cluster-topology-view';

export const ClusterPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">클러스터 토폴로지</h1>
      <ClusterTopologyView />
    </div>
  );
};
```

## 스타일링

위젯은 TailwindCSS를 사용하여 스타일링되며, 다음과 같은 디자인 특징을 가집니다:

- **반응형 레이아웃**: 다양한 화면 크기에 적응
- **색상 시스템**: 상태별 일관된 색상 사용
- **애니메이션**: 부드러운 전환 효과와 데이터 흐름 시각화
- **접근성**: 명확한 대비와 의미 있는 색상 사용

## 성능 고려사항

- **자동 새로고침**: 30초 간격으로 데이터 업데이트
- **메모리 관리**: 컴포넌트 언마운트 시 인터벌 정리
- **로딩 상태**: 데이터 로딩 중 적절한 피드백 제공
- **에러 처리**: 네트워크 오류 시 재시도 옵션 제공

이 위젯은 Feature-Sliced Design에서 레이아웃 블록 역할을 하며, 여러 엔티티와 기능을 조합하여 완전한 사용자 인터페이스를 제공합니다. 