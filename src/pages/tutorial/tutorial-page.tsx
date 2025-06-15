import { useTutorialStore } from '@/shared/stores/tutorial-store';
import { Card, CardContent } from '@/shared/ui/card/card';
import { Layout } from '@/widgets/layout';
import { BookOpen, LifeBuoy, Network, Server } from 'lucide-react';
import { useEffect, useRef } from 'react';

// 시나리오 하드코딩 (카드용, 실제 단계는 store에서 관리)
const scenarios = [
  {
    id: 'service-lifecycle',
    title: '서비스 생명주기 관리',
    description: '서비스 생성부터 삭제까지 전체 생명주기를 관리하는 방법을 학습합니다.',
    steps: 7,
    tourTarget: 'go-services',
  },
  {
    id: 'cluster-monitoring',
    title: '클러스터 모니터링',
    description: '클러스터 전체 상태와 개별 노드의 상태를 모니터링하는 방법을 학습합니다.',
    steps: 6,
    tourTarget: 'go-cluster',
  },
  {
    id: 'failure-handling',
    title: '장애 대응',
    description: '시스템 장애 상황을 시뮬레이션하고 대응하는 방법을 학습합니다.',
    steps: 5,
    tourTarget: 'go-cluster',
  },
  {
    id: 'scale-up',
    title: '서비스 스케일업',
    description: '서비스의 레플리카 수를 조정하여 확장하는 방법을 학습합니다.',
    steps: 4,
    tourTarget: 'go-services',
  },
];

export const TutorialPage = () => {
  const scenarioRefs = useRef<(HTMLDivElement | null)[]>([]);
  const openTutorial = useTutorialStore((s) => s.openTutorial);

  useEffect(() => {
    if (scenarioRefs.current[0]) {
      scenarioRefs.current[0].focus();
    }
  }, []);

  // 시나리오별 대표 아이콘 매핑
  const scenarioIcons: Record<string, React.ReactNode> = {
    'service-lifecycle': <Server className="w-8 h-8 text-blue-500" />,
    'cluster-monitoring': <Network className="w-8 h-8 text-green-500" />,
    'failure-handling': <LifeBuoy className="w-8 h-8 text-rose-500" />,
    'scale-up': <Server className="w-8 h-8 text-indigo-500" />,
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 py-12 mb-10 shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 z-10">
          <div className="flex flex-col items-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-white drop-shadow-lg" />
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow">Docker 컨테이너 관리 튜토리얼</h1>
          </div>
          <p className="text-lg text-white/90 mb-2">다양한 시나리오를 통해 Docker 컨테이너 관리 방법을 배워보세요.</p>
          <p className="text-base text-blue-100">실제 대시보드 환경에서 단계별로 실습하며 익힐 수 있습니다.</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none select-none">
          <BookOpen className="w-40 h-40 text-white" />
        </div>
      </section>

      {/* Tutorial Scenarios */}
      <section className="max-w-5xl mx-auto px-2 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {scenarios.map((scenario, index) => (
            <Card
              key={scenario.id}
              ref={el => {
                scenarioRefs.current[index] = el;
              }}
              tabIndex={0}
              className="cursor-pointer transition-transform hover:scale-[1.025] focus:outline-none focus:ring-2 focus:ring-blue-500 group"
              onClick={() => openTutorial(scenario.id)}
              data-tour={scenario.tourTarget}
            >
              <CardContent className="flex flex-col gap-2 min-h-[160px] justify-between">
                <div className="flex items-center gap-3 mb-2">
                  {/* 대표 아이콘 */}
                  {scenarioIcons[scenario.id] || <BookOpen className="w-8 h-8 text-blue-400" />}
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                    {scenario.title}
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2 flex-1">{scenario.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>{scenario.steps}단계</span>
                  <span>•</span>
                  <span>약 {Math.ceil(scenario.steps * 1.5)}분</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default TutorialPage; 