import { useTutorialStore } from '@/shared/stores/tutorial-store';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';

interface TutorialMenuProps {
  onClose: () => void;
}

export const TutorialMenu = ({ onClose }: TutorialMenuProps) => {
  const { scenarios, openTutorial } = useTutorialStore();

  const handleStartTutorial = (scenarioId: string) => {
    openTutorial(scenarioId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative w-96 max-w-[90vw] shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>튜토리얼 선택</CardTitle>
            <button
              onClick={onClose}
              className="h-6 w-6 p-0 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Docker 컨테이너 관리 대시보드의 주요 기능들을 단계별로 학습해보세요.
          </p>
          
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                      {scenario.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                      {scenario.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {scenario.steps.length}단계
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        약 {Math.ceil(scenario.steps.length * 1.5)}분
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleStartTutorial(scenario.id)}
                    className="ml-3"
                  >
                    시작
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              💡 튜토리얼은 언제든지 Esc 키를 눌러 중단할 수 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 