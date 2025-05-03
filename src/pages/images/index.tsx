import React from 'react';
import { ImageList } from '@/entities/image';
import { Layout } from '@/widgets/layout';

export const ImagesPage = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">도커 이미지 관리</h1>
      <ImageList />
    </Layout>
  );
};

export default ImagesPage; 