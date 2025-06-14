import { handlers } from '@/shared/lib/msw-handlers';
import { setupWorker } from 'msw/browser';

// 브라우저 환경용 MSW 설정
export const worker = setupWorker(...handlers); 