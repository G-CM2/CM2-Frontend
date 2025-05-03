import { ContainerList } from '@/entities/container';

export const ContainerListPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">컨테이너 목록</h1>
      <ContainerList />
    </div>
  );
}; 