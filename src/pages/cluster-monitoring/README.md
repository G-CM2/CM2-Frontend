# 클러스터 모니터링 페이지

교육용 쿠버네틱스 클러스터 모니터링 시각화 페이지입니다. 실시간 클러스터 상태를 시각적으로 표현하여 사용자가 쿠버네틱스 개념을 직관적으로 학습할 수 있도록 설계되었습니다.

## 목적

이 페이지는 다음과 같은 교육적 목표를 가집니다:

1. **클러스터 구조 이해**: 노드, 서비스, 컨테이너 간의 관계를 시각적으로 표현
2. **실시간 모니터링**: 실제 클러스터 상태를 실시간으로 관찰
3. **리소스 사용량 학습**: CPU, 메모리, 디스크 사용량을 통한 리소스 관리 개념 학습
4. **상태 변화 추적**: 시간에 따른 클러스터 상태 변화 관찰

## 구조

```
cluster-monitoring/
├── index.ts                           # 페이지 내보내기
├── cluster-monitoring-page.tsx        # 메인 페이지 컴포넌트
├── ui/                               # 페이지 전용 UI 컴포넌트들
│   ├── cluster-overview-card.tsx     # 클러스터 개요 카드
│   ├── node-status-grid.tsx          # 노드 상태 그리드
│   ├── resource-usage-charts.tsx     # 리소스 사용량 차트
│   ├── container-status-summary.tsx  # 컨테이너 상태 요약
│   ├── real-time-metrics.tsx         # 실시간 메트릭 표시
│   └── index.ts                      # UI 컴포넌트 내보내기
├── lib/                              # 페이지 전용 로직
│   ├── chart-utils.ts                # 차트 관련 유틸리티
│   ├── status-helpers.ts             # 상태 관련 헬퍼 함수
│   └── index.ts                      # 로직 내보내기
└── README.md                         # 이 파일
```

## 주요 기능

### 1. 클러스터 개요 (Cluster Overview)
- 클러스터 ID, 이름, 오케스트레이션 버전 표시
- Raft 상태 및 전체 클러스터 건강 상태
- 노드 수 및 매니저/워커 노드 구분

### 2. 노드 상태 시각화 (Node Status Visualization)
- 각 노드의 상태 (Ready, Down, Unknown)
- 노드 가용성 (Active, Pause, Drain)
- 매니저 노드의 리더십 상태

### 3. 리소스 사용량 대시보드 (Resource Usage Dashboard)
- CPU 사용률 실시간 차트
- 메모리 사용률 실시간 차트
- 디스크 사용률 실시간 차트
- 시간별 사용량 추이 그래프

### 4. 컨테이너 상태 요약 (Container Status Summary)
- 전체 컨테이너 수
- 실행 중인 컨테이너 수
- 중지된 컨테이너 수
- 오류 상태 컨테이너 수

### 5. 실시간 업데이트 (Real-time Updates)
- 5초마다 클러스터 정보 갱신
- 10초마다 시스템 요약 정보 갱신
- 시각적 로딩 인디케이터

## 사용된 API

이 페이지는 다음 API 엔드포인트를 사용합니다:

- `GET /` - 클러스터 정보 조회 (`useMonitoringInfo`)
- `GET /summary` - 시스템 요약 정보 조회 (`useSystemSummary`)

## 교육적 요소

### 1. 시각적 학습
- 색상 코딩을 통한 상태 구분 (녹색: 정상, 노란색: 경고, 빨간색: 오류)
- 애니메이션을 통한 데이터 변화 표현
- 직관적인 아이콘과 그래프 사용

### 2. 인터랙티브 요소
- 노드 클릭 시 상세 정보 표시
- 차트 호버 시 정확한 수치 표시
- 새로고침 버튼을 통한 수동 업데이트

### 3. 교육적 설명
- 각 메트릭에 대한 툴팁 설명
- 상태 변화에 대한 알림 메시지
- 용어 설명 및 도움말 제공

## 기술 스택

- **React Query**: 실시간 데이터 페칭 및 캐싱
- **Recharts**: 차트 및 그래프 시각화
- **Tailwind CSS**: 스타일링 및 반응형 디자인
- **Lucide React**: 아이콘
- **shadcn/ui**: UI 컴포넌트

## 사용 예시

```typescript
import { ClusterMonitoringPage } from '@/pages/cluster-monitoring';

// 라우터에서 사용
<Route path="/cluster-monitoring" element={<ClusterMonitoringPage />} />
```

## 확장 가능성

향후 다음과 같은 기능을 추가할 수 있습니다:

1. **알림 시스템**: 임계값 초과 시 알림
2. **히스토리 뷰**: 과거 데이터 조회 및 비교
3. **필터링**: 특정 노드나 서비스만 표시
4. **내보내기**: 현재 상태를 이미지나 PDF로 내보내기
5. **시뮬레이션 모드**: 가상 시나리오를 통한 학습

이 페이지는 쿠버네틱스 초보자가 클러스터의 동작 원리를 이해하고, 실제 운영 환경에서 모니터링의 중요성을 학습할 수 있도록 설계되었습니다. 