# 컨테이너 제어 기능

이 폴더는 Docker 컨테이너 제어와 관련된 기능을 담고 있습니다.

## 구조

- `ui/` - 컨테이너 제어 관련 UI 컴포넌트
  - `container-action-button.tsx` - 컨테이너 액션(시작, 중지, 재시작 등) 실행 버튼 컴포넌트
- `index.ts` - 공개 API

## 액션 타입

컨테이너에 수행할 수 있는 액션:
- `start`: 컨테이너 시작
- `stop`: 컨테이너 중지
- `restart`: 컨테이너 재시작
- `pause`: 컨테이너 일시 중지
- `unpause`: 컨테이너 일시 중지 해제

## 사용법

```tsx
import { ContainerActionButton } from '@/features/container-control';
import { useState } from 'react';
import { ContainerActionResponse } from '@/shared/api';

export const ContainerControls = ({ containerId }: { containerId: string }) => {
  const [status, setStatus] = useState<string>('');
  
  const handleActionComplete = (response: ContainerActionResponse) => {
    setStatus(response.status);
    // 추가 작업 수행...
  };

  return (
    <div className="flex space-x-2">
      <ContainerActionButton 
        containerId={containerId}
        action="start"
        label="시작"
        variant="primary"
        onActionComplete={handleActionComplete}
      />
      
      <ContainerActionButton 
        containerId={containerId}
        action="stop"
        label="중지"
        variant="danger"
        onActionComplete={handleActionComplete}
      />
      
      <ContainerActionButton 
        containerId={containerId}
        action="restart"
        label="재시작"
        variant="secondary"
        onActionComplete={handleActionComplete}
      />
    </div>
  );
};
```

## API와의 통합

이 기능은 `@/shared/api`의 `performContainerAction` API를 사용하여 백엔드와 통신합니다. 