import apiClient from './api-client';

/**
 * 이미지 정보 인터페이스
 */
export interface ImageResponse {
  id: string;
  name: string;
  tag: string;
  size: number;
  created_at: string;
  labels?: Record<string, string>;
  repository: string;
  digest?: string;
}

/**
 * 이미지 목록 응답 인터페이스
 */
export interface ImagesResponse {
  total: number;
  page: number;
  limit: number;
  images: ImageResponse[];
}

/**
 * 이미지 삭제 요청 인터페이스
 */
export interface ImageDeleteResponse {
  id: string;
  status: string;
  message?: string;
}

// 이미지 API 함수 정의
export const imagesApi = {
  /**
   * 이미지 목록 조회
   */
  getImages: async (page: number = 1, limit: number = 20) => {
    const response = await apiClient.get<ImagesResponse>('/images', {
      params: { page, limit }
    });
    return response.data;
  },

  /**
   * 이미지 상세 정보 조회
   */
  getImage: async (id: string) => {
    const response = await apiClient.get<ImageResponse>(`/images/${id}`);
    return response.data;
  },

  /**
   * 이미지 삭제
   */
  deleteImage: async (id: string) => {
    const response = await apiClient.delete<ImageDeleteResponse>(`/images/${id}`);
    return response.data;
  },

  /**
   * 이미지 풀(Pull)
   */
  pullImage: async (repository: string, tag: string = 'latest') => {
    const response = await apiClient.post<ImageResponse>('/images/pull', { repository, tag });
    return response.data;
  }
}; 