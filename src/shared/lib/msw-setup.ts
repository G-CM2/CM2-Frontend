import { setupWorker } from 'msw/browser';
import { handlers } from './msw-handlers';

/**
 * MSW 워커 설정
 */
export const worker = setupWorker(...handlers);

/**
 * MSW 시작 함수
 */
export async function startMSW() {
  if (typeof window !== 'undefined') {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js'
        }
      });
      console.log('🔶 MSW가 시작되었습니다');
    } catch (error) {
      console.error('MSW 시작 실패:', error);
    }
  }
}

/**
 * MSW 중지 함수
 */
export function stopMSW() {
  if (typeof window !== 'undefined') {
    worker.stop();
    console.log('🔶 MSW가 중지되었습니다');
  }
} 