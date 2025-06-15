// import { useTutorialStore } from '@/shared/stores/tutorial-store';
// import { useState } from 'react';
// import { TutorialMenu } from './tutorial-menu';
import { TutorialOverlay } from './tutorial-overlay';

export const TutorialWidget = () => {
  // const { isOpen } = useTutorialStore();
  // const [showMenu, setShowMenu] = useState(false);

  // 전역에서 열기 위한 함수 (window.TUTORIAL_OPEN 등으로 연결 가능)
  // if (!isOpen) return null;

  return <TutorialOverlay />;
}; 