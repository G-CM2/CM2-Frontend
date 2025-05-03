import React from 'react';
import { Image } from '@/entities/image/types';
import { formatBytes } from '@/shared/lib';
import { Card } from '@/shared/ui/card/card';

interface ImageCardProps {
  image: Image;
  onDelete?: (id: string) => void;
}

export const ImageCard = ({ image, onDelete }: ImageCardProps) => {
  return (
    <Card title={`${image.repository}${image.tag ? `:${image.tag}` : ''}`}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-500 dark:text-gray-400">ID:</div>
          <div className="text-gray-700 dark:text-gray-300 font-mono">{image.id.substring(0, 12)}</div>
          
          <div className="text-gray-500 dark:text-gray-400">이름:</div>
          <div className="text-gray-700 dark:text-gray-300">{image.name}</div>
          
          <div className="text-gray-500 dark:text-gray-400">태그:</div>
          <div className="text-gray-700 dark:text-gray-300">{image.tag || 'latest'}</div>
          
          <div className="text-gray-500 dark:text-gray-400">크기:</div>
          <div className="text-gray-700 dark:text-gray-300">{formatBytes(image.size)}</div>
          
          <div className="text-gray-500 dark:text-gray-400">생성일:</div>
          <div className="text-gray-700 dark:text-gray-300">
            {new Date(image.created).toLocaleDateString('ko-KR')}
          </div>
        </div>
        
        {image.labels && Object.keys(image.labels).length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">레이블</h4>
            <div className="grid grid-cols-1 gap-1">
              {Object.entries(image.labels).map(([key, value]) => (
                <div key={key} className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded flex justify-between">
                  <span className="font-medium">{key}:</span> 
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {onDelete && (
          <div className="mt-4">
            <button
              onClick={() => {
                if (confirm(`"${image.repository}:${image.tag}" 이미지를 삭제하시겠습니까?`)) {
                  onDelete(image.id);
                }
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              이미지 삭제
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}; 