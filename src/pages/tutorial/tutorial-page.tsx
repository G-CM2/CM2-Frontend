import { useTutorialStore } from '@/shared/stores/tutorial-store';
import { useEffect, useRef } from 'react';

export const TutorialPage = () => {
  const { scenarios, openTutorial, isOpen } = useTutorialStore();
  const scenarioRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (scenarioRefs.current[0]) {
      scenarioRefs.current[0].focus();
    }
  }, []);

  const handleStartTutorial = (scenarioId: string) => {
    openTutorial(scenarioId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-0 px-0">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-blue-400 py-16 mb-10 shadow-lg">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Docker 컨테이너 관리 튜토리얼</h1>
          <p className="text-lg text-white">다양한 시나리오를 통해 Docker 컨테이너 관리 방법을 배워보세요.</p>
        </div>
      </section>

      {/* Tutorial Scenarios */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((scenario, index) => (
            <div
              key={scenario.id}
              ref={el => {
                scenarioRefs.current[index] = el;
              }}
              tabIndex={0}
              className="bg-white shadow-md rounded-lg p-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleStartTutorial(scenario.id)}
            >
              <h2 className="text-xl font-semibold mb-2">{scenario.title}</h2>
              <p className="text-gray-700">{scenario.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 오버레이(투어) 진행 시 전체 오버레이만 표시 */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* TutorialOverlay는 글로벌하게 렌더링되므로 별도 표시 불필요 */}
        </div>
      )}
    </div>
  );
};


export default TutorialPage; 