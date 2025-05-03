import { useState } from 'react';
import { CreateScalingPolicyRequest, ScalingMetric, useCreateScalingPolicy } from '@/shared/api';
import { Card } from '@/shared/ui/card/card';

interface CreateScalingPolicyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateScalingPolicyForm = ({ onSuccess, onCancel }: CreateScalingPolicyFormProps) => {
  const [name, setName] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  const [minReplicas, setMinReplicas] = useState<number>(1);
  const [maxReplicas, setMaxReplicas] = useState<number>(5);
  const [metrics, setMetrics] = useState<ScalingMetric[]>([
    { type: 'cpu', target_value: 70 }
  ]);
  
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const createPolicyMutation = useCreateScalingPolicy();

  const handleAddMetric = () => {
    // CPU와 메모리 메트릭이 모두 있는지 확인
    const hasMemory = metrics.some(m => m.type === 'memory');
    const hasCpu = metrics.some(m => m.type === 'cpu');
    
    if (!hasMemory) {
      setMetrics([...metrics, { type: 'memory', target_value: 70 }]);
    } else if (!hasCpu) {
      setMetrics([...metrics, { type: 'cpu', target_value: 70 }]);
    }
  };

  const handleRemoveMetric = (index: number) => {
    const newMetrics = [...metrics];
    newMetrics.splice(index, 1);
    setMetrics(newMetrics);
  };

  const handleMetricChange = (index: number, field: 'type' | 'target_value', value: string | number) => {
    const newMetrics = [...metrics];
    if (field === 'type') {
      newMetrics[index].type = value as 'cpu' | 'memory';
    } else {
      newMetrics[index].target_value = Number(value);
    }
    setMetrics(newMetrics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setFormError('정책 이름을 입력해주세요.');
      return;
    }
    
    if (!target.trim()) {
      setFormError('대상 컨테이너를 입력해주세요.');
      return;
    }
    
    if (minReplicas < 1) {
      setFormError('최소 복제본 수는 1 이상이어야 합니다.');
      return;
    }
    
    if (maxReplicas <= minReplicas) {
      setFormError('최대 복제본 수는 최소 복제본 수보다 커야 합니다.');
      return;
    }
    
    if (metrics.length === 0) {
      setFormError('최소 하나 이상의 메트릭을 설정해주세요.');
      return;
    }
    
    try {
      setFormError(null);
      
      const policyData: CreateScalingPolicyRequest = {
        name,
        target,
        min_replicas: minReplicas,
        max_replicas: maxReplicas,
        metrics
      };
      
      await createPolicyMutation.mutateAsync(policyData);
      setSuccess(true);
      
      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('스케일링 정책 생성 중 오류:', err);
      setFormError('스케일링 정책을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (success) {
    return (
      <Card className="bg-white shadow-md p-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2">스케일링 정책이 성공적으로 생성되었습니다!</h2>
          <p className="text-gray-500 mb-4">새로운 스케일링 정책이 시스템에 적용되었습니다.</p>
          <button
            onClick={() => {
              setSuccess(false);
              setName('');
              setTarget('');
              setMinReplicas(1);
              setMaxReplicas(5);
              setMetrics([{ type: 'cpu', target_value: 70 }]);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            새 정책 만들기
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">새 자동 스케일링 정책 생성</h2>
      
      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{formError}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            정책 이름 *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            placeholder="예: 웹 서버 스케일링"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
            대상 컨테이너 또는 서비스 *
          </label>
          <input
            type="text"
            id="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            placeholder="예: nginx-server"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="minReplicas" className="block text-sm font-medium text-gray-700 mb-1">
              최소 복제본 수 *
            </label>
            <input
              type="number"
              id="minReplicas"
              value={minReplicas}
              onChange={(e) => setMinReplicas(parseInt(e.target.value))}
              min="1"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="maxReplicas" className="block text-sm font-medium text-gray-700 mb-1">
              최대 복제본 수 *
            </label>
            <input
              type="number"
              id="maxReplicas"
              value={maxReplicas}
              onChange={(e) => setMaxReplicas(parseInt(e.target.value))}
              min={minReplicas + 1}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              메트릭 임계값 *
            </label>
            {metrics.length < 2 && (
              <button
                type="button"
                onClick={handleAddMetric}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                + 메트릭 추가
              </button>
            )}
          </div>
          
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <select
                value={metric.type}
                onChange={(e) => handleMetricChange(index, 'type', e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="cpu">CPU</option>
                <option value="memory">메모리</option>
              </select>
              <input
                type="number"
                value={metric.target_value}
                onChange={(e) => handleMetricChange(index, 'target_value', e.target.value)}
                min="1"
                max="100"
                className="w-20 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
              <span className="text-gray-700">%</span>
              {metrics.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMetric(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              )}
            </div>
          ))}
          
          <p className="text-xs text-gray-500 mt-1">
            설정한 메트릭 사용량이 임계값을 초과하면 자동 스케일링이 시작됩니다.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={createPolicyMutation.isPending}
          >
            {createPolicyMutation.isPending ? '처리 중...' : '정책 생성'}
          </button>
        </div>
      </form>
    </Card>
  );
}; 