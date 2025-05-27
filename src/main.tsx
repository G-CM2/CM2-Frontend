import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import './index.css'

async function bootstrap() {
  // 개발 환경에서만 MSW 적용
  // 일단은 모든 환경에서 적용
    const { worker } = await import('./shared/api/mock')
    await worker.start({
      serviceWorker:{
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
      onUnhandledRequest: 'bypass', // 처리되지 않은 요청은 실제 네트워크로 전달
    })
    console.log('[MSW] 모킹 서버가 시작되었습니다.')

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

bootstrap()
