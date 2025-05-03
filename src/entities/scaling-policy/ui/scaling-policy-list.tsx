import { useScalingPolicies } from '@/shared/api';
import { ScalingPolicy, ScalingMetric } from '@/shared/api/scaling';

export const ScalingPolicyList = () => {
  const { data, isLoading, isError } = useScalingPolicies();
  const policies = data?.policies || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">오류!</strong>
        <span className="block sm:inline"> 스케일링 정책을 불러오는 중 오류가 발생했습니다.</span>
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
        <strong className="font-bold">알림:</strong>
        <span className="block sm:inline"> 등록된 스케일링 정책이 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {policies.map((policy: ScalingPolicy) => (
        <div key={policy.id} className="border border-gray-200 rounded-md p-4 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{policy.name}</h3>
              <p className="text-sm text-gray-500">ID: {policy.id}</p>
            </div>
            <div className="mt-2 md:mt-0">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {policy.target}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">복제본 범위</p>
              <p className="text-sm">
                최소: <span className="font-medium">{policy.min_replicas}</span> / 
                최대: <span className="font-medium">{policy.max_replicas}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">생성 시간</p>
              <p className="text-sm">{new Date(policy.created_at).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500 mb-2">메트릭 임계값</p>
            <div className="flex flex-wrap gap-2">
              {policy.metrics.map((metric: ScalingMetric, idx: number) => (
                <div 
                  key={idx} 
                  className={`px-3 py-1 rounded-full text-xs ${
                    metric.type === 'cpu' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {metric.type === 'cpu' ? 'CPU' : '메모리'} {metric.target_value}%
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 