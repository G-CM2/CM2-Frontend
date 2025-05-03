import apiClient from './api-client';

/**
 * 타임라인 항목 인터페이스
 */
export interface TimelineItem {
  timestamp: string;
  event: string;
  details: string;
}

/**
 * 컨테이너 타임라인 데이터포인트 인터페이스
 */
export interface TimelineDatapoint {
  timestamp: string;
  status: string;
  cpu_usage: number;
  memory_usage: number;
}

/**
 * 컨테이너 타임라인 응답 인터페이스
 */
export interface ContainerTimelineResponse {
  component_id: string;
  from: string;
  to: string;
  datapoints: TimelineDatapoint[];
}

// 타임라인 API 함수 정의
export const timelineApi = {
  /**
   * 컨테이너 타임라인 조회
   */
  getContainerTimeline: async (containerId: string) => {
    const response = await apiClient.get<ContainerTimelineResponse>(`/timeline/${containerId}`);
    return response.data;
  },

  /**
   * 컨테이너 이벤트 타임라인 조회
   */
  getContainerEventTimeline: async (containerId: string) => {
    const response = await apiClient.get<TimelineItem[]>(`/containers/${containerId}/timeline`);
    return response.data;
  }
}; 