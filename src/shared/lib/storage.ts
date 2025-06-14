/**
 * localStorage 기반 데이터 관리 유틸리티
 */

const STORAGE_KEYS = {
  SERVICES: 'cm2-services',
  CONTAINERS: 'cm2-containers',
  SYSTEM_SUMMARY: 'cm2-system-summary',
  CLUSTER_NODES: 'cm2-cluster-nodes'
} as const;

export class Storage {
  /**
   * 데이터 저장
   */
  static set<T>(key: keyof typeof STORAGE_KEYS, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEYS[key], serialized);
    } catch (error) {
      console.error(`Failed to save data to localStorage:`, error);
    }
  }

  /**
   * 데이터 조회
   */
  static get<T>(key: keyof typeof STORAGE_KEYS, defaultValue: T): T {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key]);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to load data from localStorage:`, error);
      return defaultValue;
    }
  }

  /**
   * 데이터 존재 여부 확인
   */
  static has(key: keyof typeof STORAGE_KEYS): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS[key]) !== null;
    } catch (error) {
      console.error(`Failed to check data in localStorage:`, error);
      return false;
    }
  }

  /**
   * 데이터 삭제
   */
  static remove(key: keyof typeof STORAGE_KEYS): void {
    try {
      localStorage.removeItem(STORAGE_KEYS[key]);
    } catch (error) {
      console.error(`Failed to remove data from localStorage:`, error);
    }
  }

  /**
   * 모든 데이터 초기화
   */
  static clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error(`Failed to clear localStorage:`, error);
    }
  }

}

export { STORAGE_KEYS };
