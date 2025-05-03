import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { imagesApi } from '@/shared/api';

/**
 * 이미지 목록을 조회하는 훅
 */
export const useImages = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['images', page, limit],
    queryFn: () => imagesApi.getImages(page, limit)
  });
};

/**
 * 특정 이미지의 상세 정보를 조회하는 훅
 */
export const useImage = (id: string) => {
  return useQuery({
    queryKey: ['image', id],
    queryFn: () => imagesApi.getImage(id),
    enabled: !!id
  });
};

/**
 * 이미지 삭제 기능을 위한 훅
 */
export const useImageDelete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => imagesApi.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  });
};

/**
 * 이미지 풀(Pull) 기능을 위한 훅
 */
export const useImagePull = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ repository, tag }: { repository: string, tag?: string }) => 
      imagesApi.pullImage(repository, tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  });
}; 