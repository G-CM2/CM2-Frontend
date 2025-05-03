import { useState } from 'react';
import { Layout } from '@/widgets/layout';
import { ScalingPolicyList } from '@/entities/scaling-policy';
import { CreateScalingPolicyForm } from '@/features/scaling-policy-form';
import { Card } from '@/shared/ui/card/card';

export const ScalingPolicyPage = () => {
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleAddNewClick = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSuccess = () => {
    // 폼 닫기 (tanstack query가 자동으로 목록을 새로고침함)
    setTimeout(() => {
      setShowForm(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">자동 스케일링 정책</h1>
          
          {!showForm && (
            <button
              onClick={handleAddNewClick}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              새 정책 추가
            </button>
          )}
        </div>

        {showForm ? (
          <Card title="새 스케일링 정책 생성">
            <CreateScalingPolicyForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </Card>
        ) : (
          <>
            <Card title="자동 스케일링이란?">
              <p className="text-gray-700 mb-3">
                자동 스케일링은 워크로드의 변화에 따라 컨테이너 인스턴스 수를 자동으로 조정하는 기능입니다.
                높은 CPU 또는 메모리 사용량이 감지되면 시스템은 추가 인스턴스를 자동으로 생성하고,
                사용량이 낮아지면 불필요한 인스턴스를 제거합니다.
              </p>
              <p className="text-gray-700">
                이를 통해 리소스를 효율적으로 사용하고 성능 병목 현상을 방지할 수 있습니다.
              </p>
            </Card>

            <Card title="정책 목록">
              <ScalingPolicyList />
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}; 