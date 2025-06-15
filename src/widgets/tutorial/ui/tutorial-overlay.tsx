import type { TutorialStep } from '@/shared/stores/tutorial-store';
import { useTutorialStore } from '@/shared/stores/tutorial-store';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TutorialOverlayProps {
  className?: string;
}

export const TutorialOverlay = ({ className }: TutorialOverlayProps) => {
  const navigate = useNavigate();
  const {
    isOpen,
    currentScenario,
    currentStepIndex,
    scenarios,
    closeTutorial,
    nextStep,
    prevStep,
    getCurrentStep
  } = useTutorialStore();

  const [highlightElement, setHighlightElement] = useState<Element | null>(null);
  const [cardStyle, setCardStyle] = useState<{ x: number; y: number; opacity: number }>({ x: 0, y: 0, opacity: 1 });
  const initialRenderRef = useRef(true);

  const currentStep = getCurrentStep();
  const scenario = scenarios.find(s => s.id === currentScenario);

  // 요소 찾기 함수를 별도로 분리
  const findTargetElement = (targetSelector: string): Element | null => {
    // 다양한 방법으로 타겟 요소 찾기
    let targetElement = document.querySelector(`[data-tour="${targetSelector}"]`);
    
    if (!targetElement) {
      // ID로 찾기 시도
      targetElement = document.getElementById(targetSelector);
    }
    
    if (!targetElement) {
      // 클래스명으로 찾기 시도
      targetElement = document.querySelector(`.${targetSelector}`);
    }
    
    if (!targetElement) {
      // 일반 selector로 찾기 시도
      targetElement = document.querySelector(targetSelector);
    }

    // 부분 문자열 매칭 시도 (data-tour)
    if (!targetElement) {
      const allTourElements = document.querySelectorAll('[data-tour]');
      for (const el of allTourElements) {
        const tourValue = el.getAttribute('data-tour');
        if (tourValue && tourValue.includes(targetSelector)) {
          targetElement = el;
          break;
        }
      }
    }

    return targetElement;
  };

  // 카드 위치 계산 함수를 별도로 분리
  const calculateCardPosition = (targetElement: Element, step: TutorialStep) => {
    const rect = targetElement.getBoundingClientRect();
    const placement = step.placement || 'bottom';
    
    const cardWidth = 320; // 튜토리얼 카드 너비
    const cardHeight = 350; // 예상 카드 높이
    const margin = 32; // 여백
    
    let top = 0;
    let left = 0;
    
    // 더 스마트한 위치 계산
    const availableSpaces = {
      top: rect.top - margin,
      bottom: window.innerHeight - rect.bottom - margin,
      left: rect.left - margin,
      right: window.innerWidth - rect.right - margin
    };
    
    // 가장 공간이 많은 곳을 찾기
    const bestPlacement = Object.entries(availableSpaces).reduce((a, b) => 
      availableSpaces[a[0] as keyof typeof availableSpaces] > availableSpaces[b[0] as keyof typeof availableSpaces] ? a : b
    )[0] as keyof typeof availableSpaces;
    
    // 지정된 placement가 공간이 충분하지 않으면 자동으로 최적 위치 선택
    const finalPlacement = availableSpaces[placement as keyof typeof availableSpaces] >= (placement === 'top' || placement === 'bottom' ? cardHeight : cardWidth) 
      ? placement 
      : bestPlacement;
    
    switch (finalPlacement) {
      case 'top':
        top = Math.max(margin, rect.top - cardHeight - margin);
        left = Math.max(margin, Math.min(window.innerWidth - cardWidth - margin, rect.left + rect.width / 2 - cardWidth / 2));
        break;
      case 'bottom':
        top = Math.min(window.innerHeight - cardHeight - margin, rect.bottom + margin);
        left = Math.max(margin, Math.min(window.innerWidth - cardWidth - margin, rect.left + rect.width / 2 - cardWidth / 2));
        break;
      case 'left':
        top = Math.max(margin, Math.min(window.innerHeight - cardHeight - margin, rect.top + rect.height / 2 - cardHeight / 2));
        left = Math.max(margin, rect.left - cardWidth - margin);
        break;
      case 'right':
        top = Math.max(margin, Math.min(window.innerHeight - cardHeight - margin, rect.top + rect.height / 2 - cardHeight / 2));
        left = Math.min(window.innerWidth - cardWidth - margin, rect.right + margin);
        break;
    }
    
    // 특별한 경우: 요소가 매우 크거나 전체 화면을 차지할 때
    if (rect.width > window.innerWidth * 0.5 || rect.height > window.innerHeight * 0.5) {
      // 요소가 큰 경우, 화면에서 겹치지 않는 최적 위치 찾기
      const positions = [
        { top: margin, left: margin }, // 왼쪽 위
        { top: margin, left: window.innerWidth - cardWidth - margin }, // 오른쪽 위
        { top: window.innerHeight - cardHeight - margin, left: margin }, // 왼쪽 아래
        { top: window.innerHeight - cardHeight - margin, left: window.innerWidth - cardWidth - margin } // 오른쪽 아래
      ];
      
      // 요소와 가장 멀리 떨어진 위치 찾기
      let bestPosition = positions[0];
      let maxDistance = 0;
      
      positions.forEach(pos => {
        const centerX = pos.left + cardWidth / 2;
        const centerY = pos.top + cardHeight / 2;
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(centerX - elementCenterX, 2) + 
          Math.pow(centerY - elementCenterY, 2)
        );
        
        if (distance > maxDistance) {
          maxDistance = distance;
          bestPosition = pos;
        }
      });
      
      top = bestPosition.top;
      left = bestPosition.left;
    }
    
    // 최종 경계 확인
    top = Math.max(margin, Math.min(top, window.innerHeight - cardHeight - margin));
    left = Math.max(margin, Math.min(left, window.innerWidth - cardWidth - margin));
    
    // 카드가 타겟 rect와 겹치는지 체크
    const cardRect = { top, left, right: left + cardWidth, bottom: top + cardHeight };
    const targetRect = rect;
    const isOverlap = !(cardRect.right < targetRect.left || cardRect.left > targetRect.right || cardRect.bottom < targetRect.top || cardRect.top > targetRect.bottom);
    if (isOverlap) {
      // 겹치면 반대편으로 이동
      switch (finalPlacement) {
        case 'top':
          top = Math.min(window.innerHeight - cardHeight - margin, rect.bottom + margin);
          break;
        case 'bottom':
          top = Math.max(margin, rect.top - cardHeight - margin);
          break;
        case 'left':
          left = Math.min(window.innerWidth - cardWidth - margin, rect.right + margin);
          break;
        case 'right':
          left = Math.max(margin, rect.left - cardWidth - margin);
          break;
      }
    }
    
    return { x: left, y: top };
  };

  // 튜토리얼 초기 렌더링 시 즉시 실행
  useEffect(() => {
    if (isOpen && currentStep && initialRenderRef.current) {
      initialRenderRef.current = false;
      
      // 즉시 요소를 찾아 하이라이트 시작
      const targetElement = findTargetElement(currentStep.target);
      if (targetElement) {
        console.log('✅ 튜토리얼 초기 렌더링 - 요소 찾음:', currentStep.target);
        setHighlightElement(targetElement);
        
        // 즉시 카드 위치 계산 및 적용 (opacity 1로 설정)
        const position = calculateCardPosition(targetElement, currentStep);
        setCardStyle({ x: position.x, y: position.y, opacity: 1 });
        
        // 하이라이트 클래스 즉시 추가
        targetElement.classList.add('tutorial-highlight');
        
        // 스크롤 및 포커스
        const elementRect = targetElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2);
        
        window.scrollTo({
          top: Math.max(0, middle),
          behavior: 'smooth'
        });
        
        // 포커스 적용
        if (targetElement instanceof HTMLElement) {
          if (targetElement.tabIndex >= 0 || ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'].includes(targetElement.tagName)) {
            setTimeout(() => targetElement.focus({ preventScroll: true }), 100);
          }
        }
      }
    }
  }, [isOpen, currentStep]);

  // 스텝이 변경될 때 실행되는 useEffect
  useEffect(() => {
    if (!isOpen || !currentStep || initialRenderRef.current) {
      return;
    }

    // 요소 찾기 및 하이라이트 적용
    const targetElement = findTargetElement(currentStep.target);
    if (targetElement) {
      setHighlightElement(targetElement);
      
      // 스크롤
      const elementRect = targetElement.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle = absoluteElementTop - (window.innerHeight / 2);
      
      window.scrollTo({
        top: Math.max(0, middle),
        behavior: 'smooth'
      });

      // 스크롤 완료 후 하이라이트 적용
      setTimeout(() => {
        // 카드 위치 계산 및 적용
        const position = calculateCardPosition(targetElement, currentStep);
        setCardStyle({ x: position.x, y: position.y, opacity: 1 });
        
        // 하이라이트 클래스 추가
        targetElement.classList.add('tutorial-highlight');
        
        // 요소에 포커스 강제 적용
        if (targetElement instanceof HTMLElement) {
          if (targetElement.tabIndex >= 0 || ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'].includes(targetElement.tagName)) {
            targetElement.focus({ preventScroll: true });
          }
        }
      }, 300);
    } else {
      console.warn(`❌ 튜토리얼 대상 요소를 찾을 수 없습니다:`, {
        target: currentStep.target,
        availableDataTourElements: Array.from(document.querySelectorAll('[data-tour]')).map(el => ({
          element: el,
          dataTour: el.getAttribute('data-tour'),
          tagName: el.tagName,
          id: el.id,
          className: el.className
        }))
      });
    }

    // cleanup function
    return () => {
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    };
  }, [currentStepIndex, isOpen, currentStep]);

  // 튜토리얼이 닫힐 때 정리
  useEffect(() => {
    if (!isOpen) {
      setHighlightElement(null);
      initialRenderRef.current = true;
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    }
  }, [isOpen]);

  const handleNext = async () => {
    if (!currentStep) return;

    // 액션 실행
    if (currentStep.action === 'navigate' && typeof currentStep.actionData === 'string') {
      navigate(currentStep.actionData);
      // 네비게이션 후 약간의 지연
      await new Promise(resolve => setTimeout(resolve, 500));
    } else if (currentStep.action === 'click' && highlightElement) {
      (highlightElement as HTMLElement).click();
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    nextStep();
  };

  const handlePrevious = () => {
    prevStep();
  };

  const handleSkip = () => {
    closeTutorial();
  };

  if (!isOpen || !currentStep || !scenario) {
    return null;
  }

  return (
    <>
      {/* 글로벌 스타일 추가 */}
      <style>{`
        .tutorial-highlight {
          position: relative;
          z-index: 9999 !important;
          outline: 2px solid #3b82f6 !important;
          outline-offset: 2px !important;
          border-radius: 8px !important;
          transition: outline-color 0.3s, box-shadow 0.3s;
          animation: tutorialPulse 2s infinite;
          pointer-events: auto !important;
          box-shadow: 0 0 12px 2px rgba(59, 130, 246, 0.25) !important;
        }
        @media (prefers-color-scheme: dark) {
          .tutorial-highlight {
            outline: 2px solid #60a5fa !important;
            box-shadow: 0 0 16px 2px rgba(96, 165, 250, 0.35) !important;
          }
        }
        @keyframes tutorialPulse {
          0%, 100% {
            outline-color: #3b82f6;
            box-shadow: 0 0 12px 2px rgba(59, 130, 246, 0.25);
          }
          50% {
            outline-color: #1d4ed8;
            box-shadow: 0 0 20px 4px rgba(59, 130, 246, 0.35);
          }
        }
        .tutorial-fadein {
          animation: tutorialFadeIn 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes tutorialFadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      
      <div className="fixed inset-0 z-[50]">
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-black/50 z-[50]" />
        
        {/* 하이라이트 요소 포커스 */}
        {highlightElement && (() => {
          const rect = highlightElement.getBoundingClientRect();
          return (
            <div
              className="absolute pointer-events-none z-[9998]"
              style={{
                top: rect.top - 12,
                left: rect.left - 12,
                width: rect.width + 24,
                height: rect.height + 24,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                borderRadius: '12px',
              }}
            />
          );
        })()}
      
      {/* 튜토리얼 카드 */}
      <div
        className={`absolute w-80 z-[10001] tutorial-fadein ${className || ''}`}
        style={{
          transform: `translate3d(${cardStyle.x}px, ${cardStyle.y}px, 0)`,
          opacity: cardStyle.opacity,
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
        }}
      >
        <Card className="shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium">
                  {currentStep.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {currentStepIndex + 1} / {scenario.steps.length} - {scenario.title}
                </CardDescription>
              </div>
              <button
                onClick={handleSkip}
                className="h-6 w-6 p-0 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded"
              >
                ✕
              </button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {currentStep.content}
            </p>
            
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-1"
              >
                ← 이전
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="flex items-center gap-1"
                >
                  건너뛰기
                </Button>
                
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="flex items-center gap-1"
                >
                  {currentStepIndex === scenario.steps.length - 1 ? '완료' : '다음 →'}
                </Button>
              </div>
            </div>
            
            {/* 진행률 바 */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>진행률</span>
                <span>{Math.round(((currentStepIndex + 1) / scenario.steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStepIndex + 1) / scenario.steps.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}; 