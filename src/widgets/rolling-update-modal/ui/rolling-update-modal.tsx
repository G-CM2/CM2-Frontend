import { RollingUpdateResponse, RollingUpdateState, useRollingUpdateState, useStartRollingUpdate } from '@/shared/api';
import { Modal } from '@/shared/ui/modal';
import { CheckCircle, Clock, RefreshCw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RollingUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  serviceId: string;
  targetImage: string;
  onComplete: () => void;
}

export const RollingUpdateModal = ({
  isOpen,
  onClose,
  serviceName,
  serviceId,
  targetImage,
  onComplete
}: RollingUpdateModalProps) => {
  const [updateId, setUpdateId] = useState<string | null>(null);
  
  const startRollingUpdateMutation = useStartRollingUpdate();
  const {
    data: updateState,
    isLoading,
    error
  } = useRollingUpdateState(
    serviceId,
    updateId || '',
    !!updateId
  );

  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 상태 초기화
      setUpdateId(null);
      return;
    }

    // 모달이 열릴 때 롤링 업데이트 시작
    if (!updateId && !startRollingUpdateMutation.isPending) {
      startRollingUpdateMutation.mutate(
        { id: serviceId, request: { image: targetImage } },
        {
          onSuccess: (response: RollingUpdateResponse) => {
            setUpdateId(response.updateId);
          },
          onError: () => {
            // 에러 시 모달을 닫고 에러 처리는 부모 컴포넌트에 위임
            onClose();
          }
        }
      );
    }
  }, [isOpen, updateId, serviceId, targetImage, startRollingUpdateMutation, onClose]);

  useEffect(() => {
    // 업데이트 완료 시 처리
    if (updateState?.status === 'completed') {
      // 2초 후 자동으로 모달 닫기 및 완료 콜백 호출
      const timer = setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [updateState?.status, onComplete, onClose]);

  const getStepIcon = (status: 'pending' | 'running' | 'completed') => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepTextColor = (status: 'pending' | 'running' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'running':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  const getOverallProgress = () => {
    if (!updateState) return 0;
    const completedSteps = updateState.steps.filter(step => step.status === 'completed').length;
    return completedSteps;
  };

  // 에러 상태
  if (error || updateState?.status === 'failed') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="롤링 업데이트 실패"
        showCloseButton={true}
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <h4 className="text-lg font-semibold text-red-900">업데이트 실패</h4>
              <p className="text-sm text-red-700">
                롤링 업데이트 중 오류가 발생했습니다. 나중에 다시 시도해주세요.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  // 로딩 상태 또는 업데이트 상태가 없는 경우
  if (isLoading || !updateState) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {}} // 로딩 중에는 닫기 비활성화
        title="롤링 업데이트 시작 중"
        showCloseButton={false}
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <p className="text-center text-gray-600">
            롤링 업데이트를 준비하고 있습니다...
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // 진행 중에는 닫기 비활성화
      title="롤링 업데이트 진행 중"
      showCloseButton={false}
      className="max-w-lg"
    >
      <div className="space-y-6">
        {/* 서비스 정보 */}
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900">{serviceName}</h4>
          <p className="text-sm text-gray-600 font-mono">{serviceId}</p>
          <p className="text-sm text-blue-600 mt-1">→ {targetImage}</p>
        </div>

        {/* 전체 진행률 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">전체 진행률</span>
            <span className="text-gray-600">
              {getOverallProgress()} out of {updateState.totalSteps} tasks
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${(getOverallProgress() / updateState.totalSteps) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* 단계별 진행 상황 */}
        <div className="space-y-3">
          {updateState.steps.map((step: RollingUpdateState['steps'][0], index: number) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {getStepIcon(step.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${getStepTextColor(step.status)}`}>
                    {index + 1}/{updateState.totalSteps}:
                  </span>
                </div>
                <p className={`text-sm ${getStepTextColor(step.status)}`}>
                  {step.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 검증 단계 */}
        {updateState.status === 'verifying' && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-orange-600 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-600">
                  verify: Waiting {updateState.verifyCountdown} seconds to verify that tasks are stable...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 완료 상태 */}
        {updateState.status === 'completed' && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-600">
                  verify: Service {serviceId} converged
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  롤링 업데이트가 성공적으로 완료되었습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 로그 시뮬레이션 */}
        <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
          <div className="space-y-1 text-xs font-mono text-gray-600">
            <div>overall progress: {getOverallProgress()} out of {updateState.totalSteps} tasks</div>
            {updateState.steps.map((step: RollingUpdateState['steps'][0], index: number) => (
              step.status !== 'pending' && (
                <div key={`log-${step.id}`}>
                  {index + 1}/{updateState.totalSteps}: {step.status === 'completed' ? '✓' : '⟳'}
                </div>
              )
            ))}
            {updateState.status === 'verifying' && (
              <div>verify: Waiting {updateState.verifyCountdown} seconds to verify that tasks are stable...</div>
            )}
            {updateState.status === 'completed' && (
              <div>verify: Service {serviceId} converged</div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}; 