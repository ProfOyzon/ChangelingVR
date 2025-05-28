export type LoadingState = 'idle' | 'loading' | 'error';

export interface CachedData<T> {
  status: number;
  data: T;
  cachedAt: number;
}

export interface BaseContent {
  name: string;
  detail: string;
  image_url: string;
}

export interface Identifiable {
  id: string;
}

export interface Keyed {
  key: string;
}
