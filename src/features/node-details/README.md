# 노드 상세 정보 기능 (Node Details Feature)

이 폴더는 Docker Swarm 클러스터 노드의 상세 정보를 표시하는 기능을 포함합니다.

## 디렉토리 구조

```
node-details/
├── ui/
│   └── node-details-modal.tsx  # 노드 상세 정보 모달 컴포넌트
├── README.md                   # 이 파일
└── index.ts                    # 공개 인터페이스
```

## 기능 설명

### NodeDetailsModal
노드의 상세 정보를 모달 형태로 표시하는 컴포넌트입니다.

**주요 기능:**
- 노드 기본 정보 표시 (ID, 호스트명, IP 주소, Docker 엔진 버전)
- 노드 상태 및 역할 표시 (매니저/워커, 활성/비활성/장애)
- 리소스 정보 시각화 (CPU, 메모리, 디스크)
- 노드 라벨 표시
- 생성일 및 마지막 업데이트 시간 표시

**표시 정보:**

1. **기본 정보**
   - 노드 ID (고유 식별자)
   - 호스트명
   - IP 주소
   - Docker 엔진 버전

2. **상태 정보**
   - 역할 (manager/worker)
   - 상태 (active/inactive/failed)
   - 가용성 (active/pause/drain)

3. **리소스 정보**
   - CPU 코어 수
   - 메모리 용량 (GB)
   - 디스크 용량 (GB)

4. **라벨**
   - 노드에 할당된 키-값 라벨들

5. **타임스탬프**
   - 노드 생성일
   - 마지막 업데이트 시간

## 컴포넌트 Props

```tsx
interface NodeDetailsModalProps {
  node: Node | null;           // 표시할 노드 정보
  open: boolean;               // 모달 열림/닫힘 상태
  onOpenChange: (open: boolean) => void;  // 모달 상태 변경 핸들러
}
```

## 사용 예시

```tsx
import { NodeDetailsModal } from '@/features/node-details';
import { useState } from 'react';

export const ClusterView = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setShowModal(true);
  };

  return (
    <div>
      {/* 노드 목록 또는 토폴로지 뷰 */}
      
      <NodeDetailsModal
        node={selectedNode}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </div>
  );
};
```

## 스타일링

모달은 다음과 같은 디자인 특징을 가집니다:

- **반응형 레이아웃**: 최대 너비 2xl, 최대 높이 80vh
- **스크롤 지원**: 내용이 많을 경우 세로 스크롤
- **색상 구분**: 상태별 배지 색상 (활성: 기본, 비활성: 보조, 장애: 위험)
- **아이콘 사용**: 각 정보 섹션에 적절한 아이콘 표시
- **카드 레이아웃**: 정보를 논리적 그룹으로 구분

## 의존성

- `@/entities/node`: Node 타입 정의
- `@/components/ui/*`: shadcn/ui 컴포넌트들
- `lucide-react`: 아이콘 라이브러리

## 확장 가능성

향후 다음과 같은 기능을 추가할 수 있습니다:

- 노드 실시간 메트릭 표시
- 노드에서 실행 중인 컨테이너 목록
- 노드 관리 작업 (드레인, 활성화 등)
- 노드 로그 조회
- 노드 성능 차트

이 기능은 Feature-Sliced Design에서 사용자 상호작용을 담당하며, 노드 엔티티와 UI 컴포넌트를 조합하여 완전한 사용자 경험을 제공합니다. 