/**
 * 바이트 크기를 사람이 읽기 쉬운 형태로 변환합니다.
 * 
 * @param bytes 변환할 바이트 수
 * @param decimals 소수점 이하 자릿수 (기본값: 2)
 * @returns 형식화된 크기 문자열 (예: "1.5 KB", "3.2 MB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Unix 타임스탬프를 날짜 형식 문자열로 변환합니다.
 * 
 * @param timestamp Unix 타임스탬프 또는 ISO 날짜 문자열
 * @param locale 날짜 표시에 사용할 로케일 (기본값: 'ko-KR')
 * @returns 형식화된 날짜 문자열
 */
export function formatDate(timestamp: number | string, locale: string = 'ko-KR'): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
} 