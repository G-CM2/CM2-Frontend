export interface Image {
  id: string;
  name: string;
  tag: string;
  size: number;
  created: string;
  labels?: Record<string, string>;
  repository: string;
  digest?: string;
} 