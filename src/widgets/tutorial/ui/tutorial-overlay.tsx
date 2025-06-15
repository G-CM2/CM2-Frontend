import { useTutorialStore } from '@/shared/stores/tutorial-store';
import { useEffect, useMemo } from 'react';
import Joyride, { CallBackProps, Step } from 'react-joyride';

export const TutorialOverlay = () => {
  const {
    isOpen,
    currentScenario,
    currentStepIndex,
    nextStep,
    prevStep,
    closeTutorial,
    setServiceCreateFormOpen,
  } = useTutorialStore();

  // Joyride 스텝 변환
  const steps: Step[] = useMemo(() => {
    if (!currentScenario) return [];
    return currentScenario.steps.map((step) => ({
      target: step.target,
      title: step.title,
      content: step.content,
      placement: step.placement || 'bottom',
      disableBeacon: true,
      spotlightClicks: true,
      locale: {
        back: '이전',
        close: '닫기',
        last: '완료',
        next: '다음',
        skip: '건너뛰기',
      },
    }));
  }, [currentScenario]);

  // 튜토리얼 단계 진입 시 서비스 생성 폼 상태 자동 제어
  useEffect(() => {
    if (!isOpen || !currentScenario) return;
    
    // 서비스 생명주기 관리 튜토리얼인 경우 폼 자동 열기 방지
    if (currentScenario.id === 'service-lifecycle') {
      // 서비스 생명주기 관리에서는 폼을 자동으로 열지 않음
      return;
    }
    
    const step = currentScenario.steps[currentStepIndex];
    if (!step) return;
    
    // 다른 튜토리얼에서는 기존 로직 유지
    if (step.target === '[data-tour="create-service-button"]') {
      setServiceCreateFormOpen(true);
    }
    
    if (step.target === '[data-tour="service-list"]' || step.target === '[data-tour="scale-up-button"]') {
      setServiceCreateFormOpen(false);
    }
  }, [isOpen, currentScenario, currentStepIndex, setServiceCreateFormOpen]);

  // 페이지 이동 후 현재 단계의 target이 없으면 무조건 nextStep()
  useEffect(() => {
    if (!isOpen || !currentScenario) return;
    const step = currentScenario.steps[currentStepIndex];
    if (!step) return;
    
    // 현재 타겟 요소가 존재하는지 확인
    const currentEl = document.querySelector(step.target);
    
    // 타겟 요소가 없고 클릭 액션이 필요한 단계인 경우 다음 단계로 이동
    if (!currentEl) {
      setTimeout(() => {
        nextStep();
      }, 200); // DOM 안정화 대기
    }
  }, [isOpen, currentScenario, currentStepIndex, nextStep]);

  if (!isOpen || !currentScenario) return null;

  return (
    <Joyride
      steps={steps}
      stepIndex={currentStepIndex}
      run={isOpen}
      continuous
      showProgress
      showSkipButton
      locale={{
        back: '이전',
        close: '닫기',
        last: '완료',
        next: '다음',
        skip: '건너뛰기',
      }}
      styles={{
        options: {
          zIndex: 9999,
          primaryColor: '#2563eb',
          textColor: '#222',
        },
      }}
      callback={(data: CallBackProps) => {
        if (data.type === 'step:after' && data.action === 'next') {
          const step = currentScenario.steps[currentStepIndex];
          if (step && step.action === 'click' && step.target) {
            const el = document.querySelector(step.target) as HTMLElement;
            if (el) {
              el.click();
              // 클릭 액션 후 다음 단계로 이동 (페이지 이동 발생할 수 있으므로 약간의 지연 추가)
              setTimeout(() => {
                nextStep();
              }, 100);
              return;
            }
          }
          nextStep();
        } else if (data.type === 'step:after' && data.action === 'prev') {
          prevStep();
        } else if (data.type === 'tour:end' || data.status === 'finished' || data.status === 'skipped') {
          closeTutorial();
        }
      }}
    />
  );
};
